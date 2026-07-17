# Contributing

Thanks for your interest in the Seestar Card. This is a small single-purpose
Lovelace card; contributions that keep it focused and dependency-light are
welcome.

## Prerequisites

- Node.js 20+ and npm.
- The card renders entities from the
  [`ha-seestar`](https://github.com/jaxzin/ha-seestar) bridge add-on. You don't
  need a live bridge to develop — `demo/index.html` mounts the card against mock
  data — but bridge-side behaviour is documented there.

## Setup

```bash
npm ci
```

## Development loop

```bash
npm run lint    # tsc --noEmit — type-check, no emit
npm run build   # rollup → dist/seestar-card.js (minified)
```

Then open `demo/index.html` in a browser to eyeball your change against the four
mock scopes (stargazing / solar / scenery / post-restart) in light and dark
themes. The demo cache-busts the bundle on load, so a rebuild shows up on
refresh.

## The committed bundle

`dist/seestar-card.js` is **committed on purpose** — HACS and the manual install
serve it directly. The CI workflow rebuilds it and runs `git diff --exit-code
dist/`, so a pull request whose `dist/` doesn't match a fresh build of `src/`
will fail.

Whenever you change anything under `src/`:

1. `npm run build`
2. Commit the updated `dist/seestar-card.js` alongside your source change.

## Pull requests

- Keep the type surface honest — `types.ts` is a hand-authored subset of the HA
  frontend interfaces; don't pull in `custom-card-helpers` or
  `home-assistant-js-websocket`.
- Don't rename existing config keys (`device`, `name`, `accent`,
  `camera_entity`, `live_camera_entity`, `actions`) without a major-version bump
  — dashboards depend on them.
- Add a `CHANGELOG.md` entry under **Unreleased**.
- Make sure `npm run lint` and `npm run build` both pass and `dist/` is clean.

## License

By contributing you agree that your contributions are licensed under the
project's [MIT License](LICENSE).
