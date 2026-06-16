import React from "react";
import { View } from "react-native";
import { Text, Button, useTheme } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useDesign } from "../../contexts/designContext";
import { LEAVE_POLICIES } from "../../constants/leave";

type Props = {
  onClose: () => void;
};

export default function LeavePolicy({ onClose }: Props) {
  const theme = useTheme();
  const { spacing, radii, typography } = useDesign();

  return (
    <View style={{ gap: spacing.lg, paddingBottom: spacing.sm }}>
      {/* Header */}
      <View style={{ alignItems: "center", gap: spacing.xs }}>
        <View
          style={{
            width: 64,
            height: 64,
            borderRadius: radii.full,
            backgroundColor: `${theme.colors.primary}15`,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <MaterialCommunityIcons
            name="shield-check-outline"
            size={32}
            color={theme.colors.primary}
          />
        </View>
        <Text
          variant="titleLarge"
          style={{ fontWeight: "800", color: theme.colors.onSurface }}
        >
          Leave Policy
        </Text>
        <Text
          variant="bodyMedium"
          style={{ color: theme.colors.onSurfaceVariant, textAlign: "center" }}
        >
          A few things to keep in mind before you apply.
        </Text>
      </View>

      {/* Policy items */}
      <View style={{ gap: spacing.sm }}>
        {LEAVE_POLICIES.map((policy, index) => (
          <View
            key={index}
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: spacing.md,
              backgroundColor: `${theme.colors.surfaceVariant}40`,
              padding: spacing.md,
              borderRadius: radii.lg,
            }}
          >
            <View
              style={{
                width: 40,
                height: 40,
                borderRadius: radii.md,
                backgroundColor: `${policy.color}18`,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <MaterialCommunityIcons
                name={policy.icon}
                size={20}
                color={policy.color}
              />
            </View>
            <View style={{ flex: 1, gap: 2 }}>
              <Text
                style={{
                  fontSize: typography.sizes.sm,
                  fontWeight: "700",
                  color: theme.colors.onSurface,
                }}
              >
                {policy.title}
              </Text>
              <Text
                style={{
                  fontSize: typography.sizes.xs,
                  lineHeight: 18,
                  color: theme.colors.onSurfaceVariant,
                }}
              >
                {policy.description}
              </Text>
            </View>
          </View>
        ))}
      </View>

      <Button
        mode="contained"
        onPress={onClose}
        style={{ borderRadius: radii.md }}
        contentStyle={{ height: 48 }}
      >
        Got it
      </Button>
    </View>
  );
}
