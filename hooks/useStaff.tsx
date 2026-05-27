import { useEffect } from 'react';
import { useStaffStore } from '../contexts/api/staffStore';

export const useStaff = () => {
  const { 
    staff, 
    loading, 
    error, 
    fetchStaff, 
    updateStaff, 
    clear 
  } = useStaffStore();

  // Automatically fetch staff if not already loaded
  useEffect(() => {
    if (!staff && !loading && !error) {
      fetchStaff();
    }
  }, [staff, loading, error, fetchStaff]);

  return {
    staff,
    loading,
    error,
    refreshStaff: fetchStaff,
    updateStaff,
    clearStaff: clear,
    // Helper to get a display name
    displayName: staff?.nick_name || staff?.by_name || staff?.first_name || 'Staff Member',
    // Welcome message helper
    welcomeMessage: `Welcome back, ${staff?.nick_name || staff?.by_name || staff?.first_name || 'Staff'}`,
    // Helper for avatar initials
    initials: staff?.initials || staff?.first_name?.substring(0, 1).toUpperCase() || 'S',
  };
};
