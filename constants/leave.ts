import { MaterialCommunityIcons } from "@expo/vector-icons";

export type LeaveStatus = "All" | "Pending" | "Approved" | "Rejected" | "Cancelled";

export const leaveFilters: LeaveStatus[] = [
  "All",
  "Pending",
  "Approved",
  "Rejected",
  "Cancelled",
];

export const leaveStatusStyles: Record<
  Exclude<LeaveStatus, "All">,
  {
    label: string;
    color: string;
    icon: keyof typeof MaterialCommunityIcons.glyphMap;
  }
> = {
  Pending: {
    label: "Pending",
    color: "#F59E0B", // Amber
    icon: "clock-outline",
  },
  Approved: {
    label: "Approved",
    color: "#10B981", // Green
    icon: "check-circle-outline",
  },
  Rejected: {
    label: "Rejected",
    color: "#EF4444", // Red
    icon: "close-circle-outline",
  },
  Cancelled: {
    label: "Cancelled",
    color: "#6B7280", // Gray
    icon: "cancel",
  },
};

export const LEAVE_REASONS = [
  { id: "personal", label: "Personal", icon: "account-outline" },
  { id: "emergency", label: "Emergency", icon: "alert-outline" },
  { id: "medical", label: "Medical", icon: "medical-bag" },
  { id: "family", label: "Family", icon: "home-outline" },
  { id: "others", label: "Others", icon: "dots-horizontal-circle-outline" },
];

export type LeaveTypeOption = {
  id: string;
  label: string;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  // Medical types require a supporting document AND surface the clinic field.
  medical?: boolean;
  // Non-medical types that still require a supporting document (no clinic).
  requiresDocument?: boolean;
};

export const LEAVE_TYPES: LeaveTypeOption[] = [
  { id: "AL", label: "Annual Leave", icon: "calendar-star" },
  { id: "UL", label: "Unpaid Leave", icon: "cash-remove" },
  { id: "RP", label: "Replacement Leave", icon: "calendar-refresh", requiresDocument: true },
  { id: "MR", label: "Marriage Leave", icon: "ring", requiresDocument: true },
  { id: "PL", label: "Paternity Leave", icon: "human-male-child", requiresDocument: true },
  { id: "ML", label: "Maternity Leave", icon: "human-pregnant", requiresDocument: true },
  { id: "CL", label: "Compassionate Leave", icon: "hand-heart", requiresDocument: true },
  { id: "CML", label: "Calamity Leave", icon: "weather-lightning-rainy", requiresDocument: true },
  { id: "SL", label: "Sick Leave", icon: "medical-bag", medical: true },
  { id: "HL", label: "Hospitalisation Leave", icon: "hospital-box", medical: true },
  { id: "WFH", label: "Work From Home", icon: "home-account", requiresDocument: true },
];

export const LEAVE_PERIODS = [
  { id: "full", label: "Full Day", value: "Full Day", icon: "clock-outline" },
  { id: "morning", label: "First Half", value: "1st Half Day", icon: "weather-sunny" },
  { id: "afternoon", label: "Second Half", value: "2nd Half Day", icon: "weather-night" },
];

export const LEAVE_POLICIES: {
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  color: string;
  title: string;
  description: string;
}[] = [
  {
    icon: "account-check-outline",
    color: "#10B981",
    title: "Manager Approval",
    description:
      "Discuss and obtain verbal approval from your manager before submitting your application.",
  },
  {
    icon: "calendar-clock",
    color: "#F59E0B",
    title: "Payday Cycle",
    description:
      "Applications after the 20th may only be reflected in the following month's payslip.",
  },
  {
    icon: "file-document-outline",
    color: "#6366F1",
    title: "Documentation",
    description:
      "Emergency leaves must be supported by valid documentation upon your return.",
  },
];
