/**
 * Mode adaptation — turn a raw {@link SeestarSession} into a display-ready
 * {@link DisplaySession} the view renders directly.
 *
 * Each Seestar imaging mode changes which telemetry is meaningful, so rather
 * than showing dead fields the card rearranges, swaps content, or hides
 * components. This module encodes those data-driven rules once, so the card's
 * `render()` stays a thin, declarative mapping:
 *
 * - **mode** comes from `sensor.<prefix>_telephoto_mode`:
 *   - `scenery` → terrestrial: `sky` is false (the dashed "Terrestrial framing"
 *     box replaces the stacking donuts + sky dial), detection + plate-solve are
 *     hidden.
 *   - `sun` → detection is labelled **"Active regions"** (sunspot ARs).
 *   - `star` / anything else → deep-sky: `sky` is true, detection labelled
 *     **"In frame"**.
 * - **badge** reads STACKING while a plan is running / actively stacking, else
 *   LIVE (scenery, or an idle scope).
 * - **chips** and **actions** are built with fixed tones so the view never
 *   re-derives status colouring.
 *
 * Every field degrades on its own: `unavailable` / `unknown` entities collapse
 * to `undefined` upstream in {@link ./entities}, so nothing here throws or
 * produces `NaN`, and the layout never breaks.
 */
import type {
  DetectionSnapshot,
  HealthSnapshot,
  MountSnapshot,
  SeestarSession,
} from './entities.js';
import type { StatChipTone } from './components/index.js';

/** Placeholder shown wherever a value is missing or unavailable. */
export const EMPTY_VALUE = '—';

/**
 * The imaging mode the card adapts to, normalised from the raw
 * `telephoto_mode` sensor string.
 */
export type ImagingMode = 'star' | 'sun' | 'scenery';

/** The hero status badge: STACKING while integrating, LIVE otherwise. */
export type BadgeKind = 'stacking' | 'live';

/** A status chip in the chip wrap: icon + label + tone. */
export interface ChipModel {
  /** MDI icon (any of `mdi:x`, `mdi-x`, `x`). */
  readonly icon: string;
  /** Short status label, e.g. `"Tracking"`. */
  readonly label: string;
  /** Colour tone, mapped to {@link StatChipTone} by the card. */
  readonly tone: StatChipTone;
}

/** The tone an action button takes; maps to a themed fill/foreground pair. */
export type ActionTone = 'primary' | 'tonal' | 'neutral' | 'danger';

/**
 * One armed-controls action button. `key` selects the user-configured HA
 * service (`config.actions[key]`); when unconfigured the button renders
 * disabled with a "configure this action" hint rather than vanishing.
 */
export interface ActionModel {
  /** Config key into `config.actions`, e.g. `"stop_session"`. */
  readonly key: string;
  /** MDI icon. */
  readonly icon: string;
  /** Button label, e.g. `"Stop session"`. */
  readonly label: string;
  /** Colour tone. */
  readonly tone: ActionTone;
}

/** The stacking-donut inputs, pre-formatted where the ring needs strings. */
export interface StackModel {
  readonly stacked: number;
  readonly total: number;
  readonly dropped: number;
  /** Pre-formatted single-frame exposure, e.g. `"10 s"`. */
  readonly exposure: string;
  /** Pre-formatted cumulative integration, e.g. `"53 min"`. */
  readonly integration: string;
}

/** The sky-dial inputs (raw degrees; the dial clamps/wraps them). */
export interface DialModel {
  readonly altitude: number;
  readonly azimuth: number;
}

/** The detected-objects section: a labelled wrap of catalog-object chips. */
export interface DetectedModel {
  /** Section label, e.g. `"In frame"` or `"Active regions"`. */
  readonly label: string;
  /** MDI icon for the section header and each chip. */
  readonly icon: string;
  /** Catalog object names, e.g. `["NGC 7000", "IC 5070"]`. */
  readonly objects: readonly string[];
}

/**
 * A display-ready session: everything the card needs to render, with mode
 * adaptation already applied. The card maps this to markup without re-deriving
 * any status.
 */
export interface DisplaySession {
  /** Normalised imaging mode. */
  readonly mode: ImagingMode;
  /** Primary target line, e.g. `"NGC 7000"` (or the placeholder). */
  readonly target: string;
  /** Secondary line under the target, e.g. `"White-light · Telephoto"`. */
  readonly subtitle: string;
  /** Hero status badge. */
  readonly badge: BadgeKind;
  /** Live camera-preview URL, when the feed is up; `undefined` → placeholder. */
  readonly heroImage?: string;
  /** `entity_id` of the preview camera (for alt text / future live view). */
  readonly cameraEntityId: string;
  /**
   * When true (deep-sky / solar) the stacking donuts + sky dial render; when
   * false (scenery) the terrestrial framing box replaces them.
   */
  readonly sky: boolean;
  /** Stacking-donut inputs (only meaningful when {@link sky}). */
  readonly stack: StackModel;
  /** Sky-dial inputs (only meaningful when {@link sky}). */
  readonly dial: DialModel;
  /** Terrestrial-box exposure line, shown when {@link sky} is false. */
  readonly terrestrialExposure: string;
  /**
   * Whether stars-detected is a real reading. False in daylight (solar/scenery)
   * so the view greys the value with a "daylight" note instead of a number.
   */
  readonly starsDetectedInDaylight: boolean;
  /** Stars-detected count, or the placeholder. */
  readonly starsDetected: string;
  /** Detected catalog objects (empty → the section is hidden). */
  readonly detected: DetectedModel;
  /** Status chips for the chip wrap. */
  readonly chips: readonly ChipModel[];
  /** Armed-controls action buttons. */
  readonly actions: readonly ActionModel[];
}

