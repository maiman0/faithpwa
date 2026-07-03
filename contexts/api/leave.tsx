import api from './api';
import { getErrorMessage } from '../../helpers/error';

export type Leave = {
  leave_id: number;
  leave_type: string;
  leave_name: string; 
  leave_period: string;
  start_date: string;
  start: string;
  end_date: string;
  end: string;
  date: string;
  duration: string;
  duration_name: string;
  reason?: string;
  clinic_id?: number;
  illness?: string;
  remarks?: string;
  document_ref_no?: string;
  document_url?: string;
  manager_status: string;
  tl_status?: string;
  cancellation_dt?: string;
  cancellation_by?: string;
  cancellation_action?: string;
};

export type LeaveResponse = {
  status: 'success' | 'error';
  message?: string;
  data?: Leave[];
  leave_id?: number;
  error?: string;
  execute_success?: boolean;
};

// Mutation endpoints don't share one success shape across the PHP backend
// (some return `status: 'success'`, some `execute_success`, some just the new
// record). Treat a 2xx response as success unless it explicitly reports an error.
const isMutationOk = (data: LeaveResponse): boolean =>
  data.status === 'success' ||
  data.execute_success === true ||
  typeof data.leave_id === 'number' ||
  (!data.error && data.status !== 'error');

export const getLeaveRecords = async (): Promise<Leave[]> => {
  try {
    const response = await api.get<LeaveResponse>('/leave.php');

    if (response.data.status === 'success' && Array.isArray(response.data.data)) {
      return response.data.data;
    }
    
    // Fallback if the API returns an array directly (legacy or inconsistent)
    if (Array.isArray(response.data)) {
      return response.data;
    }

    return [];
  } catch (error: unknown) {
    const message = getErrorMessage(error, 'Failed to fetch leave records');
    console.error('Error fetching leave records:', message);
    throw new Error(message);
  }
};

export const applyLeave = async (formData: FormData): Promise<LeaveResponse> => {
  try {
    const response = await api.post<LeaveResponse>('/leave.php', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    const data = response.data ?? ({} as LeaveResponse);
    return {
      status: isMutationOk(data) ? 'success' : 'error',
      message: data.message || data.error,
      leave_id: data.leave_id,
      data: data.data,
    };
  } catch (error: unknown) {
    throw new Error(getErrorMessage(error, 'Failed to submit leave application'));
  }
};

export const cancelLeaveRequest = async (leave_id: number): Promise<LeaveResponse> => {
  try {
    const response = await api.post<LeaveResponse>('/leave.php?action=withdraw', {
      leave_id,
    });
    const data = response.data ?? ({} as LeaveResponse);
    return {
      status: isMutationOk(data) ? 'success' : 'error',
      message: data.message || data.error,
    };
  } catch (error: unknown) {
    throw new Error(getErrorMessage(error, 'Failed to cancel leave'));
  }
};

