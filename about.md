Category → Module → Goal → Features

Faith (HRMS PWA First)
├── About — Mobile-first companion app to the FAITH Workspace Platform
│
├── Category
│   ├── Auth
│   │   └── JWT / Session
│   │       ├── Goal - Let staff sign in securely, persist session across restarts, and force sign-out when the session dies/expires.
│   │       └── Features
│   │           ├── Username/password login → /auth.php, JWT + expiry + session_id stored in AsyncStorage
│   │           ├── Token-expiry check on every read; auto-clears expired tokens
│   │           ├── Axios interceptor auto-attaches Authorization: Bearer header
│   │           ├── De-duped global 401 handler → forced sign-out, even under a burst of failing requests
│   │           ├── Manual sign-out (with confirm dialog) vs. forced sign-out (silent), server-side revoke via /logout.php
│   │           ├── Sign-in/out clears all per-module stores (staff, broadcast, leave, room, attendance)
│   │           └── useSession surfaces last-login time/IP/platform for Home footer, degrades gracefully if unavailable
│   │
│   ├── Home
│   │   ├── Goal - Single dashboard summarizing attendance, leave, newsflash and room-booking status with quick navigation.
│   │   └── Features
│   │       ├── Time-of-day greeting header, avatar menu (Update Details / switch operation-manager view)
│   │       ├── Live attendance summary, leave stats (pending + AL balance), newsflash carousel, room booking stats — all hook-driven
│   │       └── Scroll-to-top control, one-time welcome toast on staff load
│   │
│   ├── Attendance
│   │   ├── Goal - Show staff their scheduled vs. actual clock in/out and status history; let managers view team attendance.
│   │   └── Features
│   │       ├── /attendance.php with operation (own) vs. manager (team) toggle
│   │       ├── Status codes resolved + cached via /attStatus.php (statusMap), with fallback on failure
│   │       ├── Weekly/Monthly toggle view (AttendanceOverview / AttendanceInsight)
│   │       ├── Rich derivation logic: recorded/pending/missed states with tone + human notes ("45 min late", "On time"), past/today/future aware
│   │       ├── 8 status presets (working/present/late/absent/weekend/annualLeave/sickLeave/publicHoliday) with color/icon/message
│   │       └── Pull-to-refresh with toast confirmation
│   │
│   ├── Leave
│   │   ├── Goal - View leave balances/history, submit new applications (incl. documents/clinic for medical leave), cancel pending ones.
│   │   └── Features
│   │       ├── 11 leave types with per-type document/clinic requirements
│   │       ├── Full/half-day period selection, single/range date picker, computed duration
│   │       ├── Full form validation (type, period, date, reason, conditional clinic/document)
│   │       ├── Multipart submit to /leave.php with optional document upload
│   │       ├── Withdraw flow → /leave.php?action=withdraw, optimistic local status update
│   │       ├── Monthly balance via /balance.php; static 3-rule leave policy sheet
│   │       └── Clinic search modal (debounced, 2-char min) against /clinic.php
│   │
│   ├── Newsflash
│   │   ├── Goal - Deliver company announcements/broadcasts with priority-based treatment and an acknowledgement workflow.
│   │   └── Features
│   │       ├── /broadcast.php list + detail sheet, HTML content via react-native-render-html
│   │       ├── Priority levels (Critical/Important/Normal) with color/icon, normalized defensively from API casing
│   │       ├── Acknowledge action → optimistic local flip of Acknowledged
│   │       └── Optional limit param to slice list for Home carousel
│   │
│   ├── Room Booking
│   │   ├── Goal - Browse rooms, check real-time slot availability, book a room with a purpose, manage/cancel own reservations.
│   │   └── Features
│   │       ├── Room list (/roomBooking.php?allRooms=true) + per-day availability (/roomAvailability.php)
│   │       ├── Time-slot picker: past-slot handling for "today", paired-slot visibility logic
│   │       ├── Multi-slot selection with auto time-sort, 3-char min purpose validation
│   │       ├── Booking confirm → /roomBooking.php, navigates to bookings list then background-refreshes
│   │       ├── My Bookings: Upcoming/Past/Cancelled tabs, pull-to-refresh
│   │       ├── Cancel booking with confirm dialog
│   │       └── Room images from a fixed CDN URL pattern
│   │
│   ├── Staff / Profile / Settings
│   │   ├── Goal - View profile/settings, edit personal contact details with validation.
│   │   └── Features
│   │       ├── Full profile fetch from /staff.php, rendered via Tail component
│   │       ├── Update screen: validated nickname/email/contact(7-15 digit)/address, save gated on "changed AND valid"
│   │       ├── Update posts merged full record (strips server-derived fields) so backend doesn't blank untouched fields
│   │       ├── Settings: theme toggle sheet, About sheet with links + version/changelog
│   │       └── useUpload: image/document picker, MIME allowlist, 1MB cap, permission fallback to system settings
│   │
│   ├── Shared (Overlay / Theme / Design Tokens / Backend Context)
│   │   ├── Goal - Consistent reusable UI/interaction layer and a single hardened HTTP client used by every module.
│   │   └── Features
│   │       ├── OverlayProvider: alert, confirm (destructive variant), toast (5 variants), modal, bottom sheet, fullscreen loader, performRefresh helper; no-op fallback outside provider
│   │       ├── ThemeProvider: light/dark MD3 theme, custom brand palette + SourceSansPro typography
│   │       ├── DesignProvider: spacing/radii/sizing/motion/elevation design tokens
│   │       ├── Single Axios instance: 30s timeout, JWT + platform/app-version headers, global 401 → session-expired handler
│   │       └── Clinic search (debounced) + DocumentModal (leave document ref capture)
│   │
│   ├── App Layout
│   │   ├── Goal - Make the web build feel native on any surface: full-bleed on real phones/installed PWA, a phone-mockup frame in a normal desktop browser tab.
│   │   └── Features
│   │       ├── Implemented in app/_layout.tsx (AppContent) as a React/View-based frame — app/+html.tsx customization does NOT apply, since web.output is "single" (Expo ignores +html.tsx in that mode); confirmed by inspecting `expo export -p web` output.
│   │       ├── Desktop-width, non-standalone: renders a phone bezel (dark rounded frame) with a fake status bar (time + signal/wifi/battery icons), a notch cut into the status bar row, and a fake home indicator — status bar and home indicator are normal flex rows (not absolute overlays), so app content gets real top/bottom safe-area space instead of sitting under them.
│   │       ├── No-op on mobile-width screens (existing plain SafeAreaView path, unchanged)
│   │       └── Collapses via matchMedia("(display-mode: standalone)") so an installed PWA still fills the screen natively
│   │
│   └── Overlay Demo (app/main.tsx)
│       ├── Goal - Give a place to exercise every Overlay primitive (alert, confirm, toast, modal, sheet, loader) without wiring one into a real screen.
│       └── Features
│           ├── Top-level unlisted route at /main (moved out of app/(tabs)/home/main.tsx) — not linked from any in-app button/nav, reached by typing the URL directly
│           ├── Exempted from the root auth-redirect guard (app/_layout.tsx) so it's reachable whether logged in or out
│           └── Demo toggle between populated state and NoData empty state


