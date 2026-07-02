/**
 * Entity-id derivation for one Seestar, and a typed snapshot of its live state.
 *
 * The bridge publishes ~46 entities per scope via MQTT discovery. Home
 * Assistant derives each `entity_id` from the entity **name** (not the
 * discovery `object_id`), as `<component>.<prefix>_<slug(name)>`. This module
 * encodes that contract: the {@link ENTITY_KEYS} map is the single source of
 * truth for every `slug(name)` suffix, verified against the bridge catalog in
 * `seestar_bridge/entities.py` (and the camera name in `scope.py`).
 *
 * Given the card's `device: <prefix>` config, {@link entityId} builds a full
 * `entity_id`, and {@link resolve} reads `hass.states` into a strongly-typed
 * {@link SeestarSession} so the view layer never touches raw string ids.
 */
import type { HassEntity, HomeAssistant } from './types.js';

/** HA state strings that mean "no live value" rather than a real reading. */
const UNAVAILABLE_STATES: ReadonlySet<string> = new Set(['unavailable', 'unknown', '']);

/** HA's `binary_sensor` "on" state string. */
const BINARY_ON = 'on';

/** The Lovelace/MQTT components the bridge publishes into. */
export type Component = 'sensor' | 'binary_sensor' | 'camera';

/**
 * The `slug(name)` suffix for every entity the card reads, grouped by the
 * component that owns it. Each value is the exact HA-slugged entity **name**
 * from the bridge catalog; the full id is `<component>.<prefix>_<suffix>`.
 */
export const ENTITY_KEYS = {
  sensor: {
    telephotoTarget: 'telephoto_target',
    wideTarget: 'wide_field_target',
    telephotoMode: 'telephoto_mode',
    activeCamera: 'active_camera',
    stackState: 'stack_state',
    stackedFrames: 'stacked_frames',
    totalFrames: 'total_frames',
    droppedFrames: 'dropped_frames',
    exposure: 'exposure',
    integrationTime: 'integration_time',
    altitude: 'altitude',
    azimuth: 'azimuth',
    rightAscension: 'right_ascension',
    declination: 'declination',
    fieldOfView: 'field_of_view',
    fieldRotation: 'field_rotation',
    starsDetected: 'stars_detected',
    plan: 'plan',
    gotoState: 'goto_state',
    mountMode: 'mount_mode',
    catalogObjects: 'catalog_objects',
    objectsInFrame: 'objects_in_frame',
    battery: 'battery',
    sensorTemperature: 'sensor_temperature',
    charger: 'charger',
    storageUsed: 'storage_used',
    focuserPosition: 'focuser_position',
    firmware: 'firmware',
    lastAlert: 'last_alert',
  },
  binarySensor: {
    planRunning: 'plan_running',
    tracking: 'tracking',
    slewing: 'slewing',
    parked: 'parked',
    atHome: 'at_home',
    dewHeater: 'dew_heater',
    connected: 'connected',
  },
  camera: {
    livePreview: 'live_stacked_preview',
    liveView: 'live_view',
  },
} as const;

/** `sensor` slug keys, e.g. `"altitude"`. */
export type SensorKey = (typeof ENTITY_KEYS.sensor)[keyof typeof ENTITY_KEYS.sensor];
/** `binary_sensor` slug keys, e.g. `"tracking"`. */
export type BinarySensorKey = (typeof ENTITY_KEYS.binarySensor)[keyof typeof ENTITY_KEYS.binarySensor];
/** `camera` slug keys, e.g. `"live_stacked_preview"`. */
export type CameraKey = (typeof ENTITY_KEYS.camera)[keyof typeof ENTITY_KEYS.camera];

/**
 * Build a full `entity_id` from a component, the card's device `prefix`, and a
 * `slug(name)` suffix — the inverse of HA's name→id derivation.
 *
 * @example entityId('sensor', 'seestar_s30_pro', 'altitude')
 *   // → 'sensor.seestar_s30_pro_altitude'
 */
export function entityId(component: Component, prefix: string, key: string): string {
  return `${component}.${prefix}_${key}`;
}

/** Look up an entity's live state, or `undefined` if HA has no such entity. */
function stateOf(hass: HomeAssistant, entity: string): HassEntity | undefined {
  return hass.states[entity];
}

/** True when a state exists and is a real reading (not unavailable/unknown). */
function isLive(entity: HassEntity | undefined): entity is HassEntity {
  return entity !== undefined && !UNAVAILABLE_STATES.has(entity.state);
}

/** A live sensor's raw state string, or `undefined` when unavailable. */
function sensorValue(hass: HomeAssistant, prefix: string, key: SensorKey): string | undefined {
  const entity = stateOf(hass, entityId('sensor', prefix, key));
  return isLive(entity) ? entity.state : undefined;
}

