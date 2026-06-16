import { create } from "zustand";
import { getStaffDetails, updateStaffDetails, type StaffResponse } from "./staff";

type StaffStore = {
  staff: StaffResponse | null;
  loading: boolean;
  error: string | null;
  fetchStaff: () => Promise<void>;
  updateStaff: (data: Partial<StaffResponse>) => Promise<{ success: boolean; error?: string }>;
  setStaff: (data: StaffResponse) => void;
  clear: () => void;
};

export const useStaffStore = create<StaffStore>((set, get) => ({
  staff: null,
  loading: false,
  error: null,

  fetchStaff: async () => {
    set({ loading: true, error: null });
    try {
      const data = await getStaffDetails();
      set({ staff: data, error: null });
    } catch (e: any) {
      set({
        staff: null,
        error: e?.message || "Failed to fetch staff details.",
      });
    } finally {
      set({ loading: false });
    }
  },

  updateStaff: async (data) => {
    try {
      const current = get().staff;
      // Send a COMPLETE record so the backend keeps all required identifiers
      // (staff_id, staff_no, ...) and never blanks the fields the form doesn't
      // manage. Server-derived aggregates are dropped so they get recomputed
      // from the edited values rather than persisted stale.
      const payload: Partial<StaffResponse> = { ...(current ?? {}), ...data };
      delete payload.full_name;
      delete payload.full_address;
      delete payload.initials;
      delete payload.by_name;
      delete payload.error;

      await updateStaffDetails(payload);
      const updated = await getStaffDetails();
      set({ staff: updated });
      return { success: true };
    } catch (e: any) {
      return { success: false, error: e?.message || "Failed to update staff." };
    }
  },

  setStaff: (data) => set({ staff: data }),

  clear: () =>
    set({
      staff: null,
      loading: false,
      error: null,
    }),
}));
