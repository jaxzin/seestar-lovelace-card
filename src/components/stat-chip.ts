/**
 * `seestar-stat-chip` — a compact status pill with an icon and label.
 *
 * Reproduces the design's `StatChip` primitive: a 30px-tall rounded pill with a
 * 1px border, an MDI icon and a short label. Five tones —
 * `neutral | active | good | warn | muted` — map the foreground, icon,
 * background and border colours exactly as in the design, using `color-mix`
 * over Home Assistant CSS custom properties so the chip tracks the active
 * light/dark theme automatically.
 *
 * Icons render via `<ha-icon>` (provided by the Home Assistant frontend), so no
 * external icon font is bundled.
 */
import { LitElement, css, html, type CSSResultGroup, type TemplateResult } from 'lit';
import { property } from 'lit/decorators.js';
import { haIconName } from './icon.js';

/** The custom element tag for the status chip. */
const STAT_CHIP_TAG = 'seestar-stat-chip';

/** The tones a chip can take, mapping to a fixed colour set. */
export type StatChipTone = 'neutral' | 'active' | 'good' | 'warn' | 'muted';

/** The four themeable colours that define a chip tone. */
interface ToneColors {
  /** Label (foreground) colour. */
  readonly fg: string;
  /** Icon colour. */
  readonly ic: string;
  /** Fill/background colour. */
  readonly bg: string;
  /** Border colour. */
  readonly bd: string;
}

/**
 * The exact tone → colour mapping from the design. `color-mix` tints the accent
 * / status HA vars for the filled tones; `neutral` and `muted` stay transparent
 * with a divider border. Fallbacks match the design's hard-coded defaults for
 * themes that don't define the status vars.
 */
const TONE_COLORS: Readonly<Record<StatChipTone, ToneColors>> = {
  neutral: {
    fg: 'var(--primary-text-color)',
    ic: 'var(--secondary-text-color)',
    bg: 'transparent',
    bd: 'var(--divider-color)',
  },
  active: {
    fg: 'var(--primary-color)',
    ic: 'var(--primary-color)',
    bg: 'color-mix(in srgb, var(--primary-color) 12%, transparent)',
    bd: 'color-mix(in srgb, var(--primary-color) 40%, transparent)',
  },
  good: {
    fg: 'var(--success-color, #2e7d32)',
    ic: 'var(--success-color, #2e7d32)',
    bg: 'color-mix(in srgb, var(--success-color, #2e7d32) 13%, transparent)',
    bd: 'color-mix(in srgb, var(--success-color, #2e7d32) 36%, transparent)',
  },
  warn: {
    fg: 'var(--warning-color, #f57c00)',
    ic: 'var(--warning-color, #f57c00)',
    bg: 'color-mix(in srgb, var(--warning-color, #f57c00) 15%, transparent)',
    bd: 'color-mix(in srgb, var(--warning-color, #f57c00) 40%, transparent)',
  },
  muted: {
    fg: 'var(--disabled-text-color, #9b9b9b)',
    ic: 'var(--disabled-text-color, #9b9b9b)',
    bg: 'transparent',
    bd: 'var(--divider-color)',
  },
};

/**
 * A status pill with an MDI icon and label.
 *
 * `icon` accepts either an MDI slug (`sync`), the design's `mdi-sync` class-name
 * form, or the `mdi:sync` form; all normalise to the `<ha-icon>` `mdi:` scheme.
 */
export class SeestarStatChip extends LitElement {
  /** MDI icon, e.g. `mdi:sync`, `mdi-sync` or `sync`. */
  @property({ type: String }) public icon = 'mdi:circle-medium';

  /** Short status label, e.g. `"Tracking"`. */
  @property({ type: String }) public label = 'Status';

  /** Colour tone; defaults to `neutral`. */
  @property({ type: String }) public tone: StatChipTone = 'neutral';

  public static readonly styles: CSSResultGroup = css`
    :host {
      display: inline-flex;
    }
    .chip {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      height: 30px;
      padding: 0 11px;
      border-radius: 15px;
      border: 1px solid;
      font-size: 12.5px;
      font-weight: 500;
      line-height: 1;
      white-space: nowrap;
    }
    ha-icon {
      --mdc-icon-size: 15px;
      width: 15px;
      height: 15px;
    }
  `;

  /** The resolved colour set for the current tone. */
  private get colors(): ToneColors {
    return TONE_COLORS[this.tone] ?? TONE_COLORS.neutral;
  }

  protected render(): TemplateResult {
    const { fg, ic, bg, bd } = this.colors;
    return html`
      <span class="chip" style="color:${fg};background:${bg};border-color:${bd};">
        <ha-icon icon=${haIconName(this.icon)} style="color:${ic};" aria-hidden="true"></ha-icon>
        <span>${this.label}</span>
      </span>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    [STAT_CHIP_TAG]: SeestarStatChip;
  }
}

// Guard against a double-load re-defining the element (see seestar-card.ts).
if (!customElements.get(STAT_CHIP_TAG)) {
  customElements.define(STAT_CHIP_TAG, SeestarStatChip);
}