/** Modes that image the daylight sky, where star detection is not meaningful. */
const DAYLIGHT_MODES: ReadonlySet<ImagingMode> = new Set<ImagingMode>(['sun', 'scenery']);

/** The action set shown while a deep-sky / solar plan is running. */
const PLAN_ACTIONS: readonly ActionModel[] = [
  { key: 'stop_session', icon: 'mdi:stop', label: 'Stop session', tone: 'primary' },
  { key: 'pause_plan', icon: 'mdi:pause', label: 'Pause plan', tone: 'tonal' },
  { key: 'goto', icon: 'mdi:target', label: 'Goto', tone: 'neutral' },
  { key: 'park', icon: 'mdi:car-brake-parking', label: 'Park', tone: 'danger' },
];

/** The action set shown for a live / idle session (scenery, or not stacking). */
const LIVE_ACTIONS: readonly ActionModel[] = [
  { key: 'start_session', icon: 'mdi:play', label: 'Start session', tone: 'primary' },
  { key: 'capture', icon: 'mdi:camera-iris', label: 'Capture', tone: 'tonal' },
  { key: 'goto', icon: 'mdi:target', label: 'Goto', tone: 'neutral' },
  { key: 'park', icon: 'mdi:car-brake-parking', label: 'Park', tone: 'danger' },
];

/** Normalise the raw `telephoto_mode` sensor value to an {@link ImagingMode}. */
function normalizeMode(raw: string | undefined): ImagingMode {
  const value = (raw ?? '').toLowerCase();
  if (value.includes('scenery') || value.includes('terrestrial') || value.includes('landscape')) {
    return 'scenery';
  }
  if (value.includes('sun') || value.includes('solar')) {
    return 'sun';
  }
  return 'star';
}

/** Round-trip a possibly-undefined count to a non-negative integer. */
function count(value: number | undefined): number {
  return value === undefined ? 0 : Math.max(0, Math.round(value));
}

/** Format seconds as the design's compact exposure string (`"10 s"`, `"5 ms"`). */
function formatExposure(seconds: number | undefined): string {
  if (seconds === undefined) {
    return EMPTY_VALUE;
  }
  if (seconds < 1) {
    return `${Math.round(seconds * 1000)} ms`;
  }
  return `${Number.isInteger(seconds) ? seconds : seconds.toFixed(1)} s`;
}

/** Format integration minutes as `"53 min"`, or the placeholder. */
function formatIntegration(minutes: number | undefined): string {
  return minutes === undefined ? '' : `${Math.round(minutes)} min`;
}

/** Format a percentage reading, or the placeholder. */
function formatPercent(value: number | undefined): string {
  return value === undefined ? EMPTY_VALUE : `${Math.round(value)}%`;
}

/** Format a temperature reading (one decimal), or the placeholder. */
function formatTemperature(value: number | undefined): string {
  return value === undefined ? EMPTY_VALUE : `${value.toFixed(1)}°C`;
}

/** The battery MDI icon whose glyph bracket matches the charge level. */
function batteryIcon(percent: number | undefined): string {
  if (percent === undefined) {
    return 'mdi:battery-unknown';
  }
  if (percent >= 95) {
    return 'mdi:battery';
  }
  const bracket = Math.max(1, Math.round(percent / 10)) * 10;
  return `mdi:battery-${bracket}`;
}

/** The primary target line: telephoto target, then wide-field, then mode name. */
function targetLine(session: SeestarSession, mode: ImagingMode): string {
  const { telephotoTarget, wideTarget } = session.target;
  const explicit = telephotoTarget ?? wideTarget;
  if (explicit !== undefined && explicit.length > 0) {
    return explicit;
  }
  return mode === 'scenery' ? 'Scenery' : mode === 'sun' ? 'Sun' : EMPTY_VALUE;
}

/** The subtitle under the target: the mode string, or a mode-derived default. */
function subtitleLine(session: SeestarSession, mode: ImagingMode): string {
  const raw = session.target.mode;
  if (raw !== undefined && raw.length > 0) {
    return raw;
  }
  if (mode === 'scenery') {
    return 'Daylight landscape · Wide-field';
  }
  if (mode === 'sun') {
    return 'White-light · Telephoto';
  }
  return 'Deep-sky · Telephoto';
}

/** True when a plan is actively running or the stack state reads as stacking. */
function isStacking(mount: MountSnapshot, stackState: string | undefined): boolean {
  if (mount.planRunning === true) {
    return true;
  }
  return (stackState ?? '').toLowerCase().includes('stack');
}

