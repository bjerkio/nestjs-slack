# Changelog

## [2.0.1](https://github.com/bjerkio/nestjs-slack/compare/v2.0.0...v2.0.1) (2023-07-13)


### Bug Fixes

* **deps:** update dependency axios to v1 ([#306](https://github.com/bjerkio/nestjs-slack/issues/306)) ([50f5b27](https://github.com/bjerkio/nestjs-slack/commit/50f5b27a979e832330c69431042d55c0ab034666))

## [2.0.0](https://github.com/bjerkio/nestjs-slack/compare/v1.4.1...v2.0.0) (2022-07-13)


### ⚠ BREAKING CHANGES

* Improve configuration (#211)

### Features

* Add multiple webhooks feature ([#217](https://github.com/bjerkio/nestjs-slack/issues/217)) ([5843539](https://github.com/bjerkio/nestjs-slack/commit/58435397f8b0a171e600ac6f1e71129dd3805c22))


### Code Refactoring

* Improve configuration ([#211](https://github.com/bjerkio/nestjs-slack/issues/211)) ([0982baf](https://github.com/bjerkio/nestjs-slack/commit/0982baf0281674a0a857ffd94bee1c24c58406ec))

## [1.4.1](https://github.com/bjerkio/nestjs-slack/compare/v1.4.0...v1.4.1) (2022-07-13)


### Bug Fixes

* wrongly assigned channel ([#212](https://github.com/bjerkio/nestjs-slack/issues/212)) ([f80c66d](https://github.com/bjerkio/nestjs-slack/commit/f80c66d0a1edb3419278508d863ab53818266b19))

## [1.4.0](https://github.com/bjerkio/nestjs-slack/compare/v1.3.4...v1.4.0) (2022-07-13)


### Miscellaneous Chores

* release 1.4.0 ([6dd1bb6](https://github.com/bjerkio/nestjs-slack/commit/6dd1bb66d035093b86b82177b1e8231113fc101f))

### [1.3.4](https://github.com/bjerkio/nestjs-slack/compare/v1.3.3...v1.3.4) (2022-05-21)


### Bug Fixes

* build issues ([f514133](https://github.com/bjerkio/nestjs-slack/commit/f5141334550e8e2d3cd499078d7d67f54a45d8f9))

### [1.3.3](https://github.com/bjerkio/nestjs-slack/compare/v1.3.2...v1.3.3) (2022-05-21)


### Bug Fixes

* release issue ([9354f9c](https://github.com/bjerkio/nestjs-slack/commit/9354f9c718e9cee82a58c10c26a658da64e8fb3e))

### [1.3.2](https://github.com/bjerkio/nestjs-slack/compare/v1.3.1...v1.3.2) (2022-05-21)


### Bug Fixes

* Remove error when channel or defaultChannel is unset for google ([54421af](https://github.com/bjerkio/nestjs-slack/commit/54421afadcbd5eb2f0e3f50d995aa78f1257a3ad))

### [1.3.1](https://www.github.com/bjerkio/nestjs-slack/compare/v1.2.0...v1.3.1) (2022-01-01)


### Features

* Add webhook type ([#80](https://www.github.com/bjerkio/nestjs-slack/issues/80)) ([4ca3e5d](https://www.github.com/bjerkio/nestjs-slack/commit/4ca3e5d2f4f866775639a6566e0d7ea193b5796a))
* forRootAsync ([#83](https://www.github.com/bjerkio/nestjs-slack/issues/83)) ([5c06158](https://www.github.com/bjerkio/nestjs-slack/commit/5c061589ecce57077bcf252cec7b4eeee193a041))


### Bug Fixes

* add @slack/web-api and slack-block-builder to dependencies ([12686c3](https://www.github.com/bjerkio/nestjs-slack/commit/12686c37cbece91dc2f739a4c763cdae2bd60bb4))
* move @google-cloud/logging to deps g ([3463bb6](https://www.github.com/bjerkio/nestjs-slack/commit/3463bb6f7b8221916cca87c9b67fffe56700f97f))
* move @google-cloud/logging to devDependencies ([24d845a](https://www.github.com/bjerkio/nestjs-slack/commit/24d845a3860489a53c6594d8572b6a20b88a4f5d))


### Miscellaneous Chores

* release 1.3.1 ([974db07](https://www.github.com/bjerkio/nestjs-slack/commit/974db076ec208daeb360c249f13a432b4aebd146))

### [1.3.1](https://github.com/bjerkio/nestjs-slack/compare/v1.3.0...v1.3.1) (2021-12-31)


### Bug Fixes

* move @google-cloud/logging to devDependencies ([24d845a](https://github.com/bjerkio/nestjs-slack/commit/24d845a3860489a53c6594d8572b6a20b88a4f5d))

## [1.3.0](https://github.com/bjerkio/nestjs-slack/compare/v1.2.0...v1.3.0) (2021-12-31)


### Features

* Add webhook type ([#80](https://github.com/bjerkio/nestjs-slack/issues/80)) ([4ca3e5d](https://github.com/bjerkio/nestjs-slack/commit/4ca3e5d2f4f866775639a6566e0d7ea193b5796a))
* forRootAsync ([#83](https://github.com/bjerkio/nestjs-slack/issues/83)) ([5c06158](https://github.com/bjerkio/nestjs-slack/commit/5c061589ecce57077bcf252cec7b4eeee193a041))


### Bug Fixes

* add @slack/web-api and slack-block-builder to dependencies ([12686c3](https://github.com/bjerkio/nestjs-slack/commit/12686c37cbece91dc2f739a4c763cdae2bd60bb4))

## [1.2.0](https://www.github.com/bjerkio/nestjs-slack/compare/v1.1.0...v1.2.0) (2021-08-30)


### Features

* Append version to producer metadata and add `slack` to log entry. ([1a499d8](https://www.github.com/bjerkio/nestjs-slack/commit/1a499d81686d39319766617422e2e1946270a7c6))

## [1.1.0](https://www.github.com/bjerkio/nestjs-slack/compare/v1.0.1...v1.1.0) (2021-08-30)


### Features

* Add newline on stdout writing function ([908cccd](https://www.github.com/bjerkio/nestjs-slack/commit/908cccd3e877b656a9d1c29097a2256b5d2f744d))


### Bug Fixes

* logs not being parsed in stackdriver. ([#22](https://www.github.com/bjerkio/nestjs-slack/issues/22)) ([5f4d393](https://www.github.com/bjerkio/nestjs-slack/commit/5f4d3931f7def0463afa655f173b716addd9c5d2))

### [1.0.1](https://www.github.com/bjerkio/nestjs-slack/compare/v1.0.0...v1.0.1) (2021-08-07)


### Bug Fixes

* add missing peerDependencies ([#8](https://www.github.com/bjerkio/nestjs-slack/issues/8)) ([d2a4f7b](https://www.github.com/bjerkio/nestjs-slack/commit/d2a4f7b667e73586d12d74de47d31790829d62c8))

## 1.0.0 (2021-08-07)


### Features

* First release ([0b089f3](https://www.github.com/bjerkio/nestjs-slack/commit/0b089f34a878645e3be1e34475fee12813765d47))
