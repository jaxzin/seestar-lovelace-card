/**
 * `seestar-sky-dial` — a polar altitude/azimuth dial for the scope's pointing.
 *
 * Reproduces the design's `SkyDial` primitive: a horizon circle with a dashed
 * mid-altitude ring and dashed N–S / E–W crosshairs, plus a marker at the
 * current pointing. Altitude maps radially — zenith (90°) at the centre,
 * horizon (0°) at the rim — and azimuth maps clockwise from North at the top.
 * A readout below shows the rounded altitude, azimuth and 8-wind compass
 * direction.
 *
 * Unknown pointing renders explicitly: when altitude or azimuth is `undefined`
 * the marker dot and pointer line are hidden (the compass rose stays) and the
 * readout shows a muted `—` for each missing axis — never a fabricated 0°.
 *
 * All colours resolve to Home Assistant CSS custom properties so the dial
 * tracks the active light/dark theme automatically.
 */
import { LitElement, css, html, nothing, svg, type CSSResultGroup, type SVGTemplateResult, type TemplateResult } from 'lit';
import { property } from 'lit/decorators.js';

/** The custom element tag for the alt/az sky dial. */
const SKY_DIAL_TAG = 'seestar-sky-dial';

/** Radial inset of the horizon circle from the SVG bounding box, in px. */
const HORIZON_INSET = 13;

/** Mid-ring radius as a fraction of the horizon radius (the 45° altitude ring). */
const MID_RING_FRACTION = 0.5;

/** Radial offset of the N/S/E/W labels beyond the horizon circle, in px. */
const LABEL_OFFSET = 9;

/** Vertical baseline nudge that visually centres side labels, in px. */
const LABEL_BASELINE_NUDGE = 4;

/** Extra baseline drop for the South label so it clears the horizon, in px. */
const SOUTH_LABEL_DROP = 4;

/** Maximum altitude in degrees (zenith). */
const MAX_ALTITUDE = 90;

/** Degrees per full circle. */
const FULL_CIRCLE = 360;

/** Degrees spanned by each of the 8 compass points. */
const COMPASS_STEP = 45;

/** 8-wind compass labels, indexed by `round(azimuth / 45) % 8`. */
const COMPASS_POINTS = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'] as const;

/** Placeholder shown for an unknown axis reading. */
const EMPTY_VALUE = '—';

