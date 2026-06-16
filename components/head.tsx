import React from "react";
import { View, Pressable } from "react-native";
import { Text, useTheme } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useDesign } from "../contexts/designContext";

type HeadProps = {
  greeting: string;
  username: string;
  designation: string;
  avatarText: string;
  onNotificationPress?: () => void;
  onAvatarPress?: () => void;
};

export default function Head({
  greeting,
  username,
  designation,
  avatarText,
  onNotificationPress,
  onAvatarPress,
}: HeadProps) {
  const { colors } = useTheme();
  const tokens = useDesign();

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        gap: tokens.spacing.lg,
      }}
    >
      <View
        style={{
          flex: 1,
          gap: 2,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: tokens.spacing.xxs,
          }}
        >
          <Text
            variant="bodyMedium"
            style={{
              color: colors.onSurfaceVariant,
            }}
          >
            {greeting},
          </Text>

          <Text
            variant="titleSmall"
            style={{
              fontWeight: "700",
              flexShrink: 1,
            }}
            numberOfLines={1}
          >
            {username}
          </Text>
        </View>

        <Text
          variant="bodySmall"
          style={{
            color: colors.onSurfaceVariant,
          }}
          numberOfLines={1}
        >
          {designation}
        </Text>
      </View>

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: tokens.spacing.sm,
        }}
      >
        <Pressable
          onPress={onNotificationPress}
          style={({ pressed }) => ({
            width: 40,
            height: 40,
            borderRadius: tokens.radii.full,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: colors.surfaceVariant,
            opacity: pressed ? 0.9 : 1,
          })}
        >
          <MaterialCommunityIcons
            name="bell-outline"
            size={20}
            color={colors.onSurface}
          />
        </Pressable>

        <Pressable
          onPress={onAvatarPress}
          disabled={!onAvatarPress}
          style={({ pressed }) => ({
            width: 40,
            height: 40,
            borderRadius: tokens.radii.full,
            backgroundColor: colors.primaryContainer,
            alignItems: "center",
            justifyContent: "center",
            opacity: pressed ? 0.9 : 1,
          })}
        >
          <Text
            variant="labelLarge"
            style={{
              fontWeight: "700",
              color: colors.onPrimaryContainer,
            }}
          >
            {avatarText}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}