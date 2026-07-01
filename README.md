# Seestar Card

A custom [Home Assistant](https://www.home-assistant.io/) Lovelace card for the
**Seestar S30 Pro** bridge. It renders one scope's live imaging state — the
stacked-image preview, current target and mode, stacking progress, plate-solved
pointing, plan/mount status, and device health — as a single self-theming card.

The card is a pure frontend consumer of the entities the
[`seestar-ha`](https://github.com/jaxzin/seestar-ha) bridge publishes over MQTT.
It reads Home Assistant state only; it does not talk to the scope directly.

## Install (HACS custom repository)

1. In HACS, open **Frontend → ⋮ → Custom repositories**.
2. Add this repository's URL with category **Lovelace** (Dashboard).
3. Install **Seestar Card**, then reload your browser.

HACS registers the `dist/seestar-card.js` resource automatically. For a manual
install, copy that file into `config/www/` and add it as a dashboard resource of
type **JavaScript Module**.

## Configuration

Add the card to a dashboard (Manual card / YAML mode):

```yaml
type: custom:seestar-card
device: seestar_s30_pro   # the bridge device-id prefix for your scope
```

`device` is the entity-id prefix the bridge assigns to the scope (a slug of the
scope's name). The card derives every entity id from it, e.g.
`camera.seestar_s30_pro_live_stacked_preview`,
`sensor.seestar_s30_pro_altitude`.

### Options

| Option    | Type                          | Default              | Description                                        |
| --------- | ----------------------------- | -------------------- | -------------------------------------------------- |
| `type`    | string                        | —                    | Must be `custom:seestar-card`.                     |
| `device`  | string                        | —                    | **Required.** Entity-id prefix for the scope.      |
| `name`    | string                        | the device prefix    | Card title override.                               |
| `accent`  | string                        | `--primary-color`    | Accent colour (any CSS colour).                    |
| `actions` | map of name → `{service,data}` | —                    | Named service calls for scope controls.            |

Example with overrides:

```yaml
type: custom:seestar-card
device: seestar_s30_pro
name: Backyard Seestar
accent: "#7c4dff"
```

## Theming

The card is styled entirely with Home Assistant theme variables
(`--primary-color`, `--card-background-color`, `--primary-text-color`,
`--secondary-text-color`, `--divider-color`, `--secondary-background-color`,
`--success-color`, `--warning-color`, `--error-color`, `--ha-card-*`), so it
follows your active light/dark theme automatically.

## Development

```bash
npm install
npm run lint    # tsc --noEmit (type-check)
npm run build   # bundle to dist/seestar-card.js
```

`dist/seestar-card.js` is committed so HACS can serve it directly.

## License

MIT © 2026 Brian R. Jackson
