import api from './api';
import { getErrorMessage } from '../../helpers/error';

export interface LeaveBalanceItem {
  leaveType: string;
  month: string;
  balance: number;
}

export type LeaveTypeCode =
  | 'AL' | 'SL' | 'UL' | 'RL' | 'MR'
  | 'PL' | 'CL' | 'ML' | 'CAL'
  | 'HL' | 'PGL' | 'PH' | 'GL';

export type LeaveBalanceMap = {
  [type in LeaveTypeCode]?: LeaveBalanceItem;
};

export interface ErrorResponse {
  error: string;
}

/**
 * Note: The current server implementation returns a single AL balance object 
 * for the requested month. This function adapts that response.
 */
export const getAllLeaveBalances = async (month?: string): Promise<LeaveBalanceItem | ErrorResponse> => {
  try {
    const targetMonth = month || new Date().toISOString().slice(0, 7);
    
    const response = await api.get<LeaveBalanceItem | ErrorResponse>('/balance.php', {
      params: { 
        month: targetMonth
      }
    });

    return response.data;
  } catch (error: unknown) {
    return { error: getErrorMessage(error, 'Error fetching leave balances.') };
  }
};

export const getLeaveBalanceByType = async (
  leaveType: LeaveTypeCode,
  month?: string
): Promise<LeaveBalanceItem | ErrorResponse> => {
  try {
    const targetMonth = month || new Date().toISOString().slice(0, 7);
    
    const response = await api.get<LeaveBalanceItem | ErrorResponse>('/balance.php', {
      params: {
        leaveparam: leaveType,
        month: targetMonth,
      }
    });
    if ('error' in response.data) return { error: response.data.error };
    return response.data;
  } catch (error: unknown) {
    return { error: getErrorMessage(error, 'Error fetching specific leave balance.') };
  }
};
