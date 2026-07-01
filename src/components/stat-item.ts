/**
 * `seestar-stat-item` — a single labelled reading, as a row or a grid tile.
 *
 * Reproduces the design's `StatItem` primitive with two variants:
 *
 * - `row`  — an icon, an ellipsised label, and a right-aligned value + unit,
 *   laid out on one line (used in dense stat lists).
 * - `grid` — a padded, rounded tile stacking icon / value+unit / uppercase
 *   label (used in the stats grid).
 *
 * Four tones — `neutral | good | warn | muted` — colour the icon and value.
 * All colours resolve to Home Assistant CSS custom properties so the item
 * tracks the active light/dark theme automatically. Icons render via
 * `<ha-icon>`, so no external icon font is bundled.
 */
import { LitElement, css, html, type CSSResultGroup, type TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { haIconName } from './icon.js';

/** The custom element tag for the stat item. */
const STAT_ITEM_TAG = 'seestar-stat-item';

/** Layout variants a stat item can render as. */
export type StatItemVariant = 'row' | 'grid';

/** The tones a stat item can take, colouring its icon and value. */
export type StatItemTone = 'neutral' | 'good' | 'warn' | 'muted';

/** Icon colour per tone, matching the design's mapping. */
const ICON_COLORS: Readonly<Record<StatItemTone, string>> = {
  neutral: 'var(--state-icon-color, var(--secondary-text-color))',
  good: 'var(--success-color, #2e7d32)',
  warn: 'var(--warning-color, #f57c00)',
  muted: 'var(--disabled-text-color, #9b9b9b)',
};

/** Value colour per tone, matching the design's mapping. */
const VALUE_COLORS: Readonly<Record<StatItemTone, string>> = {
  neutral: 'var(--primary-text-color)',
  good: 'var(--success-color, #2e7d32)',
  warn: 'var(--warning-color, #f57c00)',
  muted: 'var(--disabled-text-color, #9b9b9b)',
};

/**
 * A labelled reading rendered as a row or a grid tile.
 *
 * `value` and `unit` are pre-formatted strings (the card owns unit formatting);
 * the component only lays them out and applies the tone colours.
 */
@customElement(STAT_ITEM_TAG)
export class SeestarStatItem extends LitElement {
  /** MDI icon, e.g. `mdi:thermometer`, `mdi-thermometer` or `thermometer`. */
  @property({ type: String }) public icon = 'mdi:circle-medium';

  /** The reading's label, e.g. `"Sensor"`. */
  @property({ type: String }) public label = 'Label';

  /** The reading's pre-formatted value, e.g. `"31.4"`. */
  @property({ type: String }) public value = '—';

  /** Optional pre-formatted unit suffix, e.g. `"°C"`. */
  @property({ type: String }) public unit = '';

  /** Layout variant; defaults to `row`. */
  @property({ type: String }) public variant: StatItemVariant = 'row';

  /** Colour tone; defaults to `neutral`. */
  @property({ type: String }) public tone: StatItemTone = 'neutral';

  public static readonly styles: CSSResultGroup = css`
    :host {
      display: block;
    }

    /* ---- row variant ---- */
    .row {
      display: flex;
      align-items: center;
      gap: 11px;
      padding: 7px 0;
    }
    .row ha-icon {
      --mdc-icon-size: 19px;
      width: 22px;
      height: 19px;
      text-align: center;
      flex: none;
    }
    .row .label {
      flex: 1 1 auto;
      font-size: 13.5px;
      color: var(--secondary-text-color);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .row .value {
      font-size: 13.5px;
      font-weight: 500;
      white-space: nowrap;
    }
    .row .unit {
      font-size: 11.5px;
      font-weight: 400;
      color: var(--secondary-text-color);
    }

    /* ---- grid variant ---- */
    .grid {
      display: flex;
      flex-direction: column;
      gap: 5px;
      padding: 11px 12px;
      border-radius: 10px;
      background: var(--secondary-background-color, rgba(127, 127, 127, 0.08));
      min-width: 0;
    }
    .grid ha-icon {
      --mdc-icon-size: 18px;
      width: 18px;
      height: 18px;
    }
    .grid .value {
      font-size: 17px;
      font-weight: 500;
      line-height: 1.1;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .grid .unit {
      font-size: 11px;
      font-weight: 400;
      color: var(--secondary-text-color);
    }
    .grid .label {
      font-size: 11px;
      color: var(--secondary-text-color);
      text-transform: uppercase;
      letter-spacing: 0.04em;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  `;

  /** Icon colour for the current tone. */
  private get iconColor(): string {
    return ICON_COLORS[this.tone] ?? ICON_COLORS.neutral;
  }

  /** Value colour for the current tone. */
  private get valueColor(): string {
    return VALUE_COLORS[this.tone] ?? VALUE_COLORS.neutral;
  }

  private renderRow(): TemplateResult {
    return html`
      <div class="row">
        <ha-icon icon=${haIconName(this.icon)} style="color:${this.iconColor};" aria-hidden="true"></ha-icon>
        <span class="label">${this.label}</span>
        <span class="value" style="color:${this.valueColor};"
          >${this.value}${this.unit.length > 0 ? html`<span class="unit"> ${this.unit}</span>` : ''}</span
        >
      </div>
    `;
  }

  private renderGrid(): TemplateResult {
    return html`
      <div class="grid">
        <ha-icon icon=${haIconName(this.icon)} style="color:${this.iconColor};" aria-hidden="true"></ha-icon>
        <span class="value" style="color:${this.valueColor};"
          >${this.value}${this.unit.length > 0 ? html`<span class="unit"> ${this.unit}</span>` : ''}</span
        >
        <span class="label">${this.label}</span>
      </div>
    `;
  }

  protected render(): TemplateResult {
    return this.variant === 'grid' ? this.renderGrid() : this.renderRow();
  }
}

declare global {
  interface HTMLElementTagNameMap {
    [STAT_ITEM_TAG]: SeestarStatItem;
  }
}
