import React, { useState, useRef } from "react";
import {
  View,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  Image,
  TextInput as RNTextInput,
} from "react-native";
import { Text, TextInput, Button, useTheme } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useDesign } from "../contexts/designContext";
import { useAuth } from "../contexts/authContext";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const passwordRef = useRef<RNTextInput>(null);
  const theme = useTheme();
  const tokens = useDesign();
  const { signIn } = useAuth();

  const handleLogin = async () => {
    if (!username || !password || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await signIn(username.trim(), password);
    } finally {
      setIsSubmitting(false);
    }
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
          top: 100,
          left: -80,
          opacity: 0.1,
          transform: [{ rotate: "-15deg" }],
        }}
      >
        <MaterialCommunityIcons
          name="domain"
          size={320}
          color={theme.colors.primary}
        />
      </View>

      <View
        style={{
          position: "absolute",
          bottom: 100,
          right: -80,
          opacity: 0.08,
          transform: [{ rotate: "15deg" }],
        }}
      >
        <MaterialCommunityIcons
          name="account-group"
          size={280}
          color={theme.colors.secondary}
        />
      </View>

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
            alignItems: "center",
          }}
        >
          <View
            style={{
              width: "100%",
              maxWidth: 420,
              borderRadius: tokens.radii.xl,
              backgroundColor: theme.colors.surface,
              paddingVertical: tokens.spacing.md,
              paddingHorizontal: tokens.spacing.lg,
              gap: tokens.spacing.sm,
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
                gap: tokens.spacing.xl,
              }}
            >
              <Image
                source={require("../assets/img/logo.png")}
                style={{
                  width: 140,
                  height: 140,
                  resizeMode: "contain",
                }}
              />

              <View
                style={{
                  alignItems: "center",
                  gap: tokens.spacing.xs,
                }}
              >
                <Text
                  variant="headlineMedium"
                  style={{
                    fontWeight: "800",
                    textAlign: "center",
                    letterSpacing: -0.5,
                  }}
                >
                  Sign In
                </Text>

                <Text
                  variant="bodyMedium"
                  style={{
                    textAlign: "center",
                    color: theme.colors.onSurfaceVariant,
                    lineHeight: 22,
                  }}
                >
                  Authenticate to access your FAITH workspace
                </Text>
              </View>
            </View>

            <View
              style={{
                gap: tokens.spacing.sm,
              }}
            >
              <TextInput
                label="Username"
                mode="outlined"
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
                autoCorrect={false}
                returnKeyType="next"
                onSubmitEditing={() => passwordRef.current?.focus()}
                outlineStyle={{
                  borderRadius: tokens.radii.lg,
                  borderColor: theme.colors.outline,
                }}
                style={{
                  backgroundColor: theme.colors.surface,
                }}
                left={
                  <TextInput.Icon
                    icon="account-outline"
                    color={theme.colors.primary}
                  />
                }
              />

              <TextInput
                ref={passwordRef}
                label="Password"
                mode="outlined"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                returnKeyType="done"
                onSubmitEditing={handleLogin}
                outlineStyle={{
                  borderRadius: tokens.radii.lg,
                  borderColor: theme.colors.outline,
                }}
                style={{
                  backgroundColor: theme.colors.surface,
                }}
                left={
                  <TextInput.Icon
                    icon="lock-outline"
                    color={theme.colors.primary}
                  />
                }
                right={
                  <TextInput.Icon
                    icon={showPassword ? "eye-off" : "eye"}
                    onPress={() => setShowPassword(!showPassword)}
                    color={theme.colors.onSurfaceVariant}
                  />
                }
              />
            </View>

            <View
              style={{ marginTop: tokens.spacing.md, gap: tokens.spacing.xl }}
            >
              <Button
                mode="contained"
                onPress={handleLogin}
                disabled={!username || !password || isSubmitting}
                contentStyle={{
                  height: 56,
                }}
                style={{
                  borderRadius: tokens.radii.lg,
                  elevation: 2,
                }}
                labelStyle={{
                  fontWeight: "700",
                  fontSize: 16,
                }}
              >
                Authenticate to FAITH
              </Button>

              <View
                style={{
                  alignItems: "center",
                }}
              >
                <Text
                  variant="bodySmall"
                  style={{
                    color: theme.colors.onSurfaceVariant,
                    textAlign: "center",
                    lineHeight: 18,
                  }}
                >
                  Reach system admin if you need help signing in.
                </Text>
              </View>
            </View>

            <View
              style={{
                marginTop: tokens.spacing.xl,
                paddingTop: tokens.spacing.lg,
                borderTopWidth: 1,
                borderTopColor: theme.colors.surfaceVariant,
                alignItems: "center",
              }}
            >
              <Text
                variant="labelSmall"
                style={{ color: theme.colors.outline, textAlign: "center" }}
              >
                A unified HR workspace connecting employee services, operations,
                and workforce management — helping organizations build a
                productive, respectful, and collaborative workplace.
              </Text>
            </View>
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
