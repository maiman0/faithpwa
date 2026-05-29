import React, { useEffect, useState } from "react";
import {
  View,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Pressable,
} from "react-native";
import {
  Text,
  Button,
  TextInput,
  useTheme,
  Divider,
} from "react-native-paper";
import { useDesign } from "../../../../contexts/designContext";
import { useTabs } from "../../../../contexts/tabContext";
import { useOverlay } from "../../../../contexts/overlayContext";
import Header from "../../../../components/header";
import { useLeave } from "../../../../hooks/useLeave";
import { useRouter } from "expo-router";
import PickerModal from "../../../../components/pickerModal";
import DocumentModal from "../../../../components/documentModal";
import { useUpload } from "../../../../hooks/useUpload";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const LEAVE_TYPES = [
  { id: "AL", label: "Annual Leave", icon: "calendar-star" },
  { id: "MC", label: "Medical Leave", icon: "medical-bag" },
  { id: "UL", label: "Unpaid Leave", icon: "cash-remove" },
  { id: "EL", label: "Emergency Leave", icon: "alert-octagon" },
];

const LEAVE_PERIODS = [
  { id: "full", label: "Full Day", icon: "clock-outline" },
  { id: "morning", label: "First Half", icon: "weather-sunny" },
  { id: "afternoon", label: "Second Half", icon: "weather-night" },
];

export default function ApplyLeave() {
  const theme = useTheme();
  const tokens = useDesign();
  const router = useRouter();
  const { setHideTabBar } = useTabs();
  const { toast, showLoader, hideLoader, showModal, hideModal, showSheet, hideSheet } = useOverlay();
  const { apply } = useLeave();
  const { attachedDocument, pickFromCamera, pickFromGallery, pickFromFiles, setAttachedDocument, error, setError } = useUpload();

  const [reason, setReason] = useState("");
  const [leaveType, setLeaveType] = useState(LEAVE_TYPES[0]);
  const [leavePeriod, setLeavePeriod] = useState(LEAVE_PERIODS[0]);

  useEffect(() => {
    setHideTabBar(true);
    return () => setHideTabBar(false);
  }, []);

  useEffect(() => {
    if (error) {
      toast({ message: error, variant: "error" });
      setError(null);
    }
  }, [error]);

  const handleSelectLeaveType = () => {
    showModal({
      content: (
        <PickerModal
          title="Select Leave Type"
          data={LEAVE_TYPES}
          selected={leaveType}
          onSelect={(item) => {
            setLeaveType(item);
            hideModal();
          }}
          keyExtractor={(item) => item.id}
          labelExtractor={(item) => item.label}
          iconExtractor={(item) => item.icon as any}
        />
      ),
    });
  };

  const handleSelectLeavePeriod = () => {
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
          iconExtractor={(item) => item.icon as any}
        />
      ),
    });
  };

  const handleAttachDocument = () => {
    showSheet({
      content: (
        <DocumentModal
          onPickCamera={async () => {
            hideSheet();
            await pickFromCamera();
          }}
          onPickGallery={async () => {
            hideSheet();
            await pickFromGallery();
          }}
          onPickFile={async () => {
            hideSheet();
            await pickFromFiles();
          }}
        />
      ),
    });
  };

  const handleSubmit = async () => {
    if (!reason.trim()) {
      toast("Please provide a reason for your leave.");
      return;
    }

    showLoader("Submitting application...");
    // Mocking a short delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    hideLoader();
    toast({
      message: "Leave application submitted successfully!",
      variant: "success",
    });
    router.back();
  };

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
            title="New Application"
            subtitle="Request time off"
            showBack
          />

          <View style={{ gap: tokens.spacing.lg }}>
            <View style={{ gap: tokens.spacing.md }}>
              <Text variant="titleMedium" style={{ fontWeight: "700" }}>Leave Details</Text>
              
              <Pressable onPress={handleSelectLeaveType}>
                <View pointerEvents="none">
                  <TextInput
                    mode="outlined"
                    label="Leave Type"
                    value={leaveType.label}
                    editable={false}
                    right={<TextInput.Icon icon="chevron-down" />}
                    outlineStyle={{ borderRadius: tokens.radii.lg }}
                  />
                </View>
              </Pressable>

              <Pressable onPress={handleSelectLeavePeriod}>
                <View pointerEvents="none">
                  <TextInput
                    mode="outlined"
                    label="Leave Period"
                    value={leavePeriod.label}
                    editable={false}
                    right={<TextInput.Icon icon="chevron-down" />}
                    outlineStyle={{ borderRadius: tokens.radii.lg }}
                  />
                </View>
              </Pressable>

              <TextInput
                mode="outlined"
                label="Reason"
                placeholder="e.g. Family matters"
                value={reason}
                onChangeText={setReason}
                multiline
                numberOfLines={4}
                outlineStyle={{ borderRadius: tokens.radii.lg }}
              />
            </View>

            <View style={{ gap: tokens.spacing.md }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text variant="titleMedium" style={{ fontWeight: "700" }}>Attachment</Text>
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
                  <View style={{
                    borderWidth: 1,
                    borderColor: theme.colors.outline + '40',
                    borderStyle: 'dashed',
                    borderRadius: tokens.radii.lg,
                    padding: tokens.spacing.xl,
                    alignItems: 'center',
                    gap: 8,
                    backgroundColor: theme.colors.surfaceVariant + '20'
                  }}>
                    <MaterialCommunityIcons name="cloud-upload-outline" size={32} color={theme.colors.primary} />
                    <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant, fontWeight: '600' }}>
                      Upload MC or Supporting Doc
                    </Text>
                    <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant, opacity: 0.6 }}>
                      JPG, PNG or PDF (Max 1MB)
                    </Text>
                  </View>
                </Pressable>
              ) : (
                <View style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 12,
                  padding: 16,
                  borderRadius: tokens.radii.lg,
                  backgroundColor: theme.colors.primaryContainer + '40',
                  borderWidth: 1,
                  borderColor: theme.colors.primary + '20'
                }}>
                  <View style={{
                    width: 44,
                    height: 44,
                    borderRadius: 10,
                    backgroundColor: theme.colors.primary,
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <MaterialCommunityIcons 
                      name={attachedDocument.type.includes('pdf') ? 'file-pdf-box' : 'image'} 
                      size={24} 
                      color={theme.colors.onPrimary} 
                    />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text variant="bodyMedium" numberOfLines={1} style={{ fontWeight: '700' }}>
                      {attachedDocument.name}
                    </Text>
                    <Text variant="bodySmall" style={{ opacity: 0.6 }}>
                      {attachedDocument.type.split('/')[1].toUpperCase()} • Ready to upload
                    </Text>
                  </View>
                  <MaterialCommunityIcons name="check-circle" size={20} color={theme.colors.primary} />
                </View>
              )}
            </View>

            <Divider />

            <Button
              mode="contained"
              onPress={handleSubmit}
              style={{
                borderRadius: tokens.radii.pill,
                paddingVertical: 6,
              }}
              contentStyle={{ height: 48 }}
            >
              Submit Application
            </Button>
            
            <Text variant="bodySmall" style={{ textAlign: 'center', opacity: 0.6, fontStyle: 'italic' }}>
              Your application will be sent to your manager for approval.
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
