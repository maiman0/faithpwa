export interface ChangelogEntry {
  version: string;
  date: string;
  changes: string[];
}

export const APP_NAME = "FAITH Workspace";
export const APP_VERSION = "0.1.0";

export const changelog: ChangelogEntry[] = [
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
