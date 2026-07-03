import React from "react";
import { View, TouchableOpacity } from "react-native";
import { Text, useTheme, Avatar, Divider } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { IconName } from "../constants/icon";
import { useDesign } from "../contexts/designContext";

type TailProps = {
  avatarText?: string;
  username?: string;
  staffId?: string;
  designation?: string;
  onUpdateProfilePress?: () => void;
};

export default function Tail({
  avatarText = "??",
  username = "Guest User",
  staffId = "N/A",
  designation = "No Designation",
  email = "N/A",
  contactNo = "N/A",
  fullAddress = "N/A",
  fullName = "N/A",
  onUpdateProfilePress,
}: TailProps & { email?: string; contactNo?: string; fullAddress?: string; fullName?: string }) {
  const theme = useTheme();
  const tokens = useDesign();

  const details: { label: string; value: string; icon: IconName }[] = [
    {
      label: "Full Name",
      value: fullName,
      icon: "account-box-outline",
    },
    {
      label: "Email Address",
      value: email,
      icon: "email-outline",
    },
    { label: "Contact Number", value: contactNo, icon: "phone-outline" },
    {
      label: "Address",
      value: fullAddress,
      icon: "office-building-marker-outline",
    },
  ];

  return (
    <View
      style={{
        borderRadius: tokens.radii["2xl"],
        backgroundColor: theme.colors.elevation.level1,
        overflow: "hidden",
        borderWidth: 1,
        borderColor: theme.colors.outlineVariant,
      }}
    >
      {/* Abstract Decorative Background Icon */}
      <View
        style={{
          position: "absolute",
          top: -30,
          left: -30,
          opacity: 0.03,
          transform: [{ rotate: "-15deg" }],
        }}
      >
        <MaterialCommunityIcons
          name="hexagon-multiple-outline"
          size={240}
          color={theme.colors.primary}
        />
      </View>

      <View
        style={{
          padding: tokens.spacing.lg,
          alignItems: "center",
          gap: tokens.spacing.md,
        }}
      >
        {/* Profile Header Section */}
        <View style={{ alignItems: "center", gap: tokens.spacing.md }}>
          <View
            style={{
              padding: 6,
              borderRadius: tokens.radii.full,
              borderWidth: 2,
              borderColor: theme.colors.primaryContainer,
              backgroundColor: theme.colors.surface,
            }}
          >
            <Avatar.Text
              size={100}
              label={avatarText}
              style={{
                backgroundColor: theme.colors.primaryContainer,
              }}
              labelStyle={{
                color: theme.colors.onPrimaryContainer,
                fontWeight: "900",
                fontSize: 36,
              }}
            />
          </View>

          <View style={{ alignItems: "center" }}>
            <Text
              variant="headlineSmall"
              style={{
                fontWeight: "900",
                color: theme.colors.onSurface,
                letterSpacing: -1,
              }}
            >
              {username}

              <Text
                style={{
                  color: theme.colors.primary,
                  opacity: 0.6,
                  fontSize: 16,
                  fontWeight: "700",
                }}
              >
                {" "}
                #{staffId}
              </Text>
            </Text>
          </View>
        </View>

        <Divider style={{ width: "100%", opacity: 0.5 }} />

        {/* Details Section */}
        <View style={{ width: "100%", gap: tokens.spacing.md }}>
          {details.map((item, idx) => (
            <View
              key={idx}
              style={{
                flexDirection: "row",
                gap: tokens.spacing.md,
                alignItems: "flex-start",
              }}
            >
              <View
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: tokens.radii.lg,
                  backgroundColor: theme.colors.surface,
                  alignItems: "center",
                  justifyContent: "center",
                  borderWidth: 1,
                  borderColor: theme.colors.outlineVariant,
                }}
              >
                <MaterialCommunityIcons
                  name={item.icon}
                  size={18}
                  color={theme.colors.primary}
                />
              </View>

              <View style={{ flex: 1, gap: 1 }}>
                <Text
                  variant="labelSmall"
                  style={{
                    color: theme.colors.onSurfaceVariant,
                    textTransform: "uppercase",
                    letterSpacing: 1,
                    fontSize: 10,
                    fontWeight: "700",
                  }}
                >
                  {item.label}
                </Text>
                <Text
                  variant="bodyMedium"
                  style={{
                    color: theme.colors.onSurface,
                    fontWeight: "600",
                    lineHeight: 20,
                  }}
                >
                  {item.value}
                </Text>
              </View>
            </View>
          ))}
        </View>

        {onUpdateProfilePress && (
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={onUpdateProfilePress}
            style={{
              width: "100%",
              height: 56,
              borderRadius: tokens.radii.xl,
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: theme.colors.primary,
              flexDirection: "row",
              gap: tokens.spacing.sm,
              marginTop: tokens.spacing.sm,
              shadowColor: theme.colors.primary,
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.2,
              shadowRadius: 8,
              elevation: 4,
            }}
          >
            <MaterialCommunityIcons
              name="account-cog"
              size={20}
              color={theme.colors.onPrimary}
            />

            <Text
              variant="labelLarge"
              style={{
                color: theme.colors.onPrimary,
                fontWeight: "800",
                letterSpacing: 1,
              }}
            >
              UPDATE WORKSPACE PROFILE
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}
