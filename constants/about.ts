export interface ChangelogEntry {
  version: string;
  date: string;
  changes: string[];
}

export const APP_NAME = "FAITH Workspace";
export const APP_VERSION = "0.3.0";

export const changelog: ChangelogEntry[] = [
  {
    version: "0.3.0",
    date: "2026-07-03",
    changes: [
      "Overlay Demo moved to an unlisted top-level route (/main), not linked from any in-app navigation",
      "Fixed toast, loader, modal, and sheet overlays rendering full-browser-width instead of clipped within the desktop device frame",
      "About sheet \"What's New\" now shows only the latest version's changes instead of the full history",
    ],
  },
  {
    version: "0.2.0",
    date: "2026-07-03",
    changes: [
      "App Layout: desktop browser now shows a phone device frame (bezel, notch, status bar, home indicator)",
      "Device frame reserves proper top/bottom safe-area space so app content never sits under the notch or home indicator",
      "Frame is a no-op on mobile-width screens and collapses when running as an installed PWA (standalone mode)",
    ],
  },
  {
    version: "0.1.0",
    date: "2026-07-03",
    changes: [
      "Initial handover build",
      "Auth: JWT sign-in/out with session expiry handling",
      "Attendance: daily status, weekly/monthly history",
      "Leave: apply, withdraw, balance, document & clinic support",
      "Newsflash: company broadcasts with acknowledgement",
      "Room Booking: availability, booking, and cancellation",
      "Staff: profile view and update",
    ],
  },
];
