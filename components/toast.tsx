import React, { useEffect, useRef } from "react";
import { Animated, View, TouchableOpacity, StyleSheet } from "react-native";
import { Surface, Text, useTheme, Icon, Portal } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useDesign } from "../contexts/designContext";

export type ToastVariant = "default" | "success" | "error" | "warning" | "info";

type Props = {
  visible: boolean;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
  onDismiss: () => void;
  duration?: number;
  variant?: ToastVariant;
  icon?: string;
};

export function OverlayToast({
  visible,
  message,
  actionLabel,
  onAction,
  onDismiss,
  duration = 3000,
  variant = "default",
  icon,
}: Props) {
  const theme = useTheme();
  const tokens = useDesign();
  const insets = useSafeAreaInsets();

  const translateY = useRef(new Animated.Value(-100)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  const variantConfig = {
    default: {
      bg: theme.colors.inverseSurface,
      text: theme.colors.inverseOnSurface,
      icon: icon ?? "information",
      action: theme.colors.inversePrimary,
    },
    success: {
      bg: theme.colors.tertiary,
      text: theme.colors.onTertiary,
      icon: icon ?? "check-circle",
      action: theme.colors.onTertiary,
    },
    error: {
      bg: theme.colors.error,
      text: theme.colors.onError,
      icon: icon ?? "alert-circle",
      action: theme.colors.onError,
    },
    warning: {
      bg: theme.colors.secondary,
      text: theme.colors.onSecondary,
      icon: icon ?? "alert",
      action: theme.colors.onSecondary,
    },
    info: {
      bg: theme.colors.primary,
      text: theme.colors.onPrimary,
      icon: icon ?? "information",
      action: theme.colors.onPrimary,
    },
  }[variant];

  useEffect(() => {
    if (!visible) return;

    Animated.parallel([
      Animated.spring(translateY, {
        toValue: 0,
        useNativeDriver: true,
        tension: 40,
        friction: 7,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();

    const timer = setTimeout(hide, duration);
    return () => clearTimeout(timer);
  }, [visible]);

  const hide = () => {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: -100,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onDismiss();
    });
  };

  if (!visible) return null;

  return (
    <Portal>
      <View
        pointerEvents="box-none"
        style={[
          styles.container,
          { 
            paddingHorizontal: tokens.spacing.md,
            paddingTop: insets.top + tokens.spacing.md 
          }
        ]}
      >
        <Animated.View
          renderToHardwareTextureAndroid={true}
          style={{
            opacity,
            transform: [{ translateY }],
            width: '100%',
            maxWidth: 600,
            alignSelf: 'center',
            backgroundColor: 'transparent',
          }}
        >
          <Surface
            style={[
              styles.content,
              {
                borderRadius: tokens.radii.sm,
                backgroundColor: variantConfig.bg,
              }
            ]}
          >
            <View style={styles.messageContainer}>
              <Icon
                source={variantConfig.icon}
                size={22}
                color={variantConfig.text}
              />
              <Text
                variant="bodyMedium"
                style={{
                  color: variantConfig.text,
                  marginLeft: tokens.spacing.sm,
                  flex: 1,
                }}
              >
                {message}
              </Text>
            </View>

            {actionLabel && (
              <TouchableOpacity
                onPress={() => {
                  onAction?.();
                  hide();
                }}
                style={styles.actionButton}
              >
                <Text
                  variant="labelLarge"
                  style={{
                    color: variantConfig.action,
                    fontWeight: 'bold',
                  }}
                >
                  {actionLabel.toUpperCase()}
                </Text>
              </TouchableOpacity>
            )}
          </Surface>
        </Animated.View>
      </View>
    </Portal>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    zIndex: 9999,
    alignItems: 'center',
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 6,
    paddingHorizontal: 16,
    minHeight: 48,
  },
  messageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    paddingVertical: 8,
  },
  actionButton: {
    marginLeft: 8,
    paddingHorizontal: 8,
    paddingVertical: 10,
  },
});
