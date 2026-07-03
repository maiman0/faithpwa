import { useEffect, useMemo, useCallback } from 'react';
import { useAttendanceStore } from '../contexts/api/attendanceStore';
import { attendanceStatuses, getStatusFromRecord } from '../constants/attendance';
import { toDateKey } from '../helpers/attendance';
import type { Attendance } from '../contexts/api/attendance';
import { useAuth } from '../contexts/authContext';

export const useAttendance = () => {
  const {
    records,
    statusMap,
    operationView,
    loading,
    error,
    fetchAttendance,
    setOperationView,
    clear,
  } = useAttendanceStore();
  const { user } = useAuth();

  // Initial fetch of attendance records and status descriptions. Gated on
  // `user` so a sign-out (which clears the store) doesn't immediately
  // re-trigger a doomed fetch with a session that no longer exists.
  useEffect(() => {
    if (user && records.length === 0 && !loading && !error) {
      fetchAttendance();
    }
  }, [user, records.length, loading, error, fetchAttendance]);

  // Statistics for dashboard or insights
  const stats = useMemo(() => {
    const presentCount = records.filter(r => r.login_status !== 'false' && r.status !== 'RD').length;
    const lateCount = records.filter(r => r.login_status === 'late').length;

    const todayKey = toDateKey(new Date());
    const todayRecord = records.find(r => toDateKey(r.schedule_date) === todayKey);

    return {
      totalRecords: records.length,
      presentCount,
      lateCount,
      todayRecord: todayRecord || null,
    };
  }, [records]);

  const noRecords = useMemo(() => error === "No attendance records found", [error]);

  // Status text is sourced from the API (attStatus.php), with the constant
  // label only as a last-resort fallback.
  const describeStatus = useCallback(
    (record?: Attendance | null): string => {
      if (!record) return "";
      return statusMap[record.status] || attendanceStatuses[getStatusFromRecord(record)].label;
    },
    [statusMap],
  );

  return {
    records,
    statusMap,
    operationView,
    loading,
    error: noRecords ? null : error, // Hide the error if it's just 'no records'
    noRecords,
    stats,
    describeStatus,
    setOperationView,
    refreshAttendance: fetchAttendance,
    clearAttendanceData: clear,
  };
};
