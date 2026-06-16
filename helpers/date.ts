// Master date/time helper — single source of truth for parsing and formatting.

const pad = (n: number) => n.toString().padStart(2, "0");

export const parseDate = (value?: string | Date | null): Date | null => {
  if (!value) return null;
  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? null : value;
  }
  const dateOnly = value.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (dateOnly) {
    const d = new Date(
      Number(dateOnly[1]),
      Number(dateOnly[2]) - 1,
      Number(dateOnly[3]),
    );
    return Number.isNaN(d.getTime()) ? null : d;
  }
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d;
};

const toDate = parseDate;

const parseTimeParts = (
  value?: string | null,
): { h: number; m: number } | null => {
  if (!value) return null;
  const portion = value.includes("T") ? value.split("T")[1] : value;
  const match = portion.match(/(\d{1,2}):(\d{2})/);
  if (!match) return null;
  const h = Number(match[1]);
  const m = Number(match[2]);
  if (Number.isNaN(h) || Number.isNaN(m)) return null;
  return { h, m };
};

export interface DateParts {
  weekday: string;
  weekdayLong: string;
  weekdayInitial: string;
  day: number;
  month: string;
  monthLong: string;
  year: number;
}

export const getDateParts = (value?: string | Date | null): DateParts | null => {
  const d = toDate(value);
  if (!d) return null;
  const weekday = d.toLocaleDateString("en-US", { weekday: "short" });
  return {
    weekday,
    weekdayLong: d.toLocaleDateString("en-US", { weekday: "long" }),
    weekdayInitial: weekday.charAt(0),
    day: d.getDate(),
    month: d.toLocaleDateString("en-US", { month: "short" }),
    monthLong: d.toLocaleDateString("en-US", { month: "long" }),
    year: d.getFullYear(),
  };
};

export const formatTime = (
  value?: string | null,
  fallback = "--:--",
): string => {
  const parts = parseTimeParts(value);
  if (!parts) return fallback;
  const period = parts.h >= 12 ? "PM" : "AM";
  const hour12 = parts.h % 12 === 0 ? 12 : parts.h % 12;
  return `${hour12}:${pad(parts.m)} ${period}`;
};