/** Convert degrees to radians. */
function toRadians(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

/** Clamp a value into the inclusive `[min, max]` range. */
function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

/** Normalise an angle to the `[0, 360)` range. */
function normalizeDegrees(degrees: number): number {
  return ((degrees % FULL_CIRCLE) + FULL_CIRCLE) % FULL_CIRCLE;
}

/**
 * A polar alt/az pointing dial.
 *
 * `altitude`/`azimuth` are the raw degrees from the scope; the component clamps
 * altitude to `[0, 90]` and wraps azimuth into `[0, 360)` before plotting.
 * Either axis may be `undefined` (unknown), which hides the marker.
 */
export class SeestarSkyDial extends LitElement {
  /** Altitude in degrees above the horizon; clamped to `[0, 90]`. */
  @property({ type: Number }) public altitude?: number;

  /** Azimuth in degrees clockwise from North; wrapped into `[0, 360)`. */
  @property({ type: Number }) public azimuth?: number;

  /** Overall diameter of the dial in px (the card uses ~106). */
  @property({ type: Number }) public size = 106;

  public static readonly styles: CSSResultGroup = css`
    :host {
      display: inline-block;
    }
    .wrap {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 9px;
    }
    svg {
      display: block;
      overflow: visible;
    }
    .readout {
      display: flex;
      gap: 16px;
      font-size: 11.5px;
      color: var(--secondary-text-color);
    }
    .readout b {
      color: var(--primary-text-color);
      font-weight: 500;
    }
    .readout b.unknown {
      color: var(--disabled-text-color, #9b9b9b);
    }
  `;

  /** Clamped altitude in `[0, 90]`, or `undefined` when unknown. */
  private get clampedAltitude(): number | undefined {
    return this.altitude === undefined ? undefined : clamp(this.altitude, 0, MAX_ALTITUDE);
  }

  /** Azimuth wrapped into `[0, 360)`, or `undefined` when unknown. */
  private get normalizedAzimuth(): number | undefined {
    return this.azimuth === undefined ? undefined : normalizeDegrees(this.azimuth);
  }

  /** 8-wind compass direction for the current azimuth, when known. */
  private get direction(): string | undefined {
    const azimuth = this.normalizedAzimuth;
    if (azimuth === undefined) {
      return undefined;
    }
    const index = Math.round(azimuth / COMPASS_STEP) % COMPASS_POINTS.length;
    return COMPASS_POINTS[index] ?? COMPASS_POINTS[0];
  }

  /** Screen-reader description of the pointing. */
  private get description(): string {
    const altitude = this.clampedAltitude;
    const azimuth = this.normalizedAzimuth;
    if (altitude === undefined && azimuth === undefined) {
      return 'Telescope pointing unknown';
    }
    const alt = altitude === undefined ? 'unknown' : `${Math.round(altitude)} degrees`;
    const az =
      azimuth === undefined ? 'unknown' : `${Math.round(azimuth)} degrees ${this.direction}`;
    return `Telescope pointing: altitude ${alt}, azimuth ${az}`;
  }

  /**
   * The pointer line + marker dot at the current alt/az, or `nothing` when
   * either axis is unknown — an unknown pointing must not plot a marker at a
   * fabricated 0°/0°.
   */
  private renderMarker(center: number, radius: number): SVGTemplateResult | typeof nothing {
    const altitude = this.clampedAltitude;
    const azimuth = this.normalizedAzimuth;
    if (altitude === undefined || azimuth === undefined) {
      return nothing;
    }
    // Marker position: altitude radially (zenith centre → horizon rim), azimuth
    // clockwise from North (top). SVG y grows downward, hence the `-cos`.
    const markerRadius = radius * (1 - altitude / MAX_ALTITUDE);
    const azimuthRad = toRadians(azimuth);
    const dotX = (center + markerRadius * Math.sin(azimuthRad)).toFixed(2);
    const dotY = (center - markerRadius * Math.cos(azimuthRad)).toFixed(2);
    return svg`
      <line
        x1=${center}
        y1=${center}
        x2=${dotX}
        y2=${dotY}
        stroke="var(--primary-color)"
        stroke-width="2"
      ></line>
      <circle
        cx=${dotX}
        cy=${dotY}
        r="8.5"
        fill="none"
        stroke="var(--primary-color)"
        stroke-width="1"
        opacity="0.45"
      ></circle>
      <circle cx=${dotX} cy=${dotY} r="4.5" fill="var(--primary-color)"></circle>
    `;
  }

  /** One readout entry (`ALT` / `AZ`), muted when the reading is unknown. */
  private renderReadout(label: string, value: string | undefined): TemplateResult {
    return html`<div>
      ${label} <b class=${value === undefined ? 'unknown' : ''}>${value ?? EMPTY_VALUE}</b>
    </div>`;
  }

  protected render(): TemplateResult {
    const { size } = this;
    const center = size / 2;
    const radius = size / 2 - HORIZON_INSET;
    const midRadius = radius * MID_RING_FRACTION;
    const altitude = this.clampedAltitude;
    const azimuth = this.normalizedAzimuth;

    const north = center - radius;
    const south = center + radius;
    const west = center - radius;
    const east = center + radius;
    const labelRadius = radius + LABEL_OFFSET;

    const altLabel = altitude === undefined ? undefined : `${Math.round(altitude)}°`;
    const azLabel = azimuth === undefined ? undefined : `${Math.round(azimuth)}° ${this.direction}`;

    return html`
      <div class="wrap">
        <svg
          width=${size}
          height=${size}
          viewBox="0 0 ${size} ${size}"
          role="img"
          aria-label=${this.description}
        >
          <circle
            cx=${center}
            cy=${center}
            r=${radius.toFixed(2)}
            fill="none"
            stroke="var(--divider-color)"
            stroke-width="1.5"
          ></circle>
          <circle
            cx=${center}
            cy=${center}
            r=${midRadius.toFixed(2)}
            fill="none"
            stroke="var(--divider-color)"
            stroke-width="1"
            stroke-dasharray="2 3"
          ></circle>
          <line
            x1=${center}
            y1=${north.toFixed(2)}
            x2=${center}
            y2=${south.toFixed(2)}
            stroke="var(--divider-color)"
            stroke-width="1"
            stroke-dasharray="2 3"
          ></line>
          <line
            x1=${west.toFixed(2)}
            y1=${center}
            x2=${east.toFixed(2)}
            y2=${center}
            stroke="var(--divider-color)"
            stroke-width="1"
            stroke-dasharray="2 3"
          ></line>
          ${this.renderMarker(center, radius)}
          <circle cx=${center} cy=${center} r="1.7" fill="var(--secondary-text-color)"></circle>
          <text
            x=${center}
            y=${north.toFixed(2)}
            text-anchor="middle"
            font-size="10.5"
            font-weight="500"
            fill="var(--secondary-text-color)"
          >
            N
          </text>
          <text
            x=${center}
            y=${(center + labelRadius + SOUTH_LABEL_DROP).toFixed(2)}
            text-anchor="middle"
            font-size="10.5"
            fill="var(--secondary-text-color)"
          >
            S
          </text>
          <text
            x=${(center + labelRadius).toFixed(2)}
            y=${(center + LABEL_BASELINE_NUDGE).toFixed(2)}
            text-anchor="middle"
            font-size="10.5"
            fill="var(--secondary-text-color)"
          >
            E
          </text>
          <text
            x=${(center - labelRadius).toFixed(2)}
            y=${(center + LABEL_BASELINE_NUDGE).toFixed(2)}
            text-anchor="middle"
            font-size="10.5"
            fill="var(--secondary-text-color)"
          >
            W
          </text>
        </svg>
        <div class="readout">
          ${this.renderReadout('ALT', altLabel)} ${this.renderReadout('AZ', azLabel)}
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    [SKY_DIAL_TAG]: SeestarSkyDial;
  }
}

// Guard against a double-load re-defining the element (see seestar-card.ts).
if (!customElements.get(SKY_DIAL_TAG)) {
  customElements.define(SKY_DIAL_TAG, SeestarSkyDial);
}
