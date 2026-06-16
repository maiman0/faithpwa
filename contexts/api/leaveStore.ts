import { create } from 'zustand';
import {
  getLeaveRecords,
  applyLeave,
  cancelLeaveRequest,
  type Leave,
  type LeaveResponse
} from './leave';
import { getAllLeaveBalances, type LeaveBalanceItem } from './balance';

type LeaveStore = {
  leaves: Leave[];
  balances: LeaveBalanceItem | null;
  loading: boolean;
  error: string | null;
  fetchLeaves: () => Promise<void>;
  fetchBalances: () => Promise<void>;
  addNewLeave: (formData: FormData) => Promise<LeaveResponse>;
  cancel: (id: number) => Promise<{ success: boolean; error?: string }>;
  markCancelled: (id: number) => void;
  clear: () => void;
};

export const useLeaveStore = create<LeaveStore>((set) => ({
  leaves: [],
  balances: null,
  loading: false,
  error: null,

  fetchLeaves: async () => {
    set({ loading: true, error: null });
    try {
      const data = await getLeaveRecords();
      set({ leaves: data, error: null });
    } catch (e: any) {
      set({ error: e.message });
    } finally {
      set({ loading: false });
    }
  },

  fetchBalances: async () => {
    try {
      const currentMonth = new Date().toISOString().slice(0, 7); // Gets YYYY-MM
      const data = await getAllLeaveBalances(currentMonth);
      if ('error' in data) {
        set({ error: data.error });
      } else {
        set({ balances: data, error: null });
      }
    } catch (e: any) {
      set({ error: e.message });
    }
  },

  addNewLeave: async (formData) => {
    try {
      return await applyLeave(formData);
    } catch (e: any) {
      return { status: 'error', message: e.message };
    }
  },

  cancel: async (id) => {
    try {
      const res = await cancelLeaveRequest(id);
      if (res.status === 'success') {
        return { success: true };
      }
      return { success: false, error: res.message };
    } catch (e: any) {
      return { success: false, error: e.message };
    }
  },

  markCancelled: (id) =>
    set((state) => ({
      leaves: state.leaves.map((l) =>
        l.leave_id === id ? { ...l, manager_status: 'Cancelled' } : l,
      ),
    })),

  clear: () => set({ leaves: [], balances: null, loading: false, error: null }),
}));
