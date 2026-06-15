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

export const toDateKey = (value?: string | Date | null): string | null => {
  const d = toDate(value);
  if (!d) return null;
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
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
