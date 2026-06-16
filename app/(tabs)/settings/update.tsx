import React, { useEffect, useState, useMemo } from "react";
import { View, ScrollView, KeyboardAvoidingView, Platform } from "react-native";
import { Button, Card, TextInput, HelperText, useTheme, ActivityIndicator } from "react-native-paper";
import Header from "../../../components/header";
import { useDesign } from "../../../contexts/designContext";
import { useTabs } from "../../../contexts/tabContext";
import { useStaff } from "../../../hooks/useStaff";
import {
  type ProfileForm,
  validateProfileForm,
  isProfileFormValid,
  sanitizeContactNo,
} from "../../../helpers/staff";

export default function Update() {
  const theme = useTheme();
  const tokens = useDesign();
  const { setHideTabBar } = useTabs();
  const { staff, updateStaff, loading } = useStaff();

  const [form, setForm] = useState<ProfileForm>({
    nick_name: "",
    email: "",
    contact_no: "",
    address1: "",
    address2: "",
    address3: "",
  });
  const [touched, setTouched] = useState<Partial<Record<keyof ProfileForm, boolean>>>({});

  useEffect(() => {
    if (staff) {
      setForm({
        nick_name: staff.nick_name || "",
        email: staff.email || "",
        contact_no: staff.contact_no || "",
        address1: staff.address1 || "",
        address2: staff.address2 || "",
        address3: staff.address3 || ""
      });
    }
  }, [staff]);

  const errors = useMemo(() => validateProfileForm(form), [form]);

  const updateField = (field: keyof ProfileForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const hasChanges = useMemo(() => {
    if (!staff) return false;
    return (
      form.nick_name !== (staff.nick_name || "") ||
      form.email !== (staff.email || "") ||
      form.contact_no !== (staff.contact_no || "") ||
      form.address1 !== (staff.address1 || "") ||
      form.address2 !== (staff.address2 || "") ||
      form.address3 !== (staff.address3 || "")
    );
  }, [form, staff]);

  const canSave = hasChanges && isProfileFormValid(form);

  useEffect(() => {
    setHideTabBar(true);
    return () => setHideTabBar(false);
  }, []);

  const handleSave = () => {
    if (!canSave) return;
    updateStaff({
      nick_name: form.nick_name.trim(),
      email: form.email.trim(),
      contact_no: form.contact_no.trim(),
      address1: form.address1.trim(),
      address2: form.address2.trim(),
      address3: form.address3.trim(),
    });
  };

  if (loading && !staff) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: theme.colors.background,
      }}
    >
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
            title="Update Profile"
            subtitle="Manage your personal information"
            showBack
          />

          <Card
            mode="contained"
            style={{
              borderRadius: tokens.radii.xl,
              backgroundColor: theme.colors.surface,
            }}
          >
            <View
              style={{
                padding: tokens.spacing.lg,
                gap: tokens.spacing.md,
              }}
            >
              <View style={{ gap: tokens.spacing.md }}>
                <View>
                  <TextInput
                    mode="outlined"
                    label="Nickname"
                    value={form.nick_name}
                    onChangeText={(val) => updateField("nick_name", val)}
                    error={!!(touched.nick_name && errors.nick_name)}
                    outlineStyle={{ borderRadius: tokens.radii.lg }}
                  />
                  {touched.nick_name && errors.nick_name ? (
                    <HelperText type="error">{errors.nick_name}</HelperText>
                  ) : null}
                </View>

                <View>
                  <TextInput
                    mode="outlined"
                    label="Email Address"
                    value={form.email}
                    onChangeText={(val) => updateField("email", val)}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    error={!!(touched.email && errors.email)}
                    outlineStyle={{ borderRadius: tokens.radii.lg }}
                  />
                  {touched.email && errors.email ? (
                    <HelperText type="error">{errors.email}</HelperText>
                  ) : null}
                </View>

                <View>
                  <TextInput
                    mode="outlined"
                    label="Contact Number"
                    value={form.contact_no}
                    onChangeText={(val) => updateField("contact_no", sanitizeContactNo(val))}
                    keyboardType="phone-pad"
                    error={!!(touched.contact_no && errors.contact_no)}
                    outlineStyle={{ borderRadius: tokens.radii.lg }}
                  />
                  {touched.contact_no && errors.contact_no ? (
                    <HelperText type="error">{errors.contact_no}</HelperText>
                  ) : null}
                </View>

                <View>
                  <TextInput
                    mode="outlined"
                    label="Address Line 1"
                    value={form.address1}
                    onChangeText={(val) => updateField("address1", val)}
                    error={!!(touched.address1 && errors.address1)}
                    outlineStyle={{ borderRadius: tokens.radii.lg }}
                  />
                  {touched.address1 && errors.address1 ? (
                    <HelperText type="error">{errors.address1}</HelperText>
                  ) : null}
                </View>

                <TextInput
                  mode="outlined"
                  label="Address Line 2 (Optional)"
                  value={form.address2}
                  onChangeText={(val) => updateField("address2", val)}
                  outlineStyle={{ borderRadius: tokens.radii.lg }}
                />

                <TextInput
                  mode="outlined"
                  label="Address Line 3 (Optional)"
                  value={form.address3}
                  onChangeText={(val) => updateField("address3", val)}
                  outlineStyle={{ borderRadius: tokens.radii.lg }}
                />
              </View>

              <Button
                mode="contained"
                disabled={!canSave}
                onPress={handleSave}
                style={{
                  borderRadius: tokens.radii.full,
                }}
                contentStyle={{
                  height: 52,
                }}
              >
                Save Changes
              </Button>
            </View>
          </Card>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
