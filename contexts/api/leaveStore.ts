import { create } from 'zustand';
import { 
  getLeaveRecords, 
  applyLeave, 
  withdrawLeaveRequest, 
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
  withdraw: (id: number) => Promise<{ success: boolean; error?: string }>;
  clear: () => void;
};

export const useLeaveStore = create<LeaveStore>((set, get) => ({
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
      const res = await applyLeave(formData);
      if (res.status === 'success') {
        await Promise.all([get().fetchLeaves(), get().fetchBalances()]);
      }
      return res;
    } catch (e: any) {
      return { status: 'error', message: e.message };
    }
  },

  withdraw: async (id) => {
    try {
      const res = await withdrawLeaveRequest(id);
      if (res.status === 'success') {
        set((state) => ({
          leaves: state.leaves.map((l) =>
            l.leave_id === id ? { ...l, manager_status: 'Withdraw' } : l,
          ),
        }));
        await get().fetchBalances(); // Refresh balances on withdraw
        return { success: true };
      }
      return { success: false, error: res.message };
    } catch (e: any) {
      return { success: false, error: e.message };
    }
  },

  clear: () => set({ leaves: [], balances: null, loading: false, error: null }),
}));
