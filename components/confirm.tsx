import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, TouchableWithoutFeedback, Animated } from 'react-native';
import { Surface, Text, Button, useTheme, Portal, Icon } from 'react-native-paper';
import { useDesign } from '../contexts/designContext';

type Props = {
  visible: boolean;
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  isDestructive?: boolean;
};

export function OverlayConfirm({ 
  visible, 
  title, 
  message, 
  confirmText = 'Confirm', 
  cancelText = 'Cancel', 
  onConfirm, 
  onCancel,
  isDestructive = false
}: Props) {
  const theme = useTheme();
  const tokens = useDesign();
  
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.spring(animatedValue, {
        toValue: 1,
        useNativeDriver: true,
        tension: 65,
        friction: 7,
      }).start();
    }
  }, [visible]);

  const hide = (callback: () => void) => {
    Animated.timing(animatedValue, {
      toValue: 0,
      duration: 150,
      useNativeDriver: true,
    }).start(() => {
      callback();
    });
  };

  if (!visible) return null;

  const backdropOpacity = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  const contentScale = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0.8, 1],
  });

  const contentTranslateY = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [50, 0],
  });

  return (
    <Portal>
      <View style={styles.fullscreen}>
        <TouchableWithoutFeedback onPress={() => hide(onCancel)}>
          <Animated.View 
            style={[
              styles.backdrop, 
              { opacity: backdropOpacity }
            ]}
          >
            <TouchableWithoutFeedback>
              <Animated.View
                renderToHardwareTextureAndroid={true}
                style={{
                  width: '100%',
                  maxWidth: 340,
                  transform: [
                    { scale: contentScale },
                    { translateY: contentTranslateY }
                  ],
                  opacity: animatedValue,
                  backgroundColor: 'transparent',
                }}
              >
                <Surface
                  style={[
                    styles.content,
                    { 
                      backgroundColor: theme.colors.surface,
                      borderRadius: tokens.radii["2xl"],
                      padding: tokens.spacing.xl,
                      gap: tokens.spacing.lg,
                    }
                  ]}
                  elevation={5}
                >
                  <View style={styles.header}>
                    <View style={[
                      styles.iconCircle, 
                      { backgroundColor: isDestructive ? theme.colors.errorContainer : theme.colors.secondaryContainer }
                    ]}>
                      <Icon 
                        source={isDestructive ? "alert-outline" : "help-circle-outline"} 
                        size={32} 
                        color={isDestructive ? theme.colors.error : theme.colors.secondary} 
                      />
                    </View>
                  </View>

                  <View style={styles.body}>
                    {title && (
                      <Text variant="headlineSmall" style={[styles.title, { color: theme.colors.onSurface }]}>
                        {title}
                      </Text>
                    )}
                    {message && (
                      <Text variant="bodyMedium" style={[styles.message, { color: theme.colors.onSurfaceVariant }]}>
                        {message}
                      </Text>
                    )}
                  </View>

                  <View style={styles.actions}>
                    <Button 
                      mode="contained" 
                      onPress={() => hide(onConfirm)} 
                      style={[styles.button, { borderRadius: tokens.radii.pill }]}
                      buttonColor={isDestructive ? theme.colors.error : theme.colors.primary}
                      textColor={isDestructive ? theme.colors.onError : theme.colors.onPrimary}
                      contentStyle={{ paddingVertical: 6 }}
                    >
                      {confirmText}
                    </Button>
                    <Button 
                      mode="text" 
                      onPress={() => hide(onCancel)} 
                      style={[styles.button, { borderRadius: tokens.radii.pill }]}
                      textColor={theme.colors.onSurfaceVariant}
                      contentStyle={{ paddingVertical: 6 }}
                    >
                      {cancelText}
                    </Button>
                  </View>
                </Surface>
              </Animated.View>
            </TouchableWithoutFeedback>
          </Animated.View>
        </TouchableWithoutFeedback>
      </View>
    </Portal>
  );
}

const styles = StyleSheet.create({
  fullscreen: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1000,
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  content: {
    width: '100%',
    alignItems: 'center',
  },
  header: {
    marginBottom: 4,
  },
  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  body: {
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontWeight: 'bold',
    textAlign: 'center',
  },
  message: {
    textAlign: 'center',
    lineHeight: 22,
  },
  actions: {
    width: '100%',
    gap: 4,
  },
  button: {
    width: '100%',
  },
});