/** Split the comma/newline-separated `catalog_objects` sensor into names. */
function parseObjects(detection: DetectionSnapshot): readonly string[] {
  const raw = detection.catalogObjects;
  if (raw === undefined) {
    return [];
  }
  return raw
    .split(/[,\n]/)
    .map((name) => name.trim())
    .filter((name) => name.length > 0);
}

/** The detected-objects section label + icon, by mode. */
function detectedMeta(mode: ImagingMode): { readonly label: string; readonly icon: string } {
  if (mode === 'sun') {
    return { label: 'Active regions', icon: 'mdi:weather-sunny' };
  }
  return { label: 'In frame', icon: 'mdi:star-four-points-outline' };
}

/** The mount-mode chip (EQ / Alt-Az / wide-field), from the mount snapshot. */
function mountChip(mount: MountSnapshot): ChipModel {
  const raw = (mount.mountMode ?? '').toLowerCase();
  if (raw.includes('eq')) {
    return { icon: 'mdi:rotate-3d-variant', label: 'EQ mode', tone: 'neutral' };
  }
  return { icon: 'mdi:axis-arrow', label: 'Alt-Az', tone: 'neutral' };
}

/**
 * Build the status-chip wrap in display order: plan → tracking → mount mode →
 * battery → temperature → dew heater → storage, dropping any chip whose reading
 * is unavailable so the wrap never shows placeholder pills.
 */
function buildChips(
  mount: MountSnapshot,
  health: HealthSnapshot,
  mode: ImagingMode,
): readonly ChipModel[] {
  const chips: ChipModel[] = [];

  if (mount.planRunning === true) {
    chips.push({ icon: 'mdi:play-circle-outline', label: 'Plan running', tone: 'active' });
  } else if (mount.planRunning === false && mode !== 'scenery') {
    chips.push({ icon: 'mdi:pause-circle-outline', label: 'Plan idle', tone: 'neutral' });
  }

  if (mount.tracking === true) {
    chips.push({ icon: 'mdi:sync', label: 'Tracking', tone: 'active' });
  } else if (mount.tracking === false) {
    chips.push({ icon: 'mdi:sync-off', label: 'Not tracking', tone: 'muted' });
  }

  if (mode === 'scenery') {
    chips.push({ icon: 'mdi:image-filter-hdr', label: 'Scenery', tone: 'neutral' });
  } else {
    chips.push(mountChip(mount));
  }

  if (health.battery !== undefined) {
    const charging = (health.charger ?? '').toLowerCase().includes('charg');
    chips.push({
      icon: charging ? 'mdi:battery-charging' : batteryIcon(health.battery),
      label: formatPercent(health.battery),
      tone: 'good',
    });
  }

  if (health.sensorTemperature !== undefined) {
    chips.push({
      icon: 'mdi:thermometer',
      label: formatTemperature(health.sensorTemperature),
      tone: 'neutral',
    });
  }

  if (health.dewHeater === true) {
    chips.push({ icon: 'mdi:heating-coil', label: 'Dew on', tone: 'active' });
  }

  if (health.storageUsed !== undefined) {
    chips.push({
      icon: 'mdi:harddisk',
      label: formatPercent(health.storageUsed),
      tone: 'neutral',
    });
  }

  return chips;
}

/**
 * Derive the full {@link DisplaySession} from a resolved {@link SeestarSession}.
 *
 * Pure and total: every reading is optional upstream, so this never throws and
 * always returns a renderable session — missing values become placeholders,
 * greyed states, or dropped chips, exactly as the design specifies.
 */
export function deriveDisplaySession(session: SeestarSession): DisplaySession {
  const { target, stack, pointing, mount, detection, health, preview } = session;
  const mode = normalizeMode(target.mode);
  const sky = mode !== 'scenery';
  const stacking = isStacking(mount, stack.state);
  const inDaylight = DAYLIGHT_MODES.has(mode);
  const meta = detectedMeta(mode);

  return {
    mode,
    target: targetLine(session, mode),
    subtitle: subtitleLine(session, mode),
    badge: stacking ? 'stacking' : 'live',
    heroImage: preview.picture,
    cameraEntityId: preview.cameraEntityId,
    sky,
    stack: {
      stacked: count(stack.stackedFrames),
      total: Math.max(1, count(stack.totalFrames)),
      dropped: count(stack.droppedFrames),
      exposure: formatExposure(stack.exposureSeconds),
      integration: formatIntegration(stack.integrationMinutes),
    },
    dial: {
      altitude: pointing.altitude ?? 0,
      azimuth: pointing.azimuth ?? 0,
    },
    terrestrialExposure: formatExposure(stack.exposureSeconds),
    starsDetectedInDaylight: inDaylight,
    starsDetected: pointing.starsDetected === undefined ? EMPTY_VALUE : String(pointing.starsDetected),
    detected: {
      label: meta.label,
      icon: meta.icon,
      // Scenery never lists detected objects; other modes list the catalog.
      objects: mode === 'scenery' ? [] : parseObjects(detection),
    },
    chips: buildChips(mount, health, mode),
    actions: stacking ? PLAN_ACTIONS : LIVE_ACTIONS,
  };
}
