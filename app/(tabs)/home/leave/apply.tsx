import React, { useEffect } from "react";
import {
  View,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Pressable,
} from "react-native";
import { Text, Button, TextInput, useTheme, Divider } from "react-native-paper";
import { useDesign } from "../../../../contexts/designContext";
import { useOverlay } from "../../../../contexts/overlayContext";
import Header from "../../../../components/header";
import { useLeave } from "../../../../hooks/useLeave";
import DocumentModal from "../../../../components/documentModal";
import DatePicker from "../../../../components/datePicker";
import { useUpload } from "../../../../hooks/useUpload";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { leaveRequiresClinic, leaveRequiresDocument } from "../../../../helpers/leave";

export default function ApplyLeave() {
  const theme = useTheme();
  const tokens = useDesign();
  const { toast, showModal, hideModal, modalVisible } = useOverlay();
  
  const {
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
    isFormValid,
    handleSubmit,
  } = useLeave();

  const {
    attachedDocument,
    setAttachedDocument,
    documentRefNo,
    setDocumentRefNo,
    pick,
    error,
    setError,
  } = useUpload();

  useEffect(() => {
    if (error) {
      toast({ message: error, variant: "error" });
      setError(null);
    }
  }, [error]);

  const handleAttachDocument = async () => {
    const doc = await pick();
    if (doc) {
      showRefModal(doc);
    }
  };

  const showRefModal = (doc: { name: string; type: string }) => {
    showModal({
      content: (
        <DocumentModal
          attachedFile={doc}
          refNo={documentRefNo}
          onRefNoChange={setDocumentRefNo}
          onPick={async () => {
            const nextDoc = await pick();
            if (nextDoc) showRefModal(nextDoc);
          }}
          onConfirm={() => hideModal()}
          onCancel={() => {
            setAttachedDocument(null);
            hideModal();
          }}
        />
      ),
    });
  };

  useEffect(() => {
    if (modalVisible && attachedDocument) {
      showRefModal(attachedDocument);
    }
  }, [documentRefNo]);

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={{
            paddingHorizontal: tokens.spacing.lg,
            paddingBottom: tokens.spacing["3xl"],
            gap: tokens.spacing.md,
          }}
          showsVerticalScrollIndicator={false}
        >
          <Header
            title="Leave Application"
            subtitle="Submit your time off request"
            showBack
          />

          <View style={{ gap: tokens.spacing.md }}>
            <View style={{ gap: tokens.spacing.md }}>
              <Pressable onPress={selectLeaveType}>
                <View pointerEvents="none">
                  <TextInput
                    mode="outlined"
                    label="Leave Type"
                    value={leaveType?.label || ""}
                    placeholder="Select leave type"
                    editable={false}
                    outlineStyle={{ borderRadius: tokens.radii.lg }}
                  />
                </View>
              </Pressable>

              <Pressable onPress={selectLeavePeriod}>
                <View pointerEvents="none">
                  <TextInput
                    mode="outlined"
                    label="Leave Period"
                    value={leavePeriod?.label || ""}
                    placeholder="Select period (Full/Half Day)"
                    editable={false}
                    outlineStyle={{ borderRadius: tokens.radii.lg }}
                  />
                </View>
              </Pressable>

              <Pressable onPress={selectReason}>
                <View pointerEvents="none">
                  <TextInput
                    mode="outlined"
                    label="Reason"
                    value={selectedReason?.label || ""}
                    placeholder="Select a reason"
                    editable={false}
                    outlineStyle={{ borderRadius: tokens.radii.lg }}
                  />
                </View>
              </Pressable>

              {leavePeriod && (
                <Pressable onPress={() => setIsDatePickerVisible(true)}>
                  <View pointerEvents="none">
                    <TextInput
                      mode="outlined"
                      label="Leave Dates"
                      value={
                        dateRange.start
                          ? leavePeriod.id === "full" && dateRange.end
                            ? `${dateRange.start.toLocaleDateString()} - ${dateRange.end.toLocaleDateString()}`
                            : dateRange.start.toLocaleDateString()
                          : "Select dates"
                      }
                      editable={false}
                      left={<TextInput.Icon icon="calendar" />}
                      outlineStyle={{ borderRadius: tokens.radii.lg }}
                    />
                  </View>
                </Pressable>
              )}

              {leaveRequiresClinic(leaveType) && (
                <Pressable onPress={selectClinic}>
                  <View pointerEvents="none">
                    <TextInput
                      mode="outlined"
                      label="Clinic"
                      value={selectedClinic?.clinic_name || ""}
                      placeholder="Search and select clinic"
                      editable={false}
                      left={<TextInput.Icon icon="hospital-building" />}
                      outlineStyle={{ borderRadius: tokens.radii.lg }}
                    />
                  </View>
                </Pressable>
              )}

              <TextInput
                mode="outlined"
                label="Remarks (Optional)"
                placeholder="Any additional notes..."
                value={remarks}
                onChangeText={setRemarks}
                multiline
                numberOfLines={3}
                outlineStyle={{ borderRadius: tokens.radii.lg }}
              />
            </View>

            <View style={{ gap: tokens.spacing.md }}>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Text variant="titleMedium" style={{ fontWeight: "700" }}>
                  Attachment
                  {leaveRequiresDocument(leaveType) && (
                    <Text style={{ color: theme.colors.error }}> *</Text>
                  )}
                </Text>
                {attachedDocument && (
                  <Button
                    mode="text"
                    onPress={() => setAttachedDocument(null)}
                    textColor={theme.colors.error}
                    compact
                  >
                    Remove
                  </Button>
                )}
              </View>

              {!attachedDocument ? (
                <Pressable onPress={handleAttachDocument}>
                  <View
                    style={{
                      borderWidth: 1,
                      borderColor: theme.colors.outline + "40",
                      borderStyle: "dashed",
                      borderRadius: tokens.radii.lg,
                      padding: tokens.spacing.xl,
                      alignItems: "center",
                      gap: 8,
                      backgroundColor: theme.colors.surfaceVariant + "20",
                    }}
                  >
                    <MaterialCommunityIcons
                      name="cloud-upload-outline"
                      size={32}
                      color={theme.colors.primary}
                    />
                    <Text
                      variant="bodyMedium"
                      style={{
                        color: theme.colors.onSurfaceVariant,
                        fontWeight: "600",
                      }}
                    >
                      Upload MC or Supporting Doc
                    </Text>
                    <Text
                      variant="bodySmall"
                      style={{
                        color: theme.colors.onSurfaceVariant,
                        opacity: 0.6,
                      }}
                    >
                      JPG, PNG or PDF (Max 1MB)
                    </Text>
                  </View>
                </Pressable>
              ) : (
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 12,
                    padding: 16,
                    borderRadius: tokens.radii.lg,
                    backgroundColor: theme.colors.primaryContainer + "40",
                    borderWidth: 1,
                    borderColor: theme.colors.primary + "20",
                  }}
                >
                  <View
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 10,
                      backgroundColor: theme.colors.primary,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <MaterialCommunityIcons
                      name={
                        attachedDocument.type.includes("pdf")
                          ? "file-pdf-box"
                          : "image"
                      }
                      size={24}
                      color={theme.colors.onPrimary}
                    />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text
                      variant="bodyMedium"
                      numberOfLines={1}
                      style={{ fontWeight: "700" }}
                    >
                      {attachedDocument.name}
                    </Text>
                    <Text variant="bodySmall" style={{ opacity: 0.6 }}>
                      {attachedDocument.type.split("/")[1].toUpperCase()} •
                      Ready to upload
                    </Text>
                  </View>
                  <MaterialCommunityIcons
                    name="check-circle"
                    size={20}
                    color={theme.colors.primary}
                  />
                </View>
              )}
            </View>

            <Divider />

            <Button
              mode="contained"
              onPress={() => handleSubmit(attachedDocument, documentRefNo)}
              style={{
                borderRadius: tokens.radii.pill,
                paddingVertical: 6,
                backgroundColor: isFormValid
                  ? theme.colors.primary
                  : theme.colors.surfaceVariant,
              }}
              textColor={
                isFormValid
                  ? theme.colors.onPrimary
                  : theme.colors.onSurfaceVariant
              }
              contentStyle={{ height: 48 }}
            >
              Submit Application
            </Button>

            <Text
              variant="bodySmall"
              style={{ textAlign: "center", opacity: 0.6, fontStyle: "italic" }}
            >
              Your application will be sent to your manager for approval.
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <DatePicker
        visible={isDatePickerVisible}
        onDismiss={() => setIsDatePickerVisible(false)}
        variant={leavePeriod?.id === "full" ? "range" : "single"}
        title={leavePeriod?.id === "full" ? "Select Date Range" : "Select Date"}
        rangeValue={dateRange}
        onRangeChange={(range) => setDateRange(range)}
        value={dateRange.start}
        onChange={(date) => setDateRange({ start: date, end: date })}
      />
    </View>
  );
}
