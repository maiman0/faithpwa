import api from './api';

export interface Attendance {
  attendance_id: number;
  schedule_date: string;
  status: string;
  shift_id: number;
  original_login: string | null;
  original_logout: string | null;
  actual_login: string | null;
  actual_logout: string | null;
  reason: string | null;
  remarks: string | null;
  login_status: LoginStatus | LoginStatusFallback;
  logout_status: LogoutStatus | LogoutStatusFallback;
  login_difference: string | null;
  logout_difference: string | null;
}

export enum LoginStatus {
  Exact = 'exact',
  Early = 'early',
  Late = 'late',
}

export enum LogoutStatus {
  Exact = 'exact',
  Early = 'early',
  Late = 'late',
}

export enum LoginStatusFallback {
  False = 'false',
}

export enum LogoutStatusFallback {
  Before = 'before',
  False = 'false',
}

export interface AttendanceError {
  error: string;
}

export type AttendanceResponse = Attendance[];

export type AttendanceAPIResponse = AttendanceResponse | AttendanceError;

export interface AttendanceStatus {
  Code: string;
  Description: string;
}

export interface AttendanceStatusError {
  error: string;
}

export type AttendanceStatusAPIResponse = AttendanceStatus | AttendanceStatusError;

// Operation view (default) returns the current user's own attendance via
// `default=true`; manager view returns the team's attendance with no flag.
export const getAttendanceDef = async (
  operationView = true,
): Promise<AttendanceAPIResponse | AttendanceError> => {
  try {
    const url = operationView ? '/attendance.php?default=true' : '/attendance.php';
    const response = await api.get<AttendanceAPIResponse>(url);
    return response.data;
  } catch (error) {
    console.error('Error fetching attendance records:', error);
    return { error: 'Failed to fetch attendance records.' } as AttendanceError;
  }
};

export const getAttendanceStatusDescription = async (
  statusCode: string,
): Promise<AttendanceStatusAPIResponse | AttendanceStatusError> => {
  try {
    const response = await api.get<AttendanceStatusAPIResponse>(
      `/attStatus.php?statusCode=${statusCode}`,
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching attendance status description:', error);
    return { error: 'Failed to fetch attendance status description.' } as AttendanceStatusError;
  }
};
