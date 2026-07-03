import { useEffect, useMemo, useState } from 'react';
import { View } from 'react-native';
import { Text, useTheme, Divider, Button } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useLeaveStore } from '../contexts/api/leaveStore';
import { useOverlay } from '../contexts/overlayContext';
import { useAuth } from '../contexts/authContext';
import { LeaveStatus, leaveStatusStyles, LEAVE_TYPES, LEAVE_PERIODS, LEAVE_REASONS } from '../constants/leave';
import { leaveRequiresClinic, leaveRequiresDocument, leaveRequirementNote, toApiDate, formatLeaveDurationLabel } from '../helpers/leave';
import { daysBetweenInclusive } from '../helpers/date';
import { type Leave } from '../contexts/api/leave';
import PickerModal from '../components/pickerModal';
import ClinicModal from '../components/clinicModal';
import LeavePolicy from '../components/leave/leavePolicy';
import { Clinic } from '../contexts/api/clinic';
import { UploadedDocument } from './useUpload';
import { getErrorMessage } from '../helpers/error';
import { useRouter } from 'expo-router';

export const useLeave = (statusFilter: LeaveStatus = 'All') => {
  const theme = useTheme();
  const router = useRouter();
  const { showSheet, hideSheet, toast, confirm, showModal, hideModal, showLoader, hideLoader } = useOverlay();
  const { user } = useAuth();
  const {
    leaves,
    balances,
    loading,
    error,
    fetchLeaves,
    fetchBalances,
    addNewLeave,
    cancel,
    markCancelled,
    clear
  } = useLeaveStore();
  
  // Form States
  const [leaveType, setLeaveType] = useState<(typeof LEAVE_TYPES)[0] | null>(null);
  const [leavePeriod, setLeavePeriod] = useState<(typeof LEAVE_PERIODS)[0] | null>(null);
  const [selectedReason, setSelectedReason] = useState<(typeof LEAVE_REASONS)[0] | null>(null);
  const [remarks, setRemarks] = useState("");
  const [selectedClinic, setSelectedClinic] = useState<Clinic | null>(null);
  const [dateRange, setDateRange] = useState<{
    start: Date | null;
    end: Date | null;
  }>({
    start: null,
    end: null,
  });
  const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);

  // Form Helpers
  const selectLeaveType = () => {
    showModal({
      content: (
        <PickerModal
          title="Select Leave Type"
          data={LEAVE_TYPES}
          selected={leaveType}
          onSelect={(item) => {
            setLeaveType(item);
            hideModal();
            const note = leaveRequirementNote(item);
            if (note) {
              toast({ message: note, variant: "info", icon: "information-outline" });
            }
          }}
          keyExtractor={(item) => item.id}
          labelExtractor={(item) => item.label}
          iconExtractor={(item) => item.icon}
        />
      ),
    });
  };

  const selectLeavePeriod = () => {
    showModal({
      content: (
        <PickerModal
          title="Select Period"
          data={LEAVE_PERIODS}
          selected={leavePeriod}
          onSelect={(item) => {
            setLeavePeriod(item);
            hideModal();
          }}
          keyExtractor={(item) => item.id}
          labelExtractor={(item) => item.label}
          iconExtractor={(item) => item.icon}
        />
      ),
    });
  };

  const selectReason = () => {
    showModal({
      content: (
        <PickerModal
          title="Select Reason"
          data={LEAVE_REASONS}
          selected={selectedReason}
          onSelect={(item) => {
            setSelectedReason(item);
            hideModal();
          }}
          keyExtractor={(item) => item.id}
          labelExtractor={(item) => item.label}
          iconExtractor={(item) => item.icon}
        />
      ),
    });
  };

  const selectClinic = () => {
    showModal({
      content: (
        <ClinicModal
          selected={selectedClinic}
          onSelect={(item) => {
            setSelectedClinic(item);
            hideModal();
          }}
        />
      ),
    });
  };

  const isFormValid = useMemo(() => {
    if (!leaveType || !leavePeriod || !selectedReason || !dateRange.start) return false;
    if (leaveRequiresClinic(leaveType) && !selectedClinic) return false;
    return true;
  }, [leaveType, leavePeriod, selectedReason, dateRange, selectedClinic]);

  // 0.5 for any half-day; inclusive day count for full-day.
  const leaveDuration = useMemo(() => {
    if (!leavePeriod || !dateRange.start) return 0;
    if (leavePeriod.id !== "full") return 0.5;
    return daysBetweenInclusive(dateRange.start, dateRange.end ?? dateRange.start);
  }, [leavePeriod, dateRange]);

  const leaveDurationLabel = useMemo(
    () => formatLeaveDurationLabel(leaveDuration),
    [leaveDuration],
  );

  // Reset clinic when switching to a non-medical leave type
  useEffect(() => {
    if (!leaveRequiresClinic(leaveType)) {
      setSelectedClinic(null);
    }
  }, [leaveType]);

  const handleSubmit = async (attachedDocument: UploadedDocument | null, documentRefNo: string) => {
    if (!leaveType) {
      toast("Please select a leave type.");
      return;
    }
    if (!leavePeriod) {
      toast("Please select a leave period.");
      return;
    }

    const isFullDay = leavePeriod.id === "full";
    if (!dateRange.start) {
      toast("Please select a date.");
      return;
    }

    if (leaveRequiresClinic(leaveType) && !selectedClinic) {
      toast("Please select a clinic.");
      return;
    }

    if (leaveRequiresDocument(leaveType) && !attachedDocument) {
      toast("Please attach a supporting document for this leave type.");
      return;
    }

    if (!selectedReason) {
      toast("Please select a reason for your leave.");
      return;
    }

    showLoader("Submitting application...");

    try {
      // Backend always needs both dates. For half-day, or a full-day with a
      // single date selected, end mirrors start.
      const start = dateRange.start;
      const end = isFullDay ? dateRange.end ?? start : start;

      const formData = new FormData();
      formData.append("leave_type", leaveType.id);
      formData.append("leave_period", leavePeriod.value);
      formData.append("duration", leaveDuration.toString());
      formData.append("reason", selectedReason.label);
      formData.append("remarks", remarks);
      formData.append("document_ref_no", documentRefNo);

      if (selectedClinic && leaveRequiresClinic(leaveType)) {
        formData.append("clinic_id", selectedClinic.clinic_id.toString());
      }

      formData.append("start_date", toApiDate(start));
      formData.append("end_date", toApiDate(end));

      if (attachedDocument) {
        // React Native's FormData polyfill accepts a {uri, name, type} object
        // for file uploads, which the DOM lib's Blob-only append() signature
        // doesn't model — @ts-ignore is the documented escape hatch for this.
        // @ts-ignore
        formData.append("document", {
          uri: attachedDocument.uri,
          name: attachedDocument.name,
          type: attachedDocument.type,
        });
      }

      const res = await addNewLeave(formData);
      if (res.status === "success") {
        hideLoader();
        router.back();
        toast({
          message: "Leave application submitted successfully!",
          variant: "success",
        });
        // Reload the store in the background once we've navigated away.
        void fetchLeaves();
        void fetchBalances();
      } else {
        hideLoader();
        toast({
          message: res.message || "Failed to submit application",
          variant: "error",
        });
      }
    } catch (err: unknown) {
      hideLoader();
      toast({
        message: getErrorMessage(err, "An unexpected error occurred"),
        variant: "error",
      });
    }
  };

  // Gated on `user` so a sign-out (which clears the store) doesn't
  // immediately re-trigger a doomed fetch with a session that no longer exists.
  useEffect(() => {
    if (!user) return;
    if (leaves.length === 0 && !loading && !error) {
      fetchLeaves();
    }
    if (!balances && !loading && !error) {
      fetchBalances();
    }
  }, [user, leaves.length, balances, loading, error, fetchLeaves, fetchBalances]);

  const handleCancel = (id: number) => {
    confirm({
      title: 'Cancel Application',
      message: 'Are you sure you want to cancel this leave application?',
      confirmText: 'Cancel Leave',
      cancelText: 'Keep',
      isDestructive: true,
      onConfirm: async () => {
        showLoader('Cancelling application...');
        try {
          const res = await cancel(id);
          if (res.success) {
            hideLoader();
            hideSheet();
            markCancelled(id);
            toast({
              message: 'Leave application cancelled successfully',
              variant: 'success',
            });
            // Reconcile with server state in the background after dismissing.
            void fetchLeaves();
            void fetchBalances();
          } else {
            hideLoader();
            toast({
              message: res.error || 'Failed to cancel application',
              variant: 'error',
            });
          }
        } catch (err: unknown) {
          hideLoader();
          toast({
            message: getErrorMessage(err, 'Failed to cancel application'),
            variant: 'error',
          });
        }
      },
    });
  };

  const showPolicy = () => {
    showSheet({
      content: <LeavePolicy onClose={hideSheet} />,
    });
  };

  const showDetails = (item: Leave) => {
    const statusKey = item.manager_status || 'Pending';
    const statusStyle = leaveStatusStyles[statusKey as keyof typeof leaveStatusStyles] || leaveStatusStyles.Pending;

    showSheet({
      content: (
        <View key={`leave-detail-${item.leave_id}`} style={{ gap: 20, paddingBottom: 20 }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 16 }}>
            <View style={{ 
              backgroundColor: statusStyle.color + "15", 
              padding: 12, 
              borderRadius: 16 
            }}>
              <MaterialCommunityIcons name={statusStyle.icon} size={32} color={statusStyle.color} />
            </View>
            <View style={{ flex: 1 }}>
              <Text variant="titleLarge" style={{ fontWeight: "800" }}>{item.leave_name}</Text>
              <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>{item.duration_name} • {item.manager_status}</Text>
            </View>
          </View>

          <Divider />

          <View style={{ gap: 8 }}>
            <Text variant="labelSmall" style={{ color: theme.colors.onSurfaceVariant, fontWeight: "700" }}>DURATION</Text>
            <Text variant="titleMedium" style={{ fontWeight: "700" }}>{item.leave_period}</Text>
          </View>

          {item.reason && (
            <View style={{ gap: 8 }}>
              <Text variant="labelSmall" style={{ color: theme.colors.onSurfaceVariant, fontWeight: "700" }}>REASON</Text>
              <View style={{ backgroundColor: theme.colors.surfaceVariant + "40", padding: 16, borderRadius: 12 }}>
                <Text variant="bodyMedium" style={{ lineHeight: 22 }}>{item.reason}</Text>
              </View>
            </View>
          )}

          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: 'flex-end' }}>
            <View style={{ gap: 4 }}>
              <Text variant="labelSmall" style={{ color: theme.colors.onSurfaceVariant, fontWeight: "700" }}>APPLIED ON</Text>
              <Text variant="bodyMedium">{item.date}</Text>
            </View>
          </View>

          {item.manager_status === 'Pending' && (
            <Button
              key="cancel-action"
              mode="contained-tonal"
              onPress={() => handleCancel(item.leave_id)}
              style={{ marginTop: 8, borderRadius: 12 }}
              buttonColor={theme.colors.errorContainer}
              textColor={theme.colors.onErrorContainer}
              contentStyle={{ height: 48 }}
            >
              CANCEL APPLICATION
            </Button>
          )}
        </View>
      ),
    });
  };

  const filteredLeaves = useMemo(() => {
    if (statusFilter === 'All') return leaves;
    return leaves.filter((l) => l.manager_status === statusFilter);
  }, [leaves, statusFilter]);

  const stats = useMemo(() => {
    return {
      pending: leaves.filter(l => l.manager_status === 'Pending').length,
      approved: leaves.filter(l => l.manager_status === 'Approved').length,
      rejected: leaves.filter(l => l.manager_status === 'Rejected').length,
      total: leaves.length,
      annualBalance: balances?.balance || 0,
      medicalBalance: 0,
    };
  }, [leaves, balances]);

  return {
    leaves: filteredLeaves,
    allLeaves: leaves,
    balances,
    loading,
    error,
    stats,
    refreshLeaves: fetchLeaves,
    refreshBalances: fetchBalances,
    apply: addNewLeave,
    cancelLeave: cancel,
    clearLeaves: clear,
    showDetails,
    showPolicy,
    hasLeaves: leaves.length > 0,
    
    // Form Exports
    leaveType,
    selectLeaveType,
    leavePeriod,
    selectLeavePeriod,
    selectedReason,
    selectReason,
    remarks,
    setRemarks,
    selectedClinic,
    selectClinic,
    dateRange,
    setDateRange,
    isDatePickerVisible,
    setIsDatePickerVisible,
    leaveDuration,
    leaveDurationLabel,
    isFormValid,
    handleSubmit,
  };
};