/** A live sensor's state parsed as a finite number, or `undefined`. */
function numericValue(hass: HomeAssistant, prefix: string, key: SensorKey): number | undefined {
  const raw = sensorValue(hass, prefix, key);
  if (raw === undefined) {
    return undefined;
  }
  const parsed = Number(raw);
  return Number.isFinite(parsed) ? parsed : undefined;
}

/**
 * A binary sensor as a tri-state boolean: `true`/`false` when live, `undefined`
 * when the entity is missing or unavailable (so the view can distinguish "off"
 * from "no data").
 */
function booleanValue(hass: HomeAssistant, prefix: string, key: BinarySensorKey): boolean | undefined {
  const entity = stateOf(hass, entityId('binary_sensor', prefix, key));
  return isLive(entity) ? entity.state === BINARY_ON : undefined;
}

/**
 * Camera entity_id candidates for the hero, newest name first. HA assigns an
 * entity_id from the entity NAME at a unique_id's FIRST registration and keeps
 * it thereafter — so a scope first seen under an older bridge ("Live preview")
 * stays `live_preview` even after the bridge renames it to "Live stacked
 * preview". Try both so the hero works regardless of which bridge registered it.
 */
const CAMERA_FALLBACK_KEYS = ['live_stacked_preview', 'live_preview'] as const;

/**
 * Resolve the hero camera's entity_id: an explicit config override, else the
 * first candidate that actually exists in `hass.states`, else the default name
 * (so the field is always a string; the view shows a placeholder if absent).
 */
function resolveCameraEntityId(hass: HomeAssistant, prefix: string, override?: string): string {
  if (override) {
    return override;
  }
  for (const key of CAMERA_FALLBACK_KEYS) {
    const id = `camera.${prefix}_${key}`;
    if (hass.states[id]) {
      return id;
    }
  }
  return `camera.${prefix}_${CAMERA_FALLBACK_KEYS[0]}`;
}

/** A camera entity's `entity_picture` attribute URL, when the feed is live. */
function pictureForEntity(hass: HomeAssistant, cameraEntityId: string): string | undefined {
  const entity = stateOf(hass, cameraEntityId);
  if (!isLive(entity)) {
    return undefined;
  }
  const picture = entity.attributes['entity_picture'];
  return typeof picture === 'string' ? picture : undefined;
}

/** Stacking progress for the hero panel. */
export interface StackSnapshot {
  readonly state?: string;
  readonly stackedFrames?: number;
  readonly totalFrames?: number;
  readonly droppedFrames?: number;
  readonly exposureSeconds?: number;
  readonly integrationMinutes?: number;
}

/** Plate-solved pointing + framing. */
export interface PointingSnapshot {
  readonly altitude?: number;
  readonly azimuth?: number;
  readonly rightAscension?: number;
  readonly declination?: number;
  readonly fieldOfView?: string;
  readonly fieldRotation?: number;
  readonly starsDetected?: number;
}

/** Mount / scheduler status. */
export interface MountSnapshot {
  readonly plan?: string;
  readonly planRunning?: boolean;
  readonly tracking?: boolean;
  readonly slewing?: boolean;
  readonly gotoState?: string;
  readonly mountMode?: string;
  readonly parked?: boolean;
  readonly atHome?: boolean;
}

/** AI object detection over the current frame. */
export interface DetectionSnapshot {
  readonly catalogObjects?: string;
  readonly objectsInFrame?: number;
}

/** Device health / connectivity. */
export interface HealthSnapshot {
  readonly battery?: number;
  readonly sensorTemperature?: number;
  readonly charger?: string;
  readonly storageUsed?: number;
  readonly focuserPosition?: number;
  readonly firmware?: string;
  readonly dewHeater?: boolean;
  readonly connected?: boolean;
  readonly lastAlert?: string;
}

/** What's being imaged, and by which camera. */
export interface TargetSnapshot {
  readonly telephotoTarget?: string;
  readonly wideTarget?: string;
  readonly mode?: string;
  readonly activeCamera?: string;
}

/** The camera hero panel's feed. */
export interface PreviewSnapshot {
  /** `entity_id` of the live-stacked-preview camera (for `<hui-image>` etc.). */
  readonly cameraEntityId: string;
  /** Current preview image URL, when the feed is live. */
  readonly picture?: string;
  /** `entity_id` of the Phase-2 live `/vid` camera. */
  readonly liveCameraEntityId: string;
  /** Real-time live-view URL — only while the bridge owns the session. */
  readonly livePicture?: string;
}

