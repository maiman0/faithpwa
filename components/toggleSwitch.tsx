import React, { useEffect, useRef } from "react";
import { Pressable, Animated, Platform } from "react-native";
import { useTheme } from "react-native-paper";
import { useDesign } from "../contexts/designContext";

type ToggleSwitchProps = {
  value: boolean;
  onValueChange: (value: boolean) => void;
  disabled?: boolean;
};

const TRACK_WIDTH = 46;
const TRACK_HEIGHT = 26;
const THUMB_SIZE = 22;
const THUMB_INSET = 2;

export default function ToggleSwitch({
  value,
  onValueChange,
  disabled = false,
}: ToggleSwitchProps) {
  const theme = useTheme();
  const tokens = useDesign();
  const progress = useRef(new Animated.Value(value ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(progress, {
      toValue: value ? 1 : 0,
      duration: tokens.motion.duration.fast,
      useNativeDriver: false,
    }).start();
  }, [value]);

  const trackColor = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [theme.colors.surfaceVariant, theme.colors.primary],
  });

  const thumbTranslateX = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [THUMB_INSET, TRACK_WIDTH - THUMB_SIZE - THUMB_INSET],
  });

  return (
    <Pressable
      accessibilityRole="switch"
      accessibilityState={{ checked: value, disabled }}
      disabled={disabled}
      onPress={() => onValueChange(!value)}
      style={{ opacity: disabled ? tokens.opacity.disabled : 1 }}
      hitSlop={tokens.sizes.touch.hitSlop}
    >
      <Animated.View
        style={{
          width: TRACK_WIDTH,
          height: TRACK_HEIGHT,
          borderRadius: tokens.radii.full,
          backgroundColor: trackColor,
          justifyContent: "center",
        }}
      >
        <Animated.View
          style={{
            width: THUMB_SIZE,
            height: THUMB_SIZE,
            borderRadius: tokens.radii.full,
            backgroundColor: theme.colors.surface,
            transform: [{ translateX: thumbTranslateX }],
            ...Platform.select({
              ios: {
                shadowColor: "#000",
                shadowOpacity: 0.2,
                shadowRadius: 2,
                shadowOffset: { width: 0, height: 1 },
              },
              android: { elevation: 2 },
            }),
          }}
        />
      </Animated.View>
    </Pressable>
  );
}