// "Monday, 15 June"
export const formatFullDate = (
  value?: string | Date | null,
  fallback = "--",
): string => {
  const d = toDate(value);
  if (!d) return fallback;
  return d.toLocaleDateString("en-US", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
};

// "Monday, 15 June 2026"
export const formatFullDateYear = (
  value?: string | Date | null,
  fallback = "--",
): string => {
  const d = toDate(value);
  if (!d) return fallback;
  return d.toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

// Local-time clock from a date or datetime value: "9:00 AM"
export const formatClockTime = (
  value?: string | Date | null,
  fallback = "--:--",
): string => {
  const d = toDate(value);
  if (!d) return fallback;
  return d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
};

// "Mon, 15 Jun"
export const formatMediumDate = (
  value?: string | Date | null,
  fallback = "--",
): string => {
  const d = toDate(value);
  if (!d) return fallback;
  return d.toLocaleDateString("en-US", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
};

// "15 June 2026" (en-GB → no comma, full month)
export const formatLongDate = (
  value?: string | Date | null,
  fallback = "",
): string => {
  const d = toDate(value);
  if (!d) return fallback;
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

export const formatDateRange = (
  range: { start: Date | null; end: Date | null },
  isFullDay: boolean,
): string => {
  if (!range.start) return "Select dates";
  // Only show a range when two distinct days are selected.
  if (
    isFullDay &&
    range.end &&
    toDateKey(range.start) !== toDateKey(range.end)
  ) {
    return `${formatLongDate(range.start)} – ${formatLongDate(range.end)}`;
  }
  return formatLongDate(range.start);
};

// Tolerant formatter for loosely-typed API strings (e.g. "June 2026").
export const formatSmartDate = (
  value?: string | null,
  fallback = "—",
): string => {
  if (!value) return fallback;
  const trimmed = value.trim();
  const d = parseDate(trimmed);
  if (!d) return trimmed;
  if (/^[A-Za-z]+\s+\d{4}$/.test(trimmed)) {
    return d.toLocaleDateString("en-US", { month: "short", year: "numeric" });
  }
  return d.toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

export const formatRelative = (value?: string | null): string | null => {
  const d = toDate(value);
  if (!d) return null;
  const diff = Date.now() - d.getTime();
  if (diff < 0) return null;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return null;
};

export const getRelativeDay = (
  value?: string | Date | null,
): string | null => {
  const d = toDate(value);
  if (!d) return null;
  const today = new Date();
  const diffDays = Math.round(
    (new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime() -
      new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime()) /
      86400000,
  );
  if (diffDays === 0) return "Today";
  if (diffDays === -1) return "Yesterday";
  if (diffDays === 1) return "Tomorrow";
  return null;
};

export const formatDuration = (
  value?: string | null,
  fallback = "--",
): string => {
  const parts = parseTimeParts(value);
  if (!parts) return fallback;
  if (parts.h === 0 && parts.m === 0) return "On time";
  const out: string[] = [];
  if (parts.h) out.push(`${parts.h}h`);
  if (parts.m) out.push(`${parts.m}m`);
  return out.join(" ");
};

export const isToday = (value?: string | Date | null): boolean => {
  const d = toDate(value);
  if (!d) return false;
  const t = new Date();
  return (
    d.getFullYear() === t.getFullYear() &&
    d.getMonth() === t.getMonth() &&
    d.getDate() === t.getDate()
  );
};

export const isSameMonth = (
  value?: string | Date | null,
  ref: Date = new Date(),
): boolean => {
  const d = toDate(value);
  if (!d) return false;
  return d.getFullYear() === ref.getFullYear() && d.getMonth() === ref.getMonth();
};

// "June 2026"
export const formatMonthYear = (
  value?: string | Date | null,
  fallback = "--",
): string => {
  const d = toDate(value);
  if (!d) return fallback;
  return d.toLocaleDateString("en-US", { month: "long", year: "numeric" });
};

export interface MonthMeta {
  year: number;
  month: number;
  daysInMonth: number;
  leadingOffset: number;
}

// "YYYY-MM-DD" from local calendar parts (timezone-safe). Null-safe.
export const toDateKey = (value?: string | Date | null): string | null => {
  const d = toDate(value);
  if (!d) return null;
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
};

// Same as toDateKey but always returns a string (for API payloads).
export const toApiDate = (value?: string | Date | null): string =>
  toDateKey(value) ?? "";

// Inclusive whole-day count between two dates (1 for a single day).
export const daysBetweenInclusive = (
  start?: Date | null,
  end?: Date | null,
): number => {
  if (!start) return 0;
  const e = end ?? start;
  const s = new Date(start.getFullYear(), start.getMonth(), start.getDate());
  const last = new Date(e.getFullYear(), e.getMonth(), e.getDate());
  const diff = Math.round((last.getTime() - s.getTime()) / 86400000);
  return Math.abs(diff) + 1;
};

export const getWeekDates = (ref: Date = new Date()): Date[] => {
  const base = new Date(ref.getFullYear(), ref.getMonth(), ref.getDate());
  const mondayIndex = (base.getDay() + 6) % 7;
  const monday = new Date(base);
  monday.setDate(base.getDate() - mondayIndex);
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return d;
  });
};

export const getMonthMeta = (value?: string | Date | null): MonthMeta => {
  const d = toDate(value) ?? new Date();
  const year = d.getFullYear();
  const month = d.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstWeekday = new Date(year, month, 1).getDay();
  const leadingOffset = (firstWeekday + 6) % 7;
  return { year, month, daysInMonth, leadingOffset };
};

export const formatWorkedHours = (
  login?: string | null,
  logout?: string | null,
  fallback = "--",
): string => {
  const start = parseTimeParts(login);
  const end = parseTimeParts(logout);
  if (!start || !end) return fallback;
  let minutes = end.h * 60 + end.m - (start.h * 60 + start.m);
  if (minutes < 0) minutes += 24 * 60;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  const out: string[] = [];
  if (h) out.push(`${h}h`);
  if (m || !h) out.push(`${m}m`);
  return out.join(" ");
};
