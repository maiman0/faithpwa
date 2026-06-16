import { type LeaveTypeOption } from "../constants/leave";

// Date formatting is centralised in the shared master date helper.
export {
  toApiDate,
  formatLongDate as formatLeaveDate,
  formatDateRange as formatLeaveDateRange,
} from "./date";

export const formatLeaveDurationLabel = (days: number): string => {
  if (!days) return "";
  if (days === 0.5) return "0.5 Day";
  return `${days} ${days === 1 ? "Day" : "Days"}`;
};

export const leaveRequiresClinic = (
  type?: LeaveTypeOption | null,
): boolean => !!type?.medical;

export const leaveRequiresDocument = (
  type?: LeaveTypeOption | null,
): boolean => !!(type?.medical || type?.requiresDocument);

export const leaveRequirementNote = (
  type?: LeaveTypeOption | null,
): string | null => {
  if (!type) return null;
  if (type.medical) {
    return `${type.label} requires a clinic selection and a supporting document.`;
  }
  if (type.requiresDocument) {
    return `${type.label} requires a supporting document.`;
  }
  return null;
};
