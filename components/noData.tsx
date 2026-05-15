import React from "react";
import { View } from "react-native";
import { Text, Button, useTheme } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useDesign } from "../contexts/designContext";

type NoDataProps = {
  title?: string;
  description?: string;
  icon?: keyof typeof MaterialCommunityIcons.glyphMap;
  buttonLabel?: string;
  onPress?: () => void;
};

export default function NoData({
  title = "No Data",
  description = "Nothing available right now.",
  icon = "database-off-outline",
  buttonLabel,
  onPress,
}: NoDataProps) {
  const { colors } = useTheme();
  const tokens = useDesign();

  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        padding: tokens.spacing.xl,
      }}
    >
      <View
        style={{
          width: 72,
          height: 72,
          borderRadius: tokens.radii.full,
          backgroundColor: colors.surfaceVariant,
          alignItems: "center",
          justifyContent: "center",
          marginBottom: tokens.spacing.lg,
        }}
      >
        <MaterialCommunityIcons
          name={icon}
          size={32}
          color={colors.onSurfaceVariant}
        />
      </View>

      <Text
        variant="titleMedium"
        style={{
          marginBottom: tokens.spacing.xs,
          textAlign: "center",
        }}
      >
        {title}
      </Text>

      <Text
        variant="bodyMedium"
        style={{
          color: colors.onSurfaceVariant,
          textAlign: "center",
          marginBottom: buttonLabel ? tokens.spacing.lg : 0,
        }}
      >
        {description}
      </Text>

      {buttonLabel && onPress && (
        <Button mode="contained" onPress={onPress}>
          {buttonLabel}
        </Button>
      )}
    </View>
  );
}