# Changelog

All notable changes to this project are documented here.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.2.0] - 2026-11-10

### Changed

- The hero follows the scope: it shows the **Live** camera while a stack is in
  progress (whoever started it, the Seestar app included) or a video session is
  live, and the **Saved** image otherwise. Picking Saved or Live still pins
  that choice.
- The **Saved** view is titled with the saved image's own target (from the
  last saved filename) and captioned "Last saved stack", never with the current
  target; the Live view names that.
- The image is shown whole (letterboxed) instead of cropped to the hero.

### Fixed

- The badge reads **STACKING** for a stack started from the Seestar app (no
  plan running): sub-frames still arriving count as stacking, and the badge
  drops back on its own once they stop, without waiting for another state
  change.
- **LIVE** only appears for live video. A stack served through seestar_alp is
  never labelled LIVE, and choosing the Live source no longer turns the badge
  into LIVE.
- The Live image updates as each new sub-frame arrives (it uses the bridge's
  `image_updated` attribute; needs ha-seestar 1.2.0).

## [0.1.0] - 2026-11-07

Initial public release.

### Added

- `custom:seestar-card` Lovelace card for [ZWO Seestar](https://www.seestar.com/)
  telescopes, consuming the entities published by the
  [`ha-seestar`](https://github.com/jaxzin/ha-seestar) bridge add-on.
- Hero panel with a Saved/Live source toggle, stacking status badge, stacking
  donut, sky dial (or terrestrial framing box for scenery/daylight modes),
  detected-object chips, a status-chip row, and an armable action bar.
- Config options: `device` (required), `name`, `accent`, `camera_entity`,
  `live_camera_entity`, and `actions` for scope controls.
- Fully theme-driven styling that tracks the active Home Assistant light/dark
  theme.
- HACS support (`hacs.json`) with the committed `dist/seestar-card.js` bundle.
- Install instructions and My Home Assistant badges for the Home Assistant
  Marketplace (2026.11 and later) alongside HACS.
- Standalone `demo/index.html` fidelity harness.

[Unreleased]: https://github.com/jaxzin/seestar-lovelace-card/compare/v0.2.0...HEAD
[0.2.0]: https://github.com/jaxzin/seestar-lovelace-card/compare/v0.1.0...v0.2.0
[0.1.0]: https://github.com/jaxzin/seestar-lovelace-card/releases/tag/v0.1.0
