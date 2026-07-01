/**
 * `seestar-card` — a Home Assistant custom Lovelace card for the Seestar S30 Pro
 * bridge.
 *
 * The card takes a single `device: <prefix>` config, resolves the ~46
 * name-derived entity ids into a typed {@link SeestarSession} (see
 * `./entities`), and renders them as a self-theming panel. All colours come
 * from Home Assistant CSS custom properties so the card tracks the active
 * light/dark theme automatically.
 */
import { LitElement, css, html, nothing, type CSSResultGroup, type TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { resolve, type SeestarSession } from './entities.js';
import type { HomeAssistant, LovelaceCard, SeestarCardConfig } from './types.js';

/** The custom element tag Lovelace instantiates for `type: custom:seestar-card`. */
const CARD_TAG = 'seestar-card';

/** Placeholder shown wherever a value is missing or unavailable. */
const EMPTY_VALUE = '—';

/**
 * Masonry height hint (in ~50px row units) returned to Lovelace. The card is a
 * camera hero plus a few stat rows; five rows lays it out without clipping.
 */
const CARD_SIZE_ROWS = 5;

/** A single label/value pair rendered in the stats grid. */
interface StatItem {
  readonly label: string;
  readonly value: string;
}

/** Format an optional numeric reading with a unit suffix, or the placeholder. */
function formatNumber(value: number | undefined, unit: string): string {
  return value === undefined ? EMPTY_VALUE : `${value}${unit}`;
}

/** Format an optional string reading, or the placeholder. */
function formatText(value: string | undefined): string {
  return value === undefined || value.length === 0 ? EMPTY_VALUE : value;
}

/** The primary imaging target: telephoto target, falling back to wide-field. */
function primaryTarget(session: SeestarSession): string {
  return formatText(session.target.telephotoTarget ?? session.target.wideTarget);
}

/**
 * The Seestar Lovelace card element.
 *
 * `hass` is assigned by HA on every state change and `config` once at setup;
 * Lit re-renders reactively when either changes.
 */
@customElement(CARD_TAG)
export class SeestarCard extends LitElement implements LovelaceCard {
  /** Injected by Home Assistant on every state change. */
  @property({ attribute: false }) public hass?: HomeAssistant;

  /** The validated user config; set once via {@link setConfig}. */
  @state() private config?: SeestarCardConfig;

  public static readonly styles: CSSResultGroup = css`
    :host {
      --seestar-accent: var(--primary-color);
    }
    ha-card {
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }
    .hero {
      position: relative;
      width: 100%;
      aspect-ratio: 4 / 3;
      background: var(--secondary-background-color);
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .hero img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
    }
    .hero-placeholder {
      color: var(--secondary-text-color);
      font-size: var(--paper-font-body1_-_font-size, 14px);
    }
    .heading {
      padding: 12px 16px 4px;
    }
    .title {
      color: var(--primary-text-color);
      font-size: var(--ha-card-header-font-size, 20px);
      font-weight: 500;
    }
    .subtitle {
      color: var(--secondary-text-color);
      font-size: var(--paper-font-body1_-_font-size, 14px);
      border-left: 3px solid var(--seestar-accent);
      padding-left: 8px;
      margin-top: 4px;
    }
    .stats {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 1px;
      background: var(--divider-color);
      margin-top: 12px;
    }
    .stat {
      background: var(--card-background-color);
      padding: 10px 16px;
    }
    .stat-label {
      color: var(--secondary-text-color);
      font-size: var(--paper-font-caption_-_font-size, 12px);
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    .stat-value {
      color: var(--primary-text-color);
      font-size: var(--paper-font-subhead_-_font-size, 16px);
      font-weight: 500;
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

  /** Label/value pairs derived from the resolved session, in display order. */
  private stats(session: SeestarSession): readonly StatItem[] {
    const { stack, pointing, health, mount } = session;
    return [
      { label: 'Mode', value: formatText(session.target.mode) },
      { label: 'Frames', value: formatText(this.framesSummary(session)) },
      { label: 'Integration', value: formatNumber(stack.integrationMinutes, ' min') },
      { label: 'Altitude', value: formatNumber(pointing.altitude, '°') },
      { label: 'Azimuth', value: formatNumber(pointing.azimuth, '°') },
      { label: 'Stars', value: formatNumber(pointing.starsDetected, '') },
      { label: 'Plan', value: formatText(mount.plan) },
      { label: 'Battery', value: formatNumber(health.battery, '%') },
    ];
  }

  /** "stacked / total" frame summary, or a placeholder when neither is live. */
  private framesSummary(session: SeestarSession): string | undefined {
    const { stackedFrames, totalFrames } = session.stack;
    if (stackedFrames === undefined && totalFrames === undefined) {
      return undefined;
    }
    return `${stackedFrames ?? EMPTY_VALUE} / ${totalFrames ?? EMPTY_VALUE}`;
  }

  private renderHero(session: SeestarSession): TemplateResult {
    const { picture } = session.preview;
    if (picture === undefined) {
      return html`<div class="hero">
        <span class="hero-placeholder">No preview</span>
      </div>`;
    }
    return html`<div class="hero">
      <img src=${picture} alt="Live stacked preview" />
    </div>`;
  }

  protected render(): TemplateResult | typeof nothing {
    const { hass, config } = this;
    if (config === undefined || hass === undefined) {
      return nothing;
    }
    const session = resolve(hass, config.device);
    const accent = config.accent;
    const title = config.name ?? config.device;
    return html`
      <ha-card style=${accent ? `--seestar-accent: ${accent}` : nothing}>
        ${this.renderHero(session)}
        <div class="heading">
          <div class="title">${title}</div>
          <div class="subtitle">${primaryTarget(session)}</div>
        </div>
        <div class="stats">
          ${this.stats(session).map(
            (item) => html`<div class="stat">
              <div class="stat-label">${item.label}</div>
              <div class="stat-value">${item.value}</div>
            </div>`,
          )}
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
