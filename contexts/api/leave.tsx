import api from './api';

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
};

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
  } catch (error: any) {
    const message = error?.response?.data?.message || error?.message || 'Failed to fetch leave records';
    console.error('Error fetching leave records:', message);
    throw new Error(message);
  }
};

export const applyLeave = async (formData: FormData): Promise<LeaveResponse> => {
  try {
    const response = await api.post<LeaveResponse>('/leave.php', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    return response.data;
  } catch (error: any) {
    const message = error?.response?.data?.message || error?.message || 'Failed to submit leave application';
    throw new Error(message);
  }
};

export const cancelLeaveRequest = async (leave_id: number): Promise<LeaveResponse> => {
  try {
    const response = await api.post<LeaveResponse>(`/leave.php?action=cancel&id=${leave_id}`);
    return response.data;
  } catch (error: any) {
    const message = error?.response?.data?.message || error?.message || 'Failed to cancel leave';
    throw new Error(message);
  }
};

