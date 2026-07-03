import { IconName } from "./icon";

export type NewsflashPriority = "Critical" | "Important" | "Normal";

export const newsflashFilters: (NewsflashPriority | "All")[] = [
  "All",
  "Critical",
  "Important",
  "Normal",
];

export const newsflashPriorities: Record<
  NewsflashPriority,
  {
    label: string;
    color: string;
    cardColor: string;
    icon: IconName;
  }
> = {
  Critical: {
    label: "Critical",
    color: "#F87171", // Red
    cardColor: "#7F1D1D",
    icon: "alert",
  },

  Important: {
    label: "Important",
    color: "#FACC15", // Yellow
    cardColor: "#854D0E",
    icon: "alert-circle",
  },

  Normal: {
    label: "Normal",
    color: "#4ADE80", // Green
    cardColor: "#166534",
    icon: "information",
  },
};
