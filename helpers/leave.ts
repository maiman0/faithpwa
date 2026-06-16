import { type LeaveTypeOption } from "../constants/leave";

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
