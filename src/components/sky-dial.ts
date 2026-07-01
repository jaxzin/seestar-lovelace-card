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
 * All colours resolve to Home Assistant CSS custom properties so the dial
 * tracks the active light/dark theme automatically.
 */
import { LitElement, css, html, type CSSResultGroup, type TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';

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
 */
@customElement(SKY_DIAL_TAG)
export class SeestarSkyDial extends LitElement {
  /** Altitude in degrees above the horizon; clamped to `[0, 90]`. */
  @property({ type: Number }) public altitude = 0;

  /** Azimuth in degrees clockwise from North; wrapped into `[0, 360)`. */
  @property({ type: Number }) public azimuth = 0;

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
  `;

  /** Clamped altitude in `[0, 90]`. */
  private get clampedAltitude(): number {
    return clamp(this.altitude, 0, MAX_ALTITUDE);
  }

  /** Azimuth wrapped into `[0, 360)`. */
  private get normalizedAzimuth(): number {
    return normalizeDegrees(this.azimuth);
  }

  /** 8-wind compass direction for the current azimuth. */
  private get direction(): string {
    const index = Math.round(this.normalizedAzimuth / COMPASS_STEP) % COMPASS_POINTS.length;
    return COMPASS_POINTS[index] ?? COMPASS_POINTS[0];
  }

  /** Screen-reader description of the pointing. */
  private get description(): string {
    const alt = Math.round(this.clampedAltitude);
    const az = Math.round(this.normalizedAzimuth);
    return `Telescope pointing: altitude ${alt} degrees, azimuth ${az} degrees ${this.direction}`;
  }

  protected render(): TemplateResult {
    const { size } = this;
    const center = size / 2;
    const radius = size / 2 - HORIZON_INSET;
    const midRadius = radius * MID_RING_FRACTION;

    // Marker position: altitude radially (zenith centre → horizon rim), azimuth
    // clockwise from North (top). SVG y grows downward, hence the `-cos`.
    const markerRadius = radius * (1 - this.clampedAltitude / MAX_ALTITUDE);
    const azimuthRad = toRadians(this.normalizedAzimuth);
    const dotX = center + markerRadius * Math.sin(azimuthRad);
    const dotY = center - markerRadius * Math.cos(azimuthRad);

    const north = center - radius;
    const south = center + radius;
    const west = center - radius;
    const east = center + radius;
    const labelRadius = radius + LABEL_OFFSET;

    const altLabel = `${Math.round(this.clampedAltitude)}°`;
    const azLabel = `${Math.round(this.normalizedAzimuth)}°`;

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
          <line
            x1=${center}
            y1=${center}
            x2=${dotX.toFixed(2)}
            y2=${dotY.toFixed(2)}
            stroke="var(--primary-color)"
            stroke-width="2"
          ></line>
          <circle
            cx=${dotX.toFixed(2)}
            cy=${dotY.toFixed(2)}
            r="8.5"
            fill="none"
            stroke="var(--primary-color)"
            stroke-width="1"
            opacity="0.45"
          ></circle>
          <circle cx=${dotX.toFixed(2)} cy=${dotY.toFixed(2)} r="4.5" fill="var(--primary-color)"></circle>
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
          <div>ALT <b>${altLabel}</b></div>
          <div>AZ <b>${azLabel} ${this.direction}</b></div>
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
