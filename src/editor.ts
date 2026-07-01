/**
 * `seestar-card-editor` — the visual config editor for the Seestar card.
 *
 * Home Assistant instantiates this via {@link SeestarCard.getConfigElement} when
 * the user edits the card in the Lovelace UI. It exposes the three
 * user-facing options — `device` (the entity-id prefix), `name`, and `accent`
 * (chosen from the design's four accent swatches) — and emits a bubbling,
 * composed `config-changed` event on every edit so Lovelace persists the YAML.
 *
 * It is intentionally dependency-light: it renders plain inputs (not `ha-form`)
 * so it works without importing HA-internal helper types into the shipped
 * bundle, while still styling itself entirely from HA theme variables.
 */
import { LitElement, css, html, type CSSResultGroup, type TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import type { HomeAssistant, SeestarCardConfig } from './types.js';

/** The editor's custom element tag. */
const EDITOR_TAG = 'seestar-card-editor';

/** The accent swatches offered by the editor (from the design's palette). */
const ACCENT_OPTIONS: readonly string[] = ['#03a9f4', '#5c6bc0', '#26a69a', '#ffa726'];

/** The event Lovelace listens for to persist an edited card config. */
const CONFIG_CHANGED = 'config-changed';

/** The detail payload of a {@link CONFIG_CHANGED} event. */
interface ConfigChangedDetail {
  readonly config: SeestarCardConfig;
}

/**
 * The Seestar card's config editor element.
 *
 * `hass` is assigned by HA (unused for rendering but part of the editor
 * contract); `config` holds the working config, mutated per field and
 * re-emitted on every change.
 */
@customElement(EDITOR_TAG)
export class SeestarCardEditor extends LitElement {
  /** Injected by Home Assistant; part of the editor contract. */
  @property({ attribute: false }) public hass?: HomeAssistant;

  /** The working card config, seeded by {@link setConfig}. */
  @state() private config: Partial<SeestarCardConfig> = {};

  public static readonly styles: CSSResultGroup = css`
    .form {
      display: flex;
      flex-direction: column;
      gap: 16px;
      padding: 8px 0;
    }
    label {
      display: flex;
      flex-direction: column;
      gap: 6px;
      font-size: 13px;
      color: var(--secondary-text-color);
    }
    input {
      height: 38px;
      padding: 0 12px;
      border-radius: 8px;
      border: 1px solid var(--divider-color);
      background: var(--card-background-color, #fff);
      color: var(--primary-text-color);
      font-family: inherit;
      font-size: 14px;
    }
    input:focus-visible {
      outline: 2px solid var(--primary-color);
      outline-offset: 1px;
    }
    .hint {
      font-size: 11.5px;
      color: var(--secondary-text-color);
    }
    .swatches {
      display: flex;
      gap: 10px;
    }
    .swatch {
      width: 32px;
      height: 32px;
      border-radius: 8px;
      border: 2px solid transparent;
      cursor: pointer;
      padding: 0;
      transition: border-color 0.15s ease;
    }
    .swatch.selected {
      border-color: var(--primary-text-color);
    }
    .swatch:focus-visible {
      outline: 2px solid var(--primary-color);
      outline-offset: 2px;
    }
  `;

  /** HA seeds the editor's working config with the current card config. */
  public setConfig(config: SeestarCardConfig): void {
    this.config = { ...config };
  }

  /** Merge a field change into the working config and emit `config-changed`. */
  private updateConfig(patch: Partial<SeestarCardConfig>): void {
    const next: SeestarCardConfig = {
      type: this.config.type ?? 'custom:seestar-card',
      device: this.config.device ?? '',
      ...this.config,
      ...patch,
    };
    this.config = next;
    const detail: ConfigChangedDetail = { config: next };
    this.dispatchEvent(new CustomEvent<ConfigChangedDetail>(CONFIG_CHANGED, { detail, bubbles: true, composed: true }));
  }

  /** Read a text input's value on the `input` event. */
  private static valueOf(event: Event): string {
    return (event.target as HTMLInputElement).value;
  }

  private onDeviceInput(event: Event): void {
    this.updateConfig({ device: SeestarCardEditor.valueOf(event) });
  }

  private onNameInput(event: Event): void {
    const name = SeestarCardEditor.valueOf(event);
    this.updateConfig({ name: name.length > 0 ? name : undefined });
  }

  private onAccentPick(accent: string): void {
    const next = this.config.accent === accent ? undefined : accent;
    this.updateConfig({ accent: next });
  }

  protected render(): TemplateResult {
    const { device, name, accent } = this.config;
    return html`
      <div class="form">
        <label>
          Device (entity-id prefix)
          <input
            type="text"
            .value=${device ?? ''}
            placeholder="seestar_s30_pro"
            @input=${this.onDeviceInput}
          />
          <span class="hint">Required. The bridge's device-id slug your entities start with.</span>
        </label>

        <label>
          Name
          <input type="text" .value=${name ?? ''} placeholder="Seestar" @input=${this.onNameInput} />
          <span class="hint">Optional card title override.</span>
        </label>

        <label>
          Accent
          <div class="swatches">
            ${ACCENT_OPTIONS.map(
              (option) => html`<button
                type="button"
                class=${`swatch ${accent === option ? 'selected' : ''}`}
                style=${`background:${option};`}
                aria-label=${`Accent ${option}`}
                aria-pressed=${accent === option}
                @click=${() => this.onAccentPick(option)}
              ></button>`,
            )}
          </div>
          <span class="hint">Optional. Defaults to your theme's primary colour.</span>
        </label>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    [EDITOR_TAG]: SeestarCardEditor;
  }
}
