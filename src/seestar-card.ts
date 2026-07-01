/**
 * `seestar-card` — a Home Assistant custom Lovelace card for the Seestar S30 Pro
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
import { deriveDisplaySession, EMPTY_VALUE, type ActionModel, type ActionTone, type DisplaySession } from './modes.js';
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

  /** Whether the hero shows the live video view (vs the saved still). */
  @state() private live = false;

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
      object-fit: cover;
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
    .hero-caption {
      position: absolute;
      left: 15px;
      bottom: 12px;
      right: 15px;
      color: #fff;
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

  /** The user-configured service for an action key, if any. */
  private actionConfig(key: string): ActionConfig | undefined {
    return this.config?.actions?.[key];
  }

  /** The hero's live camera image. */
  private renderHeroImage(image: string, target: string): TemplateResult {
    return html`<img src=${image} alt=${`Live capture of ${target}`} />`;
  }

  /** The hero's striped placeholder shown while no camera image is live. */
  private renderHeroPlaceholder(display: DisplaySession, label: string): TemplateResult {
    return html`<div class="hero-placeholder" style=${`background:${this.heroTint(display)};`}>
      <div class="hero-stripes"></div>
      <ha-icon icon=${this.heroIcon(display)} aria-hidden="true"></ha-icon>
      <span class="hero-label">${label}</span>
      <span class="hero-hint">${this.heroHint(display)}</span>
    </div>`;
  }

  private renderHero(display: DisplaySession): TemplateResult {
    const image = display.heroImage;
    const targetText = display.target;
    const subtitleText = display.subtitle;
    const label = `${targetText} · ${display.badge === 'stacking' ? 'STACKED' : 'LIVE'}`;
    return html`
      <div class="hero">
        ${image !== undefined ? this.renderHeroImage(image, targetText) : this.renderHeroPlaceholder(display, label)}
        <div class="scrim-top"></div>
        <div class="scrim-bottom"></div>

        <div class="source-toggle" role="group" aria-label="Image source">
          ${this.renderSourceButton('mdi:image-outline', 'Saved', !this.live, this.showSaved, false)}
          ${this.renderSourceButton('mdi:video-outline', 'Live', this.live, this.showLive, true)}
        </div>

        <div class="badge">
          <span class="badge-dot ${this.badgeKind(display)}"></span>
          <span>${this.badgeText(display)}</span>
        </div>

        <div class="hero-caption">
          <div class="hero-target">${targetText}</div>
          <div class="hero-mode">${subtitleText}</div>
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

  /** Badge kind, overridden to LIVE while the hero shows the live view. */
  private badgeKind(display: DisplaySession): 'stacking' | 'live' {
    return this.live ? 'live' : display.badge;
  }

  /** Badge label text for the current hero state. */
  private badgeText(display: DisplaySession): string {
    return this.badgeKind(display) === 'live' ? 'LIVE' : 'STACKING';
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
  private heroHint(display: DisplaySession): string {
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

  private renderChips(display: DisplaySession): TemplateResult {
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
    const display = deriveDisplaySession(resolve(hass, config.device, config.camera_entity));
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
