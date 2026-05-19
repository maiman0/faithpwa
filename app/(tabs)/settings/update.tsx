import React, { useEffect, useState } from "react";
import { View, ScrollView, KeyboardAvoidingView, Platform } from "react-native";
import { Button, Card, TextInput, useTheme } from "react-native-paper";
import Header from "../../../components/header";
import { useDesign } from "../../../contexts/designContext";
import { useTabs } from "../../../contexts/tabContext";

export default function Update() {
  const theme = useTheme();
  const tokens = useDesign();
  const { setHideTabBar } = useTabs();

  const INITIAL_VALUES = {
    nickname: "Daiman",
    email: "daiman@company.com",
    contact: "+60123456789",
    address1: "Jalan Bukit Bintang",
    address2: "Residensi Premium",
    address3: "Residensi Premium",
  };

  const [nickname, setNickname] = useState(INITIAL_VALUES.nickname);
  const [email, setEmail] = useState(INITIAL_VALUES.email);
  const [contact, setContact] = useState(INITIAL_VALUES.contact);
  const [address1, setAddress1] = useState(INITIAL_VALUES.address1);
  const [address2, setAddress2] = useState(INITIAL_VALUES.address2);
  const [address3, setAddress3] = useState(INITIAL_VALUES.address3);

  const hasChanges =
    nickname !== INITIAL_VALUES.nickname ||
    email !== INITIAL_VALUES.email ||
    contact !== INITIAL_VALUES.contact ||
    address1 !== INITIAL_VALUES.address1 ||
    address2 !== INITIAL_VALUES.address2 ||
    address3 !== INITIAL_VALUES.address3;

  useEffect(() => {
    setHideTabBar(true);
    return () => setHideTabBar(false);
  }, []);

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
              <View style={{ gap: tokens.spacing.lg }}>
                <View style={{ gap: tokens.spacing.md }}>
                  <TextInput
                    mode="outlined"
                    label="Nickname"
                    value={nickname}
                    onChangeText={setNickname}
                    outlineStyle={{
                      borderRadius: tokens.radii.lg,
                    }}
                  />

                  <TextInput
                    mode="outlined"
                    label="Email Address"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    outlineStyle={{
                      borderRadius: tokens.radii.lg,
                    }}
                  />

                  <TextInput
                    mode="outlined"
                    label="Contact Number"
                    value={contact}
                    onChangeText={setContact}
                    keyboardType="phone-pad"
                    outlineStyle={{
                      borderRadius: tokens.radii.lg,
                    }}
                  />
                  <View style={{ gap: tokens.spacing.md }}>
                    <TextInput
                      mode="outlined"
                      label="Address Line 1"
                      value={address1}
                      onChangeText={setAddress1}
                      outlineStyle={{
                        borderRadius: tokens.radii.lg,
                      }}
                    />

                    <TextInput
                      mode="outlined"
                      label="Address Line 2"
                      value={address2}
                      onChangeText={setAddress2}
                      outlineStyle={{
                        borderRadius: tokens.radii.lg,
                      }}
                    />

                    <TextInput
                      mode="outlined"
                      label="Address Line 3"
                      value={address3}
                      onChangeText={setAddress3}
                      outlineStyle={{
                        borderRadius: tokens.radii.lg,
                      }}
                    />
                  </View>
                </View>
              </View>

              <Button
                mode="contained"
                disabled={!hasChanges}
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
