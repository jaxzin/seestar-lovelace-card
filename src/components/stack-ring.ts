/**
 * `seestar-stack-ring` — a radial 48-tick progress ring for stacking progress.
 *
 * Reproduces the design's `StackRing` primitive: 48 evenly-spaced radial ticks
 * starting at the top (12 o'clock) and running clockwise. The first
 * `round(48 * stacked / total)` ticks are drawn in the accent colour
 * (`--primary-color`) and the rest in `--divider-color`. The centre shows the
 * stacked count over the total, and a caption below joins the exposure,
 * integration time and dropped-frame count (omitting any empty part).
 *
 * All colours resolve to Home Assistant CSS custom properties so the ring
 * tracks the active light/dark theme automatically.
 */
import { LitElement, css, html, nothing, svg, type CSSResultGroup, type SVGTemplateResult, type TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';

/** The custom element tag for the stacking progress ring. */
const STACK_RING_TAG = 'seestar-stack-ring';

/** Number of radial ticks around the ring. */
const TICK_COUNT = 48;

/** Angular step between successive ticks, in degrees. */
const TICK_STEP_DEG = 360 / TICK_COUNT;

/** Rotation offset placing the first tick at 12 o'clock (top). */
const START_ANGLE_DEG = -90;

/** Radial inset of the ring's outer edge from the SVG bounding box, in px. */
const OUTER_INSET = 5;

/** Radial length (thickness) of each tick, in px. */
const TICK_LENGTH = 9;

/** Stroke width of each tick, in px. */
const TICK_STROKE_WIDTH = 2.4;

/** Separator between caption parts, matching the design two-space padding. */
const CAPTION_SEPARATOR = '  ·  ';

/** Convert degrees to radians. */
function toRadians(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

/** Clamp a value into the inclusive `[min, max]` range. */
function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

/** One tick's endpoints and fill colour, precomputed for rendering. */
interface Tick {
  readonly x1: number;
  readonly y1: number;
  readonly x2: number;
  readonly y2: number;
  readonly color: string;
}

/**
 * A radial stacking-progress ring.
 *
 * Inputs are the raw counts plus already-formatted `exposure`/`integration`
 * strings (the card owns unit formatting); the component only draws them.
 */
@customElement(STACK_RING_TAG)
export class SeestarStackRing extends LitElement {
  /** Frames successfully stacked so far. */
  @property({ type: Number }) public stacked = 0;

  /** Total frames planned for this stack (clamped to at least 1). */
  @property({ type: Number }) public total = 1;

  /** Frames dropped/rejected; omitted from the caption when zero. */
  @property({ type: Number }) public dropped = 0;

  /** Pre-formatted single-frame exposure, e.g. `"5 ms"`. */
  @property({ type: String }) public exposure = '';

  /** Pre-formatted cumulative integration time, e.g. `"3.1 s"`. */
  @property({ type: String }) public integration = '';

  /** Overall diameter of the ring in px (the card uses ~106). */
  @property({ type: Number }) public size = 106;

  public static readonly styles: CSSResultGroup = css`
    :host {
      display: inline-block;
    }
    .wrap {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
    }
    .ring {
      position: relative;
    }
    svg {
      display: block;
    }
    .center {
      position: absolute;
      inset: 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      pointer-events: none;
    }
    .count {
      font-size: 27px;
      font-weight: 500;
      color: var(--primary-text-color);
      line-height: 1;
    }
    .of {
      font-size: 12px;
      color: var(--secondary-text-color);
      margin-top: 3px;
    }
    .caption {
      font-size: 11.5px;
      color: var(--secondary-text-color);
      text-align: center;
    }
  `;

  /** The number of ticks drawn in the accent colour for the current progress. */
  private get filledTicks(): number {
    const fraction = clamp(this.stacked / Math.max(1, this.total), 0, 1);
    return Math.round(TICK_COUNT * fraction);
  }

  /** Precompute every tick's geometry and fill colour for the current size. */
  private get ticks(): readonly Tick[] {
    const center = this.size / 2;
    const rOuter = this.size / 2 - OUTER_INSET;
    const rInner = rOuter - TICK_LENGTH;
    const filled = this.filledTicks;
    const ticks: Tick[] = [];
    for (let i = 0; i < TICK_COUNT; i++) {
      const angle = toRadians(START_ANGLE_DEG + i * TICK_STEP_DEG);
      const cos = Math.cos(angle);
      const sin = Math.sin(angle);
      ticks.push({
        x1: center + rInner * cos,
        y1: center + rInner * sin,
        x2: center + rOuter * cos,
        y2: center + rOuter * sin,
        color: i < filled ? 'var(--primary-color)' : 'var(--divider-color)',
      });
    }
    return ticks;
  }

  /** The caption below the ring: exposure · integration · dropped (non-empty). */
  private get caption(): string {
    const parts: string[] = [];
    if (this.exposure.length > 0) {
      parts.push(this.exposure);
    }
    if (this.integration.length > 0) {
      parts.push(`${this.integration} integ`);
    }
    if (this.dropped > 0) {
      parts.push(`${this.dropped} dropped`);
    }
    return parts.join(CAPTION_SEPARATOR);
  }

  /** Screen-reader description of the ring's progress. */
  private get description(): string {
    const percent = Math.round(clamp(this.stacked / Math.max(1, this.total), 0, 1) * 100);
    return `${this.stacked} of ${this.total} frames stacked, ${percent} percent`;
  }

  private renderTick(tick: Tick): SVGTemplateResult {
    return svg`<line
      x1=${tick.x1.toFixed(2)}
      y1=${tick.y1.toFixed(2)}
      x2=${tick.x2.toFixed(2)}
      y2=${tick.y2.toFixed(2)}
      stroke=${tick.color}
      stroke-width=${TICK_STROKE_WIDTH}
      stroke-linecap="round"
    ></line>`;
  }

  protected render(): TemplateResult {
    const { size, caption } = this;
    return html`
      <div class="wrap">
        <div class="ring" style="width:${size}px;height:${size}px;">
          <svg
            width=${size}
            height=${size}
            viewBox="0 0 ${size} ${size}"
            role="img"
            aria-label=${this.description}
          >
            ${this.ticks.map((tick) => this.renderTick(tick))}
          </svg>
          <div class="center">
            <div class="count">${this.stacked}</div>
            <div class="of">of ${this.total}</div>
          </div>
        </div>
        ${caption.length > 0 ? html`<div class="caption">${caption}</div>` : nothing}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    [STACK_RING_TAG]: SeestarStackRing;
  }
}
