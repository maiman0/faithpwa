Category → Module → Goal → Features

Faith (HRMS PWA First)
├── About — Mobile-first companion app to the FAITH Workspace Platform (Expo + RN + TS). v0.1.0 (handover build), version and changelog sourced from constants/about.ts.
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
│   │   ├── Goal - Single dashboard summarizing attendance, leave, newsflash, and room-booking status with quick navigation.
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
│   │       ├── DesignProvider: spacing/radii/sizing/motion/elevation tokens with a scale multiplier
│   │       ├── Single Axios instance: 30s timeout, JWT + platform/app-version headers, global 401 → session-expired handler
│   │       └── Clinic search (debounced) + DocumentModal (leave document ref capture)
│   │
│   └── App Layout
│       ├── Goal - Make the web build feel native on any surface: full-bleed on real phones/installed PWA, a phone-mockup frame in a normal desktop browser tab.
│       └── Features
│           ├── #mooney-phone-frame wrapper in app/+html.tsx: bezel + fake notch + fake home indicator around the app on desktop widths (≥768px)
│           ├── No-op by default (mobile/narrow viewports render full-bleed, unaffected)
│           └── Explicitly collapses under @media (display-mode: standalone) so an installed PWA still fills the screen natively


Todo
├── App
│   └── Overlay revise — bottom sheet
├── Staff / Profile / Settings
│   └── Push Notifications row is a stub — tapping it just shows a "coming soon" toast (app/(tabs)/settings/index.tsx). Either implement or hide the row until ready.
├── Leave
│   ├── stats.medicalBalance is hardcoded to 0 (hooks/useLeave.tsx) — /balance.php only returns a single AL balance today, so medical/other leave balances aren't real. Needs backend support before this can show real data.
│   └── isMutationOk (contexts/api/leave.tsx) patches around 3 different "success" response shapes from PHP endpoints — backend contract isn't standardized; worth aligning with backend team.
├── Newsflash
│   └── constants/newsflash.ts still ships a 6-item mock dataset with a comment admitting it's dev-era leftover. Check whether anything still imports it live; if not, delete it.
└── Repo-level
    └── No repo-level CHANGELOG.md file — the in-app changelog (constants/about.ts) is the only tracked source of version history so far.

Done
├── App
│   └── Desktop-only phone frame (#mooney-phone-frame) added in app/+html.tsx — bezel/notch/home-indicator on wide viewports, no-op on mobile, collapses in installed PWA (standalone) mode.
├── Staff / Profile / Settings
│   ├── About sheet version was hardcoded ("2.4.0") and didn't match package.json — now sourced from constants/about.ts (APP_VERSION = "0.1.0"), synced with package.json/app.json.
│   └── Added a "What's New" changelog section to the About sheet, data-driven from constants/about.ts (changelog array).
└── Repo-level
    └── Bumped package.json / app.json from 1.0.0 → 0.1.0 to reflect handover/pre-release status.

Revise
├── Auth
│   ├── Profile is populated with placeholder name/initials ("User"/"Staff") on load/sign-in until useStaff fetches real data — confirm this is intentional (loading state) not a bug.
│   └── loadSession failure only does console.error — no user-facing error/toast if session restore fails.
├── Home
│   └── app/(tabs)/home/main.tsx is a leftover "Overlay Demo" playground screen (fake sync simulation, demo toggles) — not a shipped feature, worth removing or gating out of prod.
├── Room Booking
│   └── constants/room.ts is effectively empty — all "constants" (image URL builder, date formatting) live in helpers/room.ts instead. Structural inconsistency vs. other modules; consider moving for consistency (not urgent, no functional impact).
├── Staff / Profile / Settings
│   └── About sheet still links an external "Latest Development" Vercel preview URL alongside the production URL — confirm this should still be exposed to end users before release.
└── Shared (Design Tokens)
    └── DesignProvider's scale/setScale mechanism exists but nothing in current screens calls setScale — likely unused/future-facing (accessibility/dynamic type). Confirm intent or remove if dead.
