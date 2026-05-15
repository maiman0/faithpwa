import React from "react";
import { View, Pressable } from "react-native";
import { useTheme, Text } from "react-native-paper";
import { useRouter } from "expo-router";
import { useDesign } from "../contexts/designContext";
import { MaterialCommunityIcons } from "@expo/vector-icons";

type HeaderProps = {
  title: string;
  subtitle?: string;
  rightSlot?: React.ReactNode;
  showBack?: boolean;
};

export default function Header({
  title,
  subtitle,
  rightSlot,
  showBack = true,
}: HeaderProps) {
  const { colors } = useTheme();
  const tokens = useDesign();
  const router = useRouter();

  return (
    <View
      style={{
        backgroundColor: colors.background,
        flexDirection: "row",
        alignItems: "center",
        gap: tokens.spacing.md,
      }}
    >
      <View style={{ width: 40 }}>
        {showBack && (
          <Pressable
            onPress={() => router.back()}
            style={({ pressed }) => ({
              width: 36,
              height: 36,
              borderRadius: tokens.radii.full,
              backgroundColor: colors.primary,
              alignItems: "center",
              justifyContent: "center",
              transform: [{ scale: pressed ? 0.95 : 1 }],
            })}
          >
            <MaterialCommunityIcons
              name="arrow-left"
              size={18}
              color={colors.onPrimary}
            />
          </Pressable>
        )}
      </View>

      <View style={{ flex: 1 }}>
        <Text variant="titleMedium">{title}</Text>
        {subtitle && (
          <Text variant="bodySmall" style={{ color: colors.onSurfaceVariant }}>
            {subtitle}
          </Text>
        )}
      </View>

      <View style={{ minWidth: 40, alignItems: "flex-end" }}>{rightSlot}</View>
    </View>
  );
}
