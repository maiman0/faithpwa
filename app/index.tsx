import React, { useState } from "react";
import {
  View,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { Text, TextInput, Button, useTheme } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useDesign } from "../contexts/designContext";
import { useAuth } from "../contexts/authContext";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const theme = useTheme();
  const tokens = useDesign();
  const { signIn, user, isLoading } = useAuth();

  React.useEffect(() => {
    if (!isLoading && user) {
      router.replace("/(tabs)/home");
    }
  }, [user, isLoading]);

  const handleLogin = async () => {
    await signIn(username.trim(), password);
  };

  const renderContent = () => (
    <View
      style={{
        flex: 1,
        backgroundColor: theme.colors.background,
        overflow: "hidden",
      }}
    >
      <View
        style={{
          position: "absolute",
          width: 320,
          height: 320,
          borderRadius: 999,
          backgroundColor: theme.colors.primary,
          top: 120,
          left: -140,
          opacity: 0.9,
        }}
      />

      <View
        style={{
          position: "absolute",
          width: 280,
          height: 280,
          borderRadius: 999,
          backgroundColor: theme.colors.secondary,
          bottom: 140,
          right: -120,
          opacity: 0.8,
        }}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{
          flex: 1,
        }}
      >
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            paddingHorizontal: tokens.spacing.xl,
            paddingVertical: tokens.spacing["3xl"],
            alignItems: "center",
          }}
        >
          <View
            style={{
              width: "100%",
              maxWidth: 420,
              borderRadius: tokens.radii.xl,
              backgroundColor: theme.colors.surface,
              padding: tokens.spacing["2xl"],
              gap: tokens.spacing["2xl"],
              ...(Platform.OS === "web" && {
                borderWidth: 1,
                borderColor: theme.colors.outlineVariant,
                shadowColor: theme.colors.shadow,
                shadowOffset: { width: 0, height: 20 },
                shadowOpacity: 0.08,
                shadowRadius: 40,
              }),
            }}
          >
            <View
              style={{
                alignItems: "center",
                gap: tokens.spacing.lg,
              }}
            >
              <View
                style={{
                  width: 76,
                  height: 76,
                  borderRadius: tokens.radii.full,
                  backgroundColor: theme.colors.primaryContainer,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <MaterialCommunityIcons
                  name="briefcase-variant-outline"
                  size={34}
                  color={theme.colors.primary}
                />
              </View>

              <View
                style={{
                  alignItems: "center",
                  gap: tokens.spacing.sm,
                }}
              >
                <Text
                  variant="headlineMedium"
                  style={{
                    fontWeight: "700",
                    textAlign: "center",
                  }}
                >
                  Welcome Back
                </Text>

                <Text
                  variant="bodyMedium"
                  style={{
                    textAlign: "center",
                    color: theme.colors.onSurfaceVariant,
                    lineHeight: 22,
                  }}
                >
                  Sign in to continue your HRMS workspace
                </Text>
              </View>
            </View>

            <View
              style={{
                gap: tokens.spacing.lg,
              }}
            >
              <TextInput
                label="Username"
                mode="flat"
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
                autoCorrect={false}
                returnKeyType="next"
                style={{
                  backgroundColor: theme.colors.surfaceVariant,
                  borderRadius: tokens.radii.xl,
                  overflow: "hidden",
                }}
                left={
                  <TextInput.Icon
                    icon={() => (
                      <MaterialCommunityIcons
                        name="account-outline"
                        size={22}
                        color={theme.colors.primary}
                      />
                    )}
                  />
                }
              />

              <TextInput
                label="Password"
                mode="flat"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                returnKeyType="done"
                onSubmitEditing={handleLogin}
                style={{
                  backgroundColor: theme.colors.surfaceVariant,
                  borderRadius: tokens.radii.xl,
                  overflow: "hidden",
                }}
                left={
                  <TextInput.Icon
                    icon={() => (
                      <MaterialCommunityIcons
                        name="lock-outline"
                        size={22}
                        color={theme.colors.primary}
                      />
                    )}
                  />
                }
              />
            </View>

            <Button
              mode="contained"
              onPress={handleLogin}
              disabled={!username || !password}
              contentStyle={{
                height: 56,
              }}
              style={{
                borderRadius: tokens.radii.full,
              }}
              labelStyle={{
                fontWeight: "700",
                fontSize: 16,
              }}
            >
              Login
            </Button>
          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );

  if (Platform.OS === "web") {
    return renderContent();
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      {renderContent()}
    </TouchableWithoutFeedback>
  );
}
