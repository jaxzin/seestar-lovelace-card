/**
 * Minimal Home Assistant frontend type surface for the Seestar card.
 *
 * These are hand-authored, intentionally-narrow subsets of the real
 * `home-assistant-js-websocket` / `custom-card-helpers` interfaces: a custom
 * card only needs `hass.states`, `hass.callService`, and enough of the config
 * contract to type its own inputs. Keeping our own copy avoids pulling those
 * packages (and their transitive weight) into the HACS-shipped bundle.
 */

/** One entity's live state as delivered on `hass.states[entity_id]`. */
export interface HassEntity {
  /** The entity id, e.g. `sensor.seestar_s30_pro_altitude`. */
  readonly entity_id: string;
  /** The primary state string; `"unavailable"` / `"unknown"` when not live. */
  readonly state: string;
  /** Entity attributes (unit_of_measurement, friendly_name, entity_picture …). */
  readonly attributes: Readonly<Record<string, unknown>>;
  /** ISO timestamp of the last state change. */
  readonly last_changed?: string;
  /** ISO timestamp of the last state or attribute update. */
  readonly last_updated?: string;
}

/**
 * The subset of the `hass` object the card consumes. Home Assistant injects the
 * full object via the `hass` property setter on every state change.
 */
export interface HomeAssistant {
  /** Map of entity_id → live state. */
  readonly states: Readonly<Record<string, HassEntity>>;
  /**
   * Call a HA service, e.g. `callService("telescope", "goto", { ... })`.
   * Returns a promise that resolves once the call is accepted.
   */
  callService(
    domain: string,
    service: string,
    serviceData?: Readonly<Record<string, unknown>>,
  ): Promise<unknown>;
}

/**
 * The Lovelace card contract every custom card implements. HA calls
 * `setConfig` once at setup, assigns `hass` on each state change, and queries
 * `getCardSize` to lay the card out in a masonry column.
 */
export interface LovelaceCard extends HTMLElement {
  hass?: HomeAssistant;
  setConfig(config: unknown): void;
  getCardSize(): number | Promise<number>;
}

/**
 * A single card-invoked service call. Mirrors the shape the card needs to hand
 * to {@link HomeAssistant.callService}: a `"domain.service"` string plus its
 * data payload. Kept minimal so users can wire scope controls without the card
 * hardcoding a service catalog.
 */
export interface ActionConfig {
  /** Fully-qualified `"domain.service"`, e.g. `"telescope.park"`. */
  readonly service?: string;
  /** Service-call data payload merged into the `callService` request. */
  readonly data?: Record<string, unknown>;
}

/**
 * The user-authored YAML config for `type: custom:seestar-card`.
 *
 * `device` is the entity-id prefix (the bridge's device-id slug, e.g.
 * `seestar_s30_pro`) from which every entity id is derived; see
 * {@link ./entities}.
 */
export interface SeestarCardConfig {
  /** Discriminator Lovelace uses to pick the card; always `custom:seestar-card`. */
  readonly type: string;
  /** Entity-id prefix / bridge device-id slug, e.g. `seestar_s30_pro`. */
  readonly device: string;
  /** Optional card title override; defaults to the HA device name. */
  readonly name?: string;
  /** Optional accent colour override; defaults to `--primary-color`. */
  readonly accent?: string;
  /**
   * Optional explicit hero camera `entity_id`. When omitted the card
   * auto-resolves `camera.<device>_live_stacked_preview`, falling back to the
   * older `camera.<device>_live_preview` if that's what HA registered.
   */
  readonly camera_entity?: string;
  /**
   * Optional explicit live-view camera `entity_id` (the Phase-2 `/vid` feed).
   * Defaults to `camera.<device>_live_view`.
   */
  readonly live_camera_entity?: string;
  /** Optional map of named actions → service calls for scope controls. */
  readonly actions?: Record<string, ActionConfig>;
}