/**
 * A fully-typed snapshot of one Seestar's live state, resolved from
 * `hass.states` for a given device prefix. Every field is optional at the value
 * level so the view layer renders "—" / placeholders for missing data rather
 * than reading undefined ids.
 */
export interface SeestarSession {
  /** The device prefix this session was resolved for. */
  readonly prefix: string;
  readonly preview: PreviewSnapshot;
  readonly target: TargetSnapshot;
  readonly stack: StackSnapshot;
  readonly pointing: PointingSnapshot;
  readonly mount: MountSnapshot;
  readonly detection: DetectionSnapshot;
  readonly health: HealthSnapshot;
}

/**
 * Read `hass.states` into a typed {@link SeestarSession} for `prefix`.
 *
 * Pure and defensive: unknown/unavailable entities and unparseable numerics
 * collapse to `undefined`, so callers never see the literal strings
 * `"unavailable"`/`"unknown"` or `NaN`.
 */
export function resolve(
  hass: HomeAssistant,
  prefix: string,
  cameraOverride?: string,
  liveCameraOverride?: string,
): SeestarSession {
  const { sensor, camera } = ENTITY_KEYS;
  const cameraEntityId = resolveCameraEntityId(hass, prefix, cameraOverride);
  const liveCameraEntityId = liveCameraOverride ?? `camera.${prefix}_${camera.liveView}`;
  return {
    prefix,
    preview: {
      cameraEntityId,
      picture: pictureForEntity(hass, cameraEntityId),
      liveCameraEntityId,
      livePicture: pictureForEntity(hass, liveCameraEntityId),
    },
    target: {
      telephotoTarget: sensorValue(hass, prefix, sensor.telephotoTarget),
      wideTarget: sensorValue(hass, prefix, sensor.wideTarget),
      mode: sensorValue(hass, prefix, sensor.telephotoMode),
      activeCamera: sensorValue(hass, prefix, sensor.activeCamera),
    },
    stack: {
      state: sensorValue(hass, prefix, sensor.stackState),
      stackedFrames: numericValue(hass, prefix, sensor.stackedFrames),
      totalFrames: numericValue(hass, prefix, sensor.totalFrames),
      droppedFrames: numericValue(hass, prefix, sensor.droppedFrames),
      exposureSeconds: numericValue(hass, prefix, sensor.exposure),
      integrationMinutes: numericValue(hass, prefix, sensor.integrationTime),
    },
    pointing: {
      altitude: numericValue(hass, prefix, sensor.altitude),
      azimuth: numericValue(hass, prefix, sensor.azimuth),
      rightAscension: numericValue(hass, prefix, sensor.rightAscension),
      declination: numericValue(hass, prefix, sensor.declination),
      fieldOfView: sensorValue(hass, prefix, sensor.fieldOfView),
      fieldRotation: numericValue(hass, prefix, sensor.fieldRotation),
      starsDetected: numericValue(hass, prefix, sensor.starsDetected),
    },
    mount: {
      plan: sensorValue(hass, prefix, sensor.plan),
      planRunning: booleanValue(hass, prefix, ENTITY_KEYS.binarySensor.planRunning),
      tracking: booleanValue(hass, prefix, ENTITY_KEYS.binarySensor.tracking),
      slewing: booleanValue(hass, prefix, ENTITY_KEYS.binarySensor.slewing),
      gotoState: sensorValue(hass, prefix, sensor.gotoState),
      mountMode: sensorValue(hass, prefix, sensor.mountMode),
      parked: booleanValue(hass, prefix, ENTITY_KEYS.binarySensor.parked),
      atHome: booleanValue(hass, prefix, ENTITY_KEYS.binarySensor.atHome),
    },
    detection: {
      catalogObjects: sensorValue(hass, prefix, sensor.catalogObjects),
      objectsInFrame: numericValue(hass, prefix, sensor.objectsInFrame),
    },
    health: {
      battery: numericValue(hass, prefix, sensor.battery),
      sensorTemperature: numericValue(hass, prefix, sensor.sensorTemperature),
      charger: sensorValue(hass, prefix, sensor.charger),
      storageUsed: numericValue(hass, prefix, sensor.storageUsed),
      focuserPosition: numericValue(hass, prefix, sensor.focuserPosition),
      firmware: sensorValue(hass, prefix, sensor.firmware),
      dewHeater: booleanValue(hass, prefix, ENTITY_KEYS.binarySensor.dewHeater),
      connected: booleanValue(hass, prefix, ENTITY_KEYS.binarySensor.connected),
      lastAlert: sensorValue(hass, prefix, sensor.lastAlert),
    },
  };
}
