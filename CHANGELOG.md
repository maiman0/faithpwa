# Changelog

All notable changes to this project are documented in this file.

This mirrors the in-app changelog shown in Settings → About → "What's New"
(`constants/about.ts`). Update both together.

## [0.4.0] - 2026-07-03

- Home header avatar now shows a chevron-down badge signaling it opens the account menu
- Removed the Push Notifications stub row from App Preferences
- Fixed the Dark Mode toggle not responding — replaced react-native-paper's Switch with a custom animated ToggleSwitch, and fixed a stale-closure bug that kept it visually stuck
- Removed leftover mock newsflash data; Newsflash is now fully backed by the real API
- Room Booking image URLs now build from a shared constant instead of a hardcoded string
- Removed unused scale/setScale design-token infrastructure
- Added CHANGELOG.md to track version history in the repo

## [0.3.0] - 2026-07-03

- Overlay Demo moved to an unlisted top-level route (`/main`), not linked from any in-app navigation
- Fixed toast, loader, modal, and sheet overlays rendering full-browser-width instead of clipped within the desktop device frame
- About sheet "What's New" now shows only the latest version's changes instead of the full history

## [0.2.0] - 2026-07-03

- App Layout: desktop browser now shows a phone device frame (bezel, notch, status bar, home indicator)
- Device frame reserves proper top/bottom safe-area space so app content never sits under the notch or home indicator
- Frame is a no-op on mobile-width screens and collapses when running as an installed PWA (standalone mode)

## [0.1.0] - 2026-07-03

- Initial handover build
- Auth: JWT sign-in/out with session expiry handling
- Attendance: daily status, weekly/monthly history
- Leave: apply, withdraw, balance, document & clinic support
- Newsflash: company broadcasts with acknowledgement
- Room Booking: availability, booking, and cancellation
- Staff: profile view and update
