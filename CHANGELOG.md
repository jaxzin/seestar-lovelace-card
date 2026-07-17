# Changelog

All notable changes to this project are documented here.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.1.0] - 2026-07-02

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
- Standalone `demo/index.html` fidelity harness.

[Unreleased]: https://github.com/jaxzin/seestar-lovelace-card/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/jaxzin/seestar-lovelace-card/releases/tag/v0.1.0
