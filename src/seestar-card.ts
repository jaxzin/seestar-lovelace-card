/**
 * `seestar-card` — a Home Assistant custom Lovelace card for the Seestar
 * bridge (the **Glance** concept).
 *
 * The card takes a single `device: <prefix>` config, resolves the ~46
 * name-derived entity ids into a typed {@link SeestarSession} (see
 * `./entities`), applies the per-mode adaptation rules (see `./modes`), and
 * renders a hero-forward glance panel: a 16:10 stacked-image hero with a
 * Saved/Live toggle and status badge, a stacking donut + sky dial (or a
 * terrestrial framing box for scenery), detected-object chips, a status-chip
 * wrap, and an Arm switch that reveals wired action buttons.
 *
 * All colours come from Home Assistant CSS custom properties so the card tracks
 * the active light/dark theme automatically.
 */
import { LitElement, css, html, nothing, type CSSResultGroup, type TemplateResult } from 'lit';
import { property, state } from 'lit/decorators.js';
import { resolve } from './entities.js';
import { deriveDisplaySession, EMPTY_VALUE, type ActionModel, type ActionTone, type BadgeKind, type DisplaySession } from './modes.js';
import { haIconName } from './components/index.js';
import './components/index.js';
import type { ActionConfig, HomeAssistant, LovelaceCard, SeestarCardConfig } from './types.js';

/** The custom element tag Lovelace instantiates for `type: custom:seestar-card`. */
const CARD_TAG = 'seestar-card';

/** The editor element tag returned by {@link SeestarCard.getConfigElement}. */
const EDITOR_TAG = 'seestar-card-editor';

/** Masonry-layout size hint returned to Lovelace (~6 rows for the Glance card). */
const CARD_SIZE_ROWS = 6;

/** Diameter of the stacking donut / sky dial, in px (design uses 106). */
const DIAL_SIZE = 106;

/** The `window.customCards` registry entry Lovelace's card picker reads. */
interface CustomCardEntry {
  readonly type: string;
  readonly name: string;
  readonly description: string;
  readonly preview?: boolean;
}

/** `window` augmented with the Lovelace custom-card registry array. */
interface WindowWithCards extends Window {
  customCards?: CustomCardEntry[];
}

/** The themed fill + foreground for an action-button tone. */
interface ActionColors {
  readonly bg: string;
  readonly fg: string;
}

/**
 * Default control wiring: the bridge's command **button** entities are
 * name-derived and deterministic (`button.<device>_<suffix>`), so when the
 * user gives no explicit `actions:` config the card auto-wires each action to
 * its canonical entity — but only if that entity actually exists in `hass`
 * (older bridges without Phase-2 controls keep the button disabled).
 * An explicit `actions.<key>` always wins over the default.
 */
const DEFAULT_ACTION_BUTTON_SUFFIX: Readonly<Record<string, string>> = {
  stop_session: 'stop',
  pause_plan: 'pause_plan',
  goto: 'goto',
  park: 'park',
  start_session: 'start_live_view',
};

/** HA service that presses a `button` entity. */
const BUTTON_PRESS_SERVICE = 'button.press';

/** Caption of the Saved image: the last stack the scope saved to disk. */
const SAVED_STACK_LABEL = 'Last saved stack';

/** Tone → button colours, matching the design's `styleFor` mapping exactly. */
const ACTION_COLORS: Readonly<Record<ActionTone, ActionColors>> = {
  primary: { bg: 'var(--primary-color)', fg: '#fff' },
  tonal: { bg: 'color-mix(in srgb, var(--primary-color) 13%, transparent)', fg: 'var(--primary-color)' },
  danger: {
    bg: 'color-mix(in srgb, var(--error-color, #db4437) 12%, transparent)',
    fg: 'var(--error-color, #db4437)',
  },
  neutral: { bg: 'var(--secondary-background-color, rgba(127, 127, 127, 0.12))', fg: 'var(--primary-text-color)' },
};

