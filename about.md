Category → Module → Goal → Features

Faith (HRMS PWA First)
├── About — Mobile-first companion app to the FAITH Workspace Platform (Expo + RN + TS). v0.2.0 (handover build), version and changelog sourced from constants/about.ts.
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

Done
├── App
│   ├── Desktop device frame implemented in app/_layout.tsx (not +html.tsx, which is inert under web.output "single") — bezel, fake status bar, notch, and home indicator on wide viewports, no-op on mobile, collapses in installed PWA (standalone) mode.
│   ├── Fixed notch/home-indicator overlapping app content — they're now normal flex rows reserving real top/bottom safe-area space instead of absolute overlays.
│   ├── Moved the Overlay demo screen from app/(tabs)/home/main.tsx to a top-level unlisted route app/main.tsx, removed its Stack.Screen registration from home/_layout.tsx, and exempted /main from the root auth-redirect guard so it's reachable by direct URL regardless of login state.
│   ├── About sheet "What's New" now shows only the latest changelog entry (changelog[0]) instead of the full history.
│   ├── Fixed toast/loader/modal/sheet rendering full-browser-width instead of clipped to the device frame — react-native-paper's <Portal> always teleports to the nearest Portal.Host, and the default one (from PaperProvider, in themeContext.tsx) sits above the frame at the app root. Split overlayContext.tsx's rendering into a new <OverlayOutlet /> component, nested it inside a local <Portal.Host> placed within the frame's screen View (app/_layout.tsx), so those overlays now resolve to that inner host instead of escaping to the outer one. Alert/confirm looked fine before only by coincidence (small, centered dialogs).
│   └── Home header avatar (components/head.tsx) now shows a small chevron-down badge overlapping its bottom-right corner, signaling it opens the account picker menu.
├── Newsflash
│   └── Removed the dead mock dataset (newsflashes) and its now-unused NewsflashItem type from constants/newsflash.ts — confirmed no live imports first. Real data comes entirely from contexts/api/broadcast.tsx / broadcastStore.ts.
├── Room Booking
│   └── constants/room.ts was effectively empty. Added ROOM_IMAGE_BASE_URL there (the CDN base URL, a business constant) and updated helpers/room.ts's roomImageUrl() to build off it — now matches the constants/business-config vs. helpers/pure-formatting split used by every other module.
├── Staff / Profile / Settings
│   ├── About sheet version was hardcoded ("2.4.0") and didn't match package.json — now sourced from constants/about.ts (APP_VERSION), synced with package.json/app.json.
│   ├── Added a "What's New" changelog section to the About sheet, data-driven from constants/about.ts (changelog array).
│   ├── Removed the Push Notifications stub row from App Preferences (app/(tabs)/settings/index.tsx) — it only ever showed a "coming soon" toast; Dark Mode toggle is now the only item in that sheet.
│   ├── Dark Mode toggle wasn't responding to taps with react-native-paper's <Switch> on web. Replaced it with a custom components/toggleSwitch.tsx (Animated track + thumb, theme-driven colors) used in App Preferences.
│   └── Dark Mode switch stayed visually stuck even with the custom switch — the real bug was that showSheet()'s content is a JSX element evaluated once at open time (contexts/overlayContext.tsx captures a static snapshot), so isDark/toggleTheme were frozen at whatever they were when the sheet opened. Fixed by extracting the sheet body into components/preferencesSheet.tsx, which reads useAppTheme() itself so it re-renders on context changes regardless of when the sheet was opened.
├── Shared (Design Tokens)
│   └── Confirmed scale/setScale and useDesignContext (contexts/designContext.tsx) had zero consumers anywhere. Removed them — DesignProvider now just serves the static design tokens object via useDesign().
└── Repo-level
    ├── Bumped package.json / app.json / constants/about.ts to 0.2.0 (App Layout device-frame feature) after 0.1.0 handover build.
    └── Added CHANGELOG.md at the repo root (Keep a Changelog style), mirroring constants/about.ts. Both must be updated together on future version bumps.

Revise
├── Auth
│   ├── Profile is populated with placeholder name/initials ("User"/"Staff") on load/sign-in until useStaff fetches real data — confirm this is intentional (loading state) not a bug.
│   └── loadSession failure only does console.error — no user-facing error/toast if session restore fails.
├── App
│   ├── app/+html.tsx still carries PWA meta tags (manifest link, apple-touch-icon, apple-mobile-web-app-capable) that are silently dropped from the real build for the same reason (web.output "single" ignores +html.tsx) — worth checking whether the exported HTML is actually missing the manifest link/PWA installability tags in production.
│   └── showModal()/showSheet() content is captured as a static JSX snapshot at call time (contexts/overlayContext.tsx) — any value baked into that content as a plain prop (not read via a hook inside a child component) will go stale if it changes while the overlay is open. Home's account picker (app/(tabs)/home/index.tsx, operationView label) has the same pattern; low-risk there since the modal closes immediately on selection, but worth keeping in mind for future overlay content.
└── Staff / Profile / Settings
    └── About sheet still links an external "Latest Development" Vercel preview URL alongside the production URL — confirm this should still be exposed to end users before release.