Todo
(none open)

Revise
├── App
│   ├── CONFIRMED via `expo export -p web`: shipped dist/index.html only has Expo's default template head — app/+html.tsx's manifest link, apple-touch-icon, mobile-web-app-capable/apple-mobile-web-app-* meta, and custom viewport (`viewport-fit=cover`, `user-scalable=no`) are all absent in production (web.output effectively "single" ignores +html.tsx, as already suspected). Two concrete consequences: (1) no manifest link/apple-touch-icon → weaker "Add to Home Screen" install experience; (2) missing `viewport-fit=cover` means `env(safe-area-inset-*)` resolves to 0 on notched devices, so react-native-safe-area-context spacing (app/_layout.tsx SafeAreaView, components/overlay/sheet.tsx + toast.tsx insets) may not reserve space for the notch/home-indicator in the actual installed PWA — verify on a real notched iPhone.
│   ├── showModal()/showSheet() content is still captured as a static JSX snapshot at call time (contexts/overlayContext.tsx) — any value baked into that content as a plain prop (not read via a hook inside a child component) goes stale if it changes while the overlay is open. Home's account picker (app/(tabs)/home/index.tsx, operationView label) has the same pattern; low-risk there since the modal closes immediately on selection, but worth keeping in mind for future overlay content.
│   └── expo-doctor flags 6 packages a patch version behind the installed SDK (expo, expo-document-picker, expo-file-system, expo-image-picker, expo-linking, expo-splash-screen) — run `npx expo install --check` to align.
├── Staff / Profile / Settings
│   └── About sheet still links an external "Latest Development" Vercel preview URL (next-ten-sage-93.vercel.app) alongside the production URL (app/(tabs)/settings/index.tsx) — confirm this should still be exposed to end users before release.
└── Code Style
    └── Widespread `: any` / `as any` contradicts the CLAUDE.md "No any" rule: icon-name casts (`as any`) in ~10 components/hooks (navBar, tail, attendaceInsight, newsflashList, leaveList, acknowledgeButton, useNewsflash, useLeave, settings & attendance index screens), plus `catch (e: any)` throughout nearly every contexts/api/* and hooks/* error handler. Pervasive enough to warrant a deliberate pass — e.g. a shared `IconName` type for MaterialCommunityIcons and typed error narrowing (`catch (e: unknown)` + `isAxiosError`/instanceof checks) — rather than one-off fixes.
