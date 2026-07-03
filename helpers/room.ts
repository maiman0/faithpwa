// Room date/time display — all formatting delegates to the master date helper.
import {
  toApiDate,
  formatLongDate,
  formatMediumDate,
  formatFullDateYear,
  formatClockTime,
} from "./date";
import { ROOM_IMAGE_BASE_URL } from "../constants/room";

// Timezone-safe "YYYY-MM-DD" for the selected day (store seed + "today" checks).
export const todayApiDate = (): string => toApiDate(new Date());

export const roomImageUrl = (roomId?: number | null): string | null =>
  roomId == null ? null : `${ROOM_IMAGE_BASE_URL}/${roomId}.jpeg`;

export const toRoomApiDate = (value?: string | Date | null): string =>
  toApiDate(value);

// "Monday, 15 June 2026" — booking summary header.
export const formatRoomDateFull = (value?: string | Date | null): string =>
  formatFullDateYear(value);

// "15 June 2026" — booking detail sheet.
export const formatRoomDateLong = (value?: string | Date | null): string =>
  formatLongDate(value, "--");

// "Mon, 15 Jun" — compact card rows and toasts.
export const formatRoomDateMedium = (value?: string | Date | null): string =>
  formatMediumDate(value);

// "9:00 AM - 10:30 AM" — booking time range from API datetime values.
export const formatRoomTimeRange = (
  start?: string | Date | null,
  end?: string | Date | null,
): string => `${formatClockTime(start)} - ${formatClockTime(end)}`;
