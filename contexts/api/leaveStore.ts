import { create } from 'zustand';
import { 
  getLeaveRecords, 
  applyLeave, 
  withdrawLeaveRequest, 
  type Leave, 
  type LeaveResponse 
} from './leave';

type LeaveStore = {
  leaves: Leave[];
  loading: boolean;
  error: string | null;
  fetchLeaves: () => Promise<void>;
  addNewLeave: (formData: FormData) => Promise<LeaveResponse>;
  withdraw: (id: number) => Promise<{ success: boolean; error?: string }>;
  clear: () => void;
};

export const useLeaveStore = create<LeaveStore>((set, get) => ({
  leaves: [],
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

  addNewLeave: async (formData) => {
    try {
      const res = await applyLeave(formData);
      if (res.status === 'success') {
        await get().fetchLeaves();
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
        return { success: true };
      }
      return { success: false, error: res.message };
    } catch (e: any) {
      return { success: false, error: e.message };
    }
  },

  clear: () => set({ leaves: [], loading: false, error: null }),
}));
