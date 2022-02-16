# Changelog

## Unreleased (yyyy-mm-dd)

### Added

### Changed

### Removed

### Fixed

---

## [2.2.2](https://github.com/bngarren/icu-rounder/compare/v2.1.1...v2.2.2) (2022-02-16)

### Hotfix

- Fixed problem with DemoBox width being too large when gridsPerRow is set to 1 [6f487e8](https://github.com/bngarren/icu-rounder/commit/6f487e8b22fa0c5320b4a8e4f04b99be8816e9ec)

---

## [2.2.1](https://github.com/bngarren/icu-rounder/compare/v2.1.0...v2.2.1) (2022-02-11)

### Hotfix

- With the [2.2.0](https://github.com/bngarren/icu-rounder/compare/v2.1.0...v2.2.0) release came a critical error in the rendering of the PDF document. This was due to an inadvertent upgrade in @react-pdf/renderer's dependencies. We are now upgraded to @react-pdf/renderer v2.1.1 and we have a working PDF render.

---

## [2.2.0](https://github.com/bngarren/icu-rounder/compare/v2.1.0...v2.2.0) (2022-02-11)

### Changed

- Improved styling to SettingsPage
- Theme.js now uses default export instead of named export [17a79a0](https://github.com/bngarren/icu-rounder/commit/17a79a03527f8fbcc86429be7e1ed9a4c44ab4ab)

### Removed

- React scripts 'predeploy' and 'deploy' since we aren't targeting GH pages anymore [a1e0e37](https://github.com/bngarren/icu-rounder/commit/a1e0e372807f8f5c06e4628b32f22db365d9a4c0)

---

## [2.1.0](https://github.com/bngarren/icu-rounder/compare/v2.0.0...v2.1.0) (2022-02-09)

### Added

- Added new functionality to Export section in SettingsPage so that user can now select which bed spaces to export. Can also select all, clear all, and filter non-empty beds out [e9683ea](https://github.com/bngarren/icu-rounder/commit/e9683ea53e768bc429d3581473775fe29a222d57)
- Added Security section to SettingsPage where the user can clear the local browser storage [daf506c](https://github.com/bngarren/icu-rounder/commit/daf506c9cd88e0f64a9e18b3cc10ac03fe188107)

### Changed

- Refactored SettingsPage sections to use better MUI code and improved styling [0a1962b](https://github.com/bngarren/icu-rounder/commit/0a1962b5834f46f700d2532ce755c7d880698236)

### Fixed

- Fixed error handling for ExportSection in the case that there are no beds in the grid [b980a32](https://github.com/bngarren/icu-rounder/commit/b980a320ba751e45b3aaf411ebcf44b9bdc0d959)
- Fixed comma handling in the Bed Layout input in SettingsPage [f60bef6](https://github.com/bngarren/icu-rounder/commit/f60bef616c068b16bb6529bd0e9a3926878c2b2b)

---

## [2.0.0](https://github.com/bngarren/icu-rounder/compare/v1.1.0...v2.0.0) (2022-02-07)

- Fully upgraded to Material UI v5! Style overhaul to the entire app. [`64b8419`](https://github.com/bngarren/icu-rounder/commit/64b8419e8da6325d1262fe1fb77aca2a595110de)
- Added the new Material UI v5 @mui packages and peer dep. @emotion packages [`fe41539`](https://github.com/bngarren/icu-rounder/commit/fe4153961e3350f26023b2b98d8b3f9386c5b13f)

---

## [1.1.0](https://github.com/bngarren/icu-rounder/compare/1.0...v1.1.0) (2022-01-24)

- Fixed problem with Exporter. [`#33`](https://github.com/bngarren/icu-rounder/issues/33)
- Split the SettingsPage into different components for each section [`dfb5e09`](https://github.com/bngarren/icu-rounder/commit/dfb5e090f3eaf05c4b3b5a1e2c164ac13180c89e)
- Added Footer [`3970236`](https://github.com/bngarren/icu-rounder/commit/3970236b23833eaf0f2652329aaccb47d2a4793e)

---

## [1.0.0](https://github.com/bngarren/icu-rounder/commit/b93309633befbfd2c6ff99049ccb3bbe879f3d5e) (2021-07-08)

- First stable release!
- Original dev commit [`9f2cbf3`](https://github.com/bngarren/icu-rounder/commit/9f2cbf3a79990bffb10c2c1707843f89e8b1563a)
