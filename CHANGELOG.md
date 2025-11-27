# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.15.0] - 2025-01-27

### Added
- Automatic token refresh for OAuth sessions to prevent authentication expiration
- `tokenRefreshIntervalMinutes` configuration option (default: 30) for periodic token refresh checks
- `tokenRefreshBufferMinutes` configuration option (default: 30) for proactive token refresh timing
- Visibility change handler that refreshes tokens when users return to the app after being away
- Comprehensive test coverage for token refresh functionality (8 new tests)

### Fixed
- OAuth authentication expiring after a couple hours of inactivity, forcing users to re-authenticate
- Sessions now persist correctly across long periods with app open or when returning after hours away

### Changed
- Default token refresh buffer increased from 5 minutes to 30 minutes for better session persistence
- Internal: `createAuthenticatedConnection` now returns `{ connection, auth }` instead of just connection (non-breaking for public API)

### Documentation
- Added OAuth Token Refresh configuration section to authentication docs
- Updated OAuth benefits to mention persistent sessions and automatic refresh behavior
- Added examples for configuring token refresh intervals

## [0.14.0] and earlier

See [GitHub Releases](https://github.com/dlwiest/hass-react/releases) for historical changes.
