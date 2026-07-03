import React from "react";
import { View } from "react-native";
import { Text, useTheme } from "react-native-paper";
import { useDesign } from "../contexts/designContext";
import { useAppTheme } from "../contexts/themeContext";
import ToggleSwitch from "./toggleSwitch";

// Rendered inside a bottom sheet (contexts/overlayContext.tsx captures
// `content` as a static element at showSheet() call time), so this reads
// theme state itself via useAppTheme() rather than receiving it as a prop —
// otherwise the sheet keeps showing whatever isDark was when it was opened.
export default function PreferencesSheet() {
  const theme = useTheme();
  const tokens = useDesign();
  const { isDark, toggle } = useAppTheme();

  return (
    <View style={{ gap: tokens.spacing.lg }}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingVertical: tokens.spacing.sm,
        }}
      >
        <View style={{ flex: 1, gap: 2 }}>
          <Text variant="titleMedium">Dark Mode</Text>
          <Text
            variant="bodySmall"
            style={{ color: theme.colors.onSurfaceVariant }}
          >
            Adjust the appearance of the application
          </Text>
        </View>
        <ToggleSwitch value={isDark} onValueChange={toggle} />
      </View>
    </View>
  );
}
