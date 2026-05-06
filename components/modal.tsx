import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, TouchableWithoutFeedback, ScrollView, Animated } from 'react-native';
import { Surface, useTheme, Portal } from 'react-native-paper';
import { useDesign } from '../contexts/designContext';

type Props = {
  visible: boolean;
  content: React.ReactNode;
  onDismiss: () => void;
  dismissable?: boolean;
};

export function OverlayModal({ visible, content, onDismiss, dismissable = true }: Props) {
  const theme = useTheme();
  const tokens = useDesign();
  
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.spring(animatedValue, {
        toValue: 1,
        useNativeDriver: true,
        tension: 50,
        friction: 8,
      }).start();
    }
  }, [visible]);

  const hide = () => {
    Animated.timing(animatedValue, {
      toValue: 0,
      duration: 150,
      useNativeDriver: true,
    }).start(() => {
      onDismiss();
    });
  };

  if (!visible) return null;

  const backdropOpacity = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  const translateY = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [100, 0],
  });

  return (
    <Portal>
      <View style={styles.fullscreen}>
        <TouchableWithoutFeedback onPress={dismissable ? hide : undefined}>
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
                  maxWidth: 500,
                  maxHeight: '85%',
                  transform: [{ translateY }],
                  opacity: animatedValue,
                  backgroundColor: 'transparent',
                }}
              >
                <Surface
                  style={[
                    styles.surface,
                    { 
                      backgroundColor: theme.colors.surface,
                      borderRadius: tokens.radii["2xl"],
                    }
                  ]}
                  elevation={5}
                >
                  <View style={[styles.contentWrapper, { borderRadius: tokens.radii["2xl"] }]}>
                    <ScrollView 
                      showsVerticalScrollIndicator={false}
                      contentContainerStyle={{ padding: tokens.spacing.xl }}
                    >
                      {content}
                    </ScrollView>
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
    padding: 26,
  },
  surface: {
    width: '100%',
  },
  contentWrapper: {
    width: '100%',
    overflow: 'hidden',
  },
});
