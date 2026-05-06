import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, TouchableWithoutFeedback, Animated } from 'react-native';
import { Surface, Text, Button, useTheme, Portal, Icon } from 'react-native-paper';
import { useDesign } from '../contexts/designContext';

type Props = {
  visible: boolean;
  title?: string;
  message?: string;
  buttonText?: string;
  onClose: () => void;
};

export function OverlayAlert({ visible, title, message, buttonText = 'Got it', onClose }: Props) {
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

  const hide = () => {
    Animated.timing(animatedValue, {
      toValue: 0,
      duration: 150,
      useNativeDriver: true,
    }).start(() => {
      onClose();
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
        <TouchableWithoutFeedback onPress={hide}>
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
                  maxWidth: 320,
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
                    <View style={[styles.iconCircle, { backgroundColor: theme.colors.primaryContainer }]}>
                      <Icon source="bell-outline" size={32} color={theme.colors.primary} />
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

                  <Button 
                    mode="contained" 
                    onPress={hide} 
                    style={{ borderRadius: tokens.radii.pill, width: '100%' }}
                    contentStyle={{ paddingVertical: 6 }}
                  >
                    {buttonText}
                  </Button>
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
});