/**
 * The Seestar Lovelace card element.
 *
 * `hass` is assigned by HA on every state change and `config` once at setup;
 * Lit re-renders reactively when either changes. The `armed` and `live` UI
 * states are card-local (`@state`) — arming is off by default for safety, and
 * the Saved/Live toggle defaults to Saved.
 */
export class SeestarCard extends LitElement implements LovelaceCard {
  /** Injected by Home Assistant on every state change. */
  @property({ attribute: false }) public hass?: HomeAssistant;

  /** The validated user config; set once via {@link setConfig}. */
  @state() private config?: SeestarCardConfig;

  /** Whether the controls are armed. Off by default for safety. */
  @state() private armed = false;

  /**
   * The user's Saved/Live choice, or `undefined` to follow the scope: the live
   * camera while it carries the stack in progress or live video, else Saved.
   */
  @state() private live?: boolean;

  /** Pending re-render for when frame freshness stops implying STACKING. */
  private stackingExpiryTimer?: number;

  public override connectedCallback(): void {
    super.connectedCallback();
    // The expiry timer is dropped while detached; re-derive so a lapsed
    // STACKING badge doesn't survive a reattach with unchanged `hass`.
    this.requestUpdate();
  }

  public override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.clearStackingExpiry();
  }

  private clearStackingExpiry(): void {
    if (this.stackingExpiryTimer !== undefined) {
      window.clearTimeout(this.stackingExpiryTimer);
      this.stackingExpiryTimer = undefined;
    }
  }

  /**
   * The STACKING badge can lapse with no HA state change (frames simply stop
   * arriving), so re-render just after the derivation's freshness deadline.
   */
  private scheduleStackingExpiry(expiresAtMs: number | undefined): void {
    this.clearStackingExpiry();
    if (expiresAtMs === undefined || !this.isConnected) {
      return;
    }
    const delayMs = Math.max(0, expiresAtMs - Date.now()) + 1;
    this.stackingExpiryTimer = window.setTimeout(() => {
      this.stackingExpiryTimer = undefined;
      this.requestUpdate();
    }, delayMs);
  }

  /** Lazily returns the config-editor element for the Lovelace UI editor. */
  public static getConfigElement(): HTMLElement {
    return document.createElement(EDITOR_TAG);
  }

  /** A minimal starter config for the card picker's "Add card" flow. */
  public static getStubConfig(): SeestarCardConfig {
    return { type: `custom:${CARD_TAG}`, device: 'seestar_s30_pro' };
  }

  public static readonly styles: CSSResultGroup = css`
    :host {
      --seestar-accent: var(--primary-color);
    }
    ha-card {
      display: block;
      overflow: hidden;
      font-family: var(--paper-font-body1_-_font-family, Roboto, system-ui, sans-serif);
      background: var(--card-background-color, var(--ha-card-background));
      border-radius: var(--ha-card-border-radius, 12px);
      box-shadow: var(--ha-card-box-shadow, 0 2px 6px rgba(0, 0, 0, 0.1));
    }

    /* ---- hero ---- */
    .hero {
      position: relative;
      width: 100%;
      aspect-ratio: 16 / 10;
      background: #05070c;
      overflow: hidden;
    }
    .hero img {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      object-fit: contain;
      object-position: center;
      display: block;
    }
    .hero-placeholder {
      position: absolute;
      inset: 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 7px;
    }
    .hero-stripes {
      position: absolute;
      inset: 0;
      background-image: repeating-linear-gradient(
        135deg,
        rgba(255, 255, 255, 0.04) 0 11px,
        rgba(255, 255, 255, 0) 11px 22px
      );
    }
    .hero-placeholder ha-icon {
      --mdc-icon-size: 34px;
      width: 34px;
      height: 34px;
      color: rgba(255, 255, 255, 0.42);
      z-index: 1;
    }
    .hero-label {
      font-family: 'Roboto Mono', ui-monospace, monospace;
      font-size: 11px;
      letter-spacing: 0.09em;
      color: rgba(255, 255, 255, 0.6);
      z-index: 1;
    }
    .hero-hint {
      font-family: 'Roboto Mono', ui-monospace, monospace;
      font-size: 9.5px;
      letter-spacing: 0.05em;
      color: rgba(255, 255, 255, 0.5);
      z-index: 1;
    }
    .hero-media {
      position: absolute;
      inset: 0;
      cursor: pointer;
      padding: 0;
      border: none;
      background: none;
      display: block;
    }
    .hero-media:focus-visible {
      outline: 2px solid var(--primary-color);
      outline-offset: -2px;
    }
    .scrim-top {
      position: absolute;
      left: 0;
      right: 0;
      top: 0;
      height: 60px;
      background: linear-gradient(to bottom, rgba(0, 0, 0, 0.5), transparent);
      pointer-events: none;
    }
    .scrim-bottom {
      position: absolute;
      left: 0;
      right: 0;
      bottom: 0;
      height: 96px;
      background: linear-gradient(to top, rgba(0, 0, 0, 0.72), transparent);
      pointer-events: none;
    }

    /* ---- hero controls ---- */
    .source-toggle {
      position: absolute;
      top: 11px;
      left: 11px;
      display: flex;
      padding: 3px;
      gap: 2px;
      border-radius: 9px;
      background: rgba(20, 20, 22, 0.55);
      backdrop-filter: blur(6px);
    }
    .source-toggle button {
      position: relative;
      border: none;
      cursor: pointer;
      height: 26px;
      padding: 0 11px;
      border-radius: 7px;
      font-family: inherit;
      font-size: 12px;
      font-weight: 500;
      display: inline-flex;
      align-items: center;
      gap: 5px;
    }
    /* a11y: extend the pressable target to >=36px without growing the 26px pill */
    .source-toggle button::after {
      content: '';
      position: absolute;
      top: -5px;
      bottom: -5px;
      left: 0;
      right: 0;
    }
    .source-toggle ha-icon {
      --mdc-icon-size: 14px;
      width: 14px;
      height: 14px;
    }
    /* Live glyph reads 15px in the design; Saved stays 14px. */
    .source-toggle button.live-source ha-icon {
      --mdc-icon-size: 15px;
      width: 15px;
      height: 15px;
    }
    .source-toggle button.active {
      background: rgba(255, 255, 255, 0.92);
      color: #16181d;
    }
    .source-toggle button.inactive {
      background: transparent;
      color: rgba(255, 255, 255, 0.88);
    }
    .badge {
      position: absolute;
      top: 13px;
      right: 12px;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      height: 26px;
      padding: 0 10px;
      border-radius: 13px;
      background: rgba(20, 20, 22, 0.55);
      backdrop-filter: blur(6px);
      color: #fff;
      font-size: 11.5px;
      font-weight: 500;
      letter-spacing: 0.03em;
    }
    .badge-dot {
      width: 7px;
      height: 7px;
      border-radius: 50%;
    }
    .badge-dot.stacking {
      background: var(--primary-color);
      box-shadow: 0 0 0 3px color-mix(in srgb, var(--primary-color) 30%, transparent);
    }
    .badge-dot.live {
      background: #ff5252;
      box-shadow: 0 0 0 3px rgba(255, 82, 82, 0.28);
    }
    /* Unknown stacking state: a muted, glow-less dot — the badge claims nothing. */
    .badge-dot.idle {
      background: var(--disabled-text-color, #9b9b9b);
    }
    .hero-caption {
      position: absolute;
      left: 15px;
      bottom: 12px;
      right: 15px;
      color: #fff;
      /* non-interactive overlay: let clicks fall through to the hero media */
      pointer-events: none;
    }
    .hero-target {
      font-size: 19px;
      font-weight: 500;
      line-height: 1.15;
    }
    .hero-mode {
      font-size: 12.5px;
      opacity: 0.82;
      margin-top: 1px;
    }

    /* ---- body ---- */
    .body {
      padding: 14px 14px 15px;
      display: flex;
      flex-direction: column;
      gap: 13px;
    }
    .dials {
      display: flex;
      gap: 6px;
      justify-content: space-around;
      align-items: flex-start;
    }
    .v-divider {
      width: 1px;
      align-self: stretch;
      background: var(--divider-color);
    }
    .stars-note {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      font-size: 11.5px;
      color: var(--secondary-text-color);
      margin-top: -4px;
    }
    .stars-note ha-icon {
      --mdc-icon-size: 14px;
      width: 14px;
      height: 14px;
    }
    .stars-note b {
      color: var(--primary-text-color);
      font-weight: 500;
    }
    .stars-note.daylight b {
      color: var(--disabled-text-color, var(--secondary-text-color));
    }

    /* ---- terrestrial box ---- */
    .terrestrial {
      display: flex;
      align-items: center;
      gap: 13px;
      padding: 8px 4px;
      border: 1px dashed var(--divider-color);
      border-radius: 10px;
    }
    .terrestrial > ha-icon {
      --mdc-icon-size: 30px;
      width: 30px;
      height: 30px;
      color: var(--state-icon-color, var(--secondary-text-color));
    }
    .terrestrial-text {
      flex: 1;
      min-width: 0;
    }
    .terrestrial-title {
      font-size: 13.5px;
      font-weight: 500;
      color: var(--primary-text-color);
    }
    .terrestrial-sub {
      font-size: 11.5px;
      color: var(--secondary-text-color);
    }
    .terrestrial-exposure {
      text-align: right;
    }
    .terrestrial-exposure .value {
      font-size: 14px;
      font-weight: 500;
      color: var(--primary-text-color);
    }
    .terrestrial-exposure .caption {
      font-size: 10.5px;
      color: var(--secondary-text-color);
      text-transform: uppercase;
      letter-spacing: 0.04em;
    }

    /* ---- detected objects ---- */
    .detected {
      display: flex;
      flex-direction: column;
      gap: 7px;
    }
    .detected-header {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 11px;
      color: var(--secondary-text-color);
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    .detected-header ha-icon {
      --mdc-icon-size: 14px;
      width: 14px;
      height: 14px;
    }
    .chip-wrap {
      display: flex;
      flex-wrap: wrap;
      gap: 7px;
    }

    /* ---- arm row ---- */
    .h-divider {
      height: 1px;
      background: var(--divider-color);
    }
    .arm-row {
      display: flex;
      align-items: center;
      gap: 11px;
    }
    .arm-row > ha-icon {
      --mdc-icon-size: 21px;
      width: 21px;
      height: 21px;
    }
    .arm-text {
      flex: 1;
      min-width: 0;
    }
    .arm-title {
      font-size: 13.5px;
      font-weight: 500;
      color: var(--primary-text-color);
    }
    .arm-sub {
      font-size: 11.5px;
      color: var(--secondary-text-color);
    }
    .switch {
      position: relative;
      width: 40px;
      height: 23px;
      border-radius: 12px;
      cursor: pointer;
      flex: none;
      background: color-mix(in srgb, var(--secondary-text-color) 40%, transparent);
      transition: background 0.18s ease;
      border: none;
      padding: 0;
    }
    .switch.on {
      background: var(--primary-color);
    }
    .switch:focus-visible {
      outline: 2px solid var(--primary-color);
      outline-offset: 2px;
    }
    /* a11y: extend the pressable target to >=36px without growing the 40x23 pill */
    .switch::after {
      content: '';
      position: absolute;
      top: -6.5px;
      bottom: -6.5px;
      left: 0;
      right: 0;
    }
    .switch .knob {
      position: absolute;
      top: 2.5px;
      left: 2.5px;
      width: 18px;
      height: 18px;
      border-radius: 50%;
      background: #fff;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.35);
      transition: left 0.18s ease;
    }
    .switch.on .knob {
      left: 19.5px;
    }

    /* ---- actions ---- */
    .actions {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      padding-top: 2px;
    }
    .actions button {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      height: 36px;
      padding: 0 14px;
      border: none;
      border-radius: 8px;
      font-family: inherit;
      font-size: 13px;
      font-weight: 500;
      cursor: pointer;
    }
    .actions button:disabled {
      cursor: not-allowed;
      opacity: 0.5;
    }
    .actions button ha-icon {
      --mdc-icon-size: 17px;
      width: 17px;
      height: 17px;
    }
  `;

  /** HA calls this once with the user's YAML; validate the required `device`. */
  public setConfig(config: unknown): void {
    if (typeof config !== 'object' || config === null) {
      throw new Error('seestar-card: config must be an object');
    }
    const candidate = config as Partial<SeestarCardConfig>;
    if (typeof candidate.device !== 'string' || candidate.device.length === 0) {
      throw new Error('seestar-card: `device` (the entity-id prefix) is required');
    }
    this.config = candidate as SeestarCardConfig;
  }

  /** Masonry-layout size hint for Lovelace. */
  public getCardSize(): number {
    return CARD_SIZE_ROWS;
  }

  /** Toggle the arm switch (card-local safety gate). */
  private toggleArmed(): void {
    this.armed = !this.armed;
  }

  /** Keyboard handler for the arm switch: Enter / Space toggle it. */
  private onArmKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter' || event.key === ' ' || event.key === 'Spacebar') {
      event.preventDefault();
      this.toggleArmed();
    }
  }

  /** Show the saved still in the hero. */
  private showSaved(): void {
    this.live = false;
  }

  /** Show the live video view in the hero. */
  private showLive(): void {
    this.live = true;
  }

  /** Whether the hero shows the live camera (see {@link live}). */
  private showsLive(display: DisplaySession): boolean {
    return this.live ?? (display.liveImage !== undefined && display.badge !== 'idle');
  }

  /**
   * Open HA's more-info dialog (the full-size camera view) for whichever
   * source the hero is showing: Saved -> the stacked-preview camera,
   * Live -> the live-view camera.
   */
  private openHeroMoreInfo(display: DisplaySession): void {
    const entityId = this.showsLive(display) ? display.liveCameraEntityId : display.cameraEntityId;
    this.dispatchEvent(
      new CustomEvent('hass-more-info', {
        detail: { entityId },
        bubbles: true,
        composed: true,
      }),
    );
  }

  /**
   * Run a configured HA action by key. No-op when unconfigured (the button is
   * disabled anyway); otherwise dispatches `hass.callService(domain, service)`
   * with the config's data payload.
   */
  private runAction(action: ActionConfig | undefined): void {
    const service = action?.service;
    if (action === undefined || service === undefined || this.hass === undefined) {
      return;
    }
    const [domain, name] = service.split('.', 2);
    if (domain === undefined || name === undefined || name.length === 0) {
      return;
    }
    void this.hass.callService(domain, name, action.data);
  }

  /**
   * The effective service for an action key: the user's explicit
   * `actions.<key>` config, else the default wiring to the bridge's canonical
   * command button — when that entity exists in the current `hass` states.
   */
  private actionConfig(key: string): ActionConfig | undefined {
    const explicit = this.config?.actions?.[key];
    if (explicit !== undefined) {
      return explicit;
    }
    const suffix = DEFAULT_ACTION_BUTTON_SUFFIX[key];
    const device = this.config?.device;
    if (suffix === undefined || device === undefined || this.hass === undefined) {
      return undefined;
    }
    const entityId = `button.${device}_${suffix}`;
    if (this.hass.states[entityId] === undefined) {
      return undefined;
    }
    return { service: BUTTON_PRESS_SERVICE, data: { entity_id: entityId } };
  }

  /** The hero's camera image. */
  private renderHeroImage(image: string, alt: string): TemplateResult {
    return html`<img src=${image} alt=${alt} />`;
  }

  /** The hero's striped placeholder shown while no camera image is live. */
  private renderHeroPlaceholder(display: DisplaySession, label: string, live: boolean): TemplateResult {
    return html`<div class="hero-placeholder" style=${`background:${this.heroTint(display)};`}>
      <div class="hero-stripes"></div>
      <ha-icon icon=${this.heroIcon(display)} aria-hidden="true"></ha-icon>
      <span class="hero-label">${label}</span>
      <span class="hero-hint">${this.heroHint(display, live)}</span>
    </div>`;
  }

  private renderHero(display: DisplaySession): TemplateResult {
    // Saved = the last stack the scope saved; Live = the live camera: the
    // stack being built (whoever started it) or a video session started from
    // HA. With no explicit choice the hero follows the scope (showsLive); a
    // chosen source never falls back to the other one silently.
    const live = this.showsLive(display);
    const image = live ? display.liveImage : display.heroImage;
    // A saved image is titled by its own target, never the current one (the
    // Live view names that). With no image the caption describes the scope.
    const savedShown = !live && image !== undefined;
    const targetText = savedShown ? (display.savedTarget ?? SAVED_STACK_LABEL) : display.target;
    const subtitleText = savedShown ? (display.savedTarget !== undefined ? SAVED_STACK_LABEL : '') : display.subtitle;
    const sourceLabel =
      display.badge === 'stacking' ? 'STACKED' : display.badge === 'idle' ? 'IDLE' : 'LIVE';
    const label = `${targetText} · ${sourceLabel}`;
    const mediaLabel = live ? 'Open the live view camera' : 'Open the stacked preview camera';
    return html`
      <div class="hero">
        <button
          type="button"
          class="hero-media"
          aria-label=${mediaLabel}
          title=${mediaLabel}
          @click=${() => this.openHeroMoreInfo(display)}
        >
          ${image !== undefined
            ? this.renderHeroImage(image, live ? `Live view of ${targetText}` : [SAVED_STACK_LABEL, display.savedTarget].filter(Boolean).join(': '))
            : this.renderHeroPlaceholder(display, label, live)}
        </button>
        <div class="scrim-top"></div>
        <div class="scrim-bottom"></div>

        <div class="source-toggle" role="group" aria-label="Image source">
          ${this.renderSourceButton('mdi:image-outline', 'Saved', !live, this.showSaved, false)}
          ${this.renderSourceButton('mdi:video-outline', 'Live', live, this.showLive, true)}
        </div>

        <div class="badge">
          <span class="badge-dot ${display.badge}"></span>
          <span>${this.badgeText(display.badge)}</span>
        </div>

        <div class="hero-caption">
          <div class="hero-target">${targetText}</div>
          ${subtitleText !== '' ? html`<div class="hero-mode">${subtitleText}</div>` : nothing}
        </div>
      </div>
    `;
  }

  /** One Saved/Live segmented-toggle button. */
  private renderSourceButton(
    icon: string,
    label: string,
    active: boolean,
    onClick: () => void,
    isLiveSource: boolean,
  ): TemplateResult {
    const classes = `${active ? 'active' : 'inactive'}${isLiveSource ? ' live-source' : ''}`;
    return html`<button type="button" class=${classes} aria-pressed=${active} @click=${onClick}>
      <ha-icon icon=${icon} aria-hidden="true"></ha-icon>${label}
    </button>`;
  }

  /**
   * Badge label text. The badge reports the scope's state, never the chosen
   * image source: the live camera is fed through seestar_alp, so picking it
   * must not turn the badge into LIVE.
   */
  private badgeText(kind: BadgeKind): string {
    return kind === 'stacking' ? 'STACKING' : kind === 'idle' ? 'IDLE' : 'LIVE';
  }

  /** Placeholder hero tint per mode. */
  private heroTint(display: DisplaySession): string {
    if (display.mode === 'sun') {
      return '#1a1206';
    }
    if (display.mode === 'scenery') {
      return '#171a16';
    }
    return '#0b1120';
  }

  /** Placeholder hero icon per mode. */
  private heroIcon(display: DisplaySession): string {
    if (display.mode === 'sun') {
      return 'mdi:weather-sunny';
    }
    if (display.mode === 'scenery') {
      return 'mdi:image-filter-hdr';
    }
    return 'mdi:star-four-points';
  }

  /** Placeholder hero hint per mode. */
  private heroHint(display: DisplaySession, live: boolean): string {
    if (live) {
      return 'live view shows a stack in progress or a session started from Home Assistant';
    }
    if (display.mode === 'scenery') {
      return 'terrestrial / daylight';
    }
    return 'awaiting camera preview';
  }

  private renderSky(display: DisplaySession): TemplateResult {
    const { stack, dial } = display;
    return html`
      <div class="dials">
        <seestar-stack-ring
          .stacked=${stack.stacked}
          .total=${stack.total}
          .dropped=${stack.dropped}
          .exposure=${stack.exposure}
          .integration=${stack.integration}
          .size=${DIAL_SIZE}
        ></seestar-stack-ring>
        <div class="v-divider"></div>
        <seestar-sky-dial .altitude=${dial.altitude} .azimuth=${dial.azimuth} .size=${DIAL_SIZE}></seestar-sky-dial>
      </div>
      ${this.renderStarsNote(display)}
    `;
  }

  /**
   * The stars-detected note under the dials. Greyed with a "daylight" note in
   * solar/scenery, a plain count otherwise; `—` when the reading is missing.
   */
  private renderStarsNote(display: DisplaySession): TemplateResult {
    if (display.starsDetectedInDaylight) {
      return html`<div class="stars-note daylight">
        <ha-icon icon="mdi:star-off-outline" aria-hidden="true"></ha-icon><span>Stars detected</span>
        <b>${EMPTY_VALUE}</b><span>· daylight</span>
      </div>`;
    }
    return html`<div class="stars-note">
      <ha-icon icon="mdi:star-outline" aria-hidden="true"></ha-icon>Stars detected
      <b>${display.starsDetected}</b>
    </div>`;
  }

  private renderTerrestrial(display: DisplaySession): TemplateResult {
    return html`
      <div class="terrestrial">
        <ha-icon icon="mdi:image-filter-hdr" aria-hidden="true"></ha-icon>
        <div class="terrestrial-text">
          <div class="terrestrial-title">Terrestrial framing</div>
          <div class="terrestrial-sub">No sky tracking · plate-solve N/A</div>
        </div>
        <div class="terrestrial-exposure">
          <div class="value">${display.terrestrialExposure}</div>
          <div class="caption">exposure</div>
        </div>
      </div>
    `;
  }

  private renderDetected(display: DisplaySession): TemplateResult | typeof nothing {
    const { detected } = display;
    if (detected.objects.length === 0) {
      return nothing;
    }
    return html`
      <div class="detected">
        <div class="detected-header">
          <ha-icon icon=${detected.icon} aria-hidden="true"></ha-icon>${detected.label}
        </div>
        <div class="chip-wrap">
          ${detected.objects.map(
            (name) => html`<seestar-stat-chip .icon=${detected.icon} .label=${name} tone="neutral"></seestar-stat-chip>`,
          )}
        </div>
      </div>
    `;
  }

  private renderChips(display: DisplaySession): TemplateResult | typeof nothing {
    // Every chip may be dropped when its reading is unknown (e.g. right after a
    // backend restart) — collapse the wrap instead of leaving an empty gap row.
    if (display.chips.length === 0) {
      return nothing;
    }
    return html`
      <div class="chip-wrap">
        ${display.chips.map(
          (chip) => html`<seestar-stat-chip .icon=${chip.icon} .label=${chip.label} .tone=${chip.tone}></seestar-stat-chip>`,
        )}
      </div>
    `;
  }

  private renderArmRow(): TemplateResult {
    return html`
      <div class="arm-row">
        <ha-icon
          icon=${this.armed ? 'mdi:lock-open-variant' : 'mdi:lock'}
          aria-hidden="true"
          style=${`color:${this.armed ? 'var(--primary-color)' : 'var(--secondary-text-color)'};`}
        ></ha-icon>
        <div class="arm-text">
          <div class="arm-title">Controls</div>
          <div class="arm-sub">${this.armed ? 'Unlocked — actions are live' : 'Off · tap to arm controls'}</div>
        </div>
        <button
          type="button"
          class=${`switch ${this.armed ? 'on' : 'off'}`}
          role="switch"
          aria-checked=${this.armed}
          aria-label="Arm controls"
          @click=${this.toggleArmed}
          @keydown=${this.onArmKeydown}
        >
          <span class="knob"></span>
        </button>
      </div>
    `;
  }

  private renderActions(display: DisplaySession): TemplateResult {
    return html`
      <div class="actions">
        ${display.actions.map((action) => this.renderActionButton(action))}
      </div>
    `;
  }

  private renderActionButton(action: ActionModel): TemplateResult {
    const config = this.actionConfig(action.key);
    const configured = config?.service !== undefined;
    const colors = ACTION_COLORS[action.tone];
    // The primary tone reads 0 15px in the design; every other tone is 0 14px.
    const paddingX = action.tone === 'primary' ? '15px' : '14px';
    return html`
      <button
        type="button"
        style=${`background:${colors.bg};color:${colors.fg};padding:0 ${paddingX};`}
        ?disabled=${!configured}
        aria-disabled=${!configured}
        title=${configured ? action.label : 'configure this action'}
        @click=${() => this.runAction(config)}
      >
        <ha-icon icon=${haIconName(action.icon)} aria-hidden="true"></ha-icon>${action.label}
      </button>
    `;
  }

  protected render(): TemplateResult | typeof nothing {
    const { hass, config } = this;
    if (config === undefined || hass === undefined) {
      return nothing;
    }
    const display = deriveDisplaySession(
      resolve(hass, config.device, config.camera_entity, config.live_camera_entity),
    );
    this.scheduleStackingExpiry(display.stackingExpiresAtMs);
    const accentStyle = config.accent !== undefined ? `--seestar-accent:${config.accent};--primary-color:${config.accent};` : undefined;
    return html`
      <ha-card style=${accentStyle ?? nothing}>
        ${this.renderHero(display)}
        <div class="body">
          ${display.sky ? this.renderSky(display) : this.renderTerrestrial(display)}
          ${this.renderDetected(display)} ${this.renderChips(display)}
          <div class="h-divider"></div>
          ${this.renderArmRow()} ${this.armed ? this.renderActions(display) : nothing}
        </div>
      </ha-card>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    [CARD_TAG]: SeestarCard;
  }
}

// Guard the definition so a double-load of the bundle (a re-registered HACS
// resource, a dashboard reload without a full page refresh) can't throw
// `NotSupportedError` and take down every card on the page.
if (!customElements.get(CARD_TAG)) {
  customElements.define(CARD_TAG, SeestarCard);
}

// Register in the Lovelace card picker so users can add the card from the UI.
const cardWindow = window as WindowWithCards;
cardWindow.customCards = cardWindow.customCards ?? [];
if (!cardWindow.customCards.some((card) => card.type === CARD_TAG)) {
  cardWindow.customCards.push({
    type: CARD_TAG,
    name: 'Seestar Card',
    description: 'Live ZWO Seestar session',
    preview: true,
  });
}

// Side-effect import registers the editor element; kept last so its own
// `customElements.define` runs after the card is defined.
import './editor.js';
