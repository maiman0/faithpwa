import { create } from 'zustand';
import {
  Attendance,
  AttendanceError,
  AttendanceStatus,
  getAttendanceDef,
  getAttendanceStatusDescription,
} from './attendance';

interface AttendanceState {
  records: Attendance[];
  // Status code -> human description, sourced from the API (attStatus.php).
  statusMap: Record<string, string>;
  // true = operation (own attendance, default); false = manager (team).
  operationView: boolean;
  loading: boolean;
  error: string | null;

  fetchAttendance: () => Promise<void>;
  setOperationView: (value: boolean) => Promise<void>;
  clear: () => void;
}

const loadStatusDescriptions = async (
  records: Attendance[],
): Promise<Record<string, string>> => {
  const codes = Array.from(
    new Set(records.map((r) => r.status).filter((c): c is string => !!c)),
  );

  const entries = await Promise.all(
    codes.map(async (code) => {
      const res = await getAttendanceStatusDescription(code);
      if (res && !('error' in res)) {
        return [code, (res as AttendanceStatus).Description] as const;
      }
      // Fall back to the raw code so the UI never renders blank.
      return [code, code] as const;
    }),
  );

  return Object.fromEntries(entries);
};

export const useAttendanceStore = create<AttendanceState>((set, get) => ({
  records: [],
  statusMap: {},
  operationView: true,
  loading: false,
  error: null,

  fetchAttendance: async () => {
    set({ loading: true, error: null });

    const recordRes = await getAttendanceDef(get().operationView);

    if (recordRes && 'error' in recordRes) {
      set({
        error: (recordRes as AttendanceError).error,
        records: [],
        statusMap: {},
        loading: false,
      });
      return;
    }

    const records = recordRes as Attendance[];
    const statusMap = await loadStatusDescriptions(records);

    set({ records, statusMap, loading: false });
  },

  setOperationView: async (value) => {
    if (get().operationView === value) return;
    set({ operationView: value, records: [], statusMap: {}, error: null });
    await get().fetchAttendance();
  },

  clear: () =>
    set({ records: [], statusMap: {}, operationView: true, loading: false, error: null }),
}));
