import React, { useEffect, useRef, useState } from "react";
import {
  View,
  StyleSheet,
  TouchableWithoutFeedback,
  ScrollView,
  Animated,
  Dimensions,
  PanResponder,
  Platform,
} from "react-native";
import { useTheme, Portal, Text } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useDesign } from "../../contexts/designContext";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");
const SWIPE_THRESHOLD = 80;

type Props = {
  visible: boolean;
  title?: string;
  content: React.ReactNode;
  onDismiss: () => void;
};

export function OverlaySheet({ visible, title, content, onDismiss }: Props) {
  const theme = useTheme();
  const tokens = useDesign();
  const insets = useSafeAreaInsets();

  const [contentHeight, setContentHeight] = useState(0);
  const pan = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const backdropOpacity = useRef(new Animated.Value(0)).current;

  const maxSheetHeight = SCREEN_HEIGHT - insets.top - tokens.spacing.md;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return (
          Math.abs(gestureState.dy) > 5 &&
          Math.abs(gestureState.dy) > Math.abs(gestureState.dx)
        );
      },
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dy < 0) {
          pan.setValue(gestureState.dy * 0.1);
        } else {
          pan.setValue(gestureState.dy);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy > SWIPE_THRESHOLD || gestureState.vy > 0.5) {
          hide();
        } else {
          Animated.spring(pan, {
            toValue: 0,
            useNativeDriver: true,
            tension: 50,
            friction: 8,
          }).start();
        }
      },
    }),
  ).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(pan, {
          toValue: 0,
          useNativeDriver: true,
          tension: 40,
          friction: 8,
        }),
        Animated.timing(backdropOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  const hide = () => {
    Animated.parallel([
      Animated.timing(pan, {
        toValue: SCREEN_HEIGHT,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(backdropOpacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onDismiss();
      pan.setValue(SCREEN_HEIGHT);
    });
  };

  if (!visible) return null;

  return (
    <Portal>
      <View style={styles.fullscreen}>
        <TouchableWithoutFeedback onPress={hide}>
          <Animated.View
            style={[styles.backdrop, { opacity: backdropOpacity }]}
          />
        </TouchableWithoutFeedback>

        <Animated.View
          {...panResponder.panHandlers}
          renderToHardwareTextureAndroid={true}
          style={[
            styles.sheetContainer,
            {
              transform: [{ translateY: pan }],
              backgroundColor: theme.colors.surface,
              borderTopLeftRadius: tokens.radii["2xl"],
              borderTopRightRadius: tokens.radii["2xl"],
              // Robust Skirt for Android:
              // Physically make the view 1000px taller at the bottom
              paddingBottom: 1000,
              marginBottom: -1000,
            },
          ]}
        >
          {/* Inner Content Wrapper for Measurement */}
          <View
            onLayout={(e) => {
              const h = e.nativeEvent.layout.height;
              if (h > 0) setContentHeight(h);
            }}
            style={{ maxHeight: maxSheetHeight }}
          >
            {/* Header & Grabber */}
            <View style={styles.headerContainer}>
              <View
                style={[
                  styles.grabber,
                  { backgroundColor: theme.colors.outlineVariant },
                ]}
              />
              {title && (
                <Text
                  variant="titleLarge"
                  style={[styles.title, { color: theme.colors.onSurface }]}
                >
                  {title}
                </Text>
              )}
            </View>

            <ScrollView
              showsVerticalScrollIndicator={false}
              bounces={false}
              overScrollMode="never"
              contentContainerStyle={{
                paddingHorizontal: tokens.spacing.xl,
                paddingBottom: insets.bottom + tokens.spacing.xl,
              }}
            >
              <TouchableWithoutFeedback>
                <View>{content}</View>
              </TouchableWithoutFeedback>
            </ScrollView>
          </View>
        </Animated.View>
      </View>
    </Portal>
  );
}

const styles = StyleSheet.create({
  fullscreen: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1000,
    justifyContent: "flex-end",
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.6)",
  },
  sheetContainer: {
    width: "100%",
    overflow: "visible", // Ensure the bottom padding isn't clipped
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -10 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
      },
      android: {
        elevation: 24,
      },
    }),
  },
  headerContainer: {
    width: "100%",
    alignItems: "center",
    paddingTop: 12,
    paddingBottom: 8,
  },
  grabber: {
    width: 36,
    height: 5,
    borderRadius: 2.5,
    marginBottom: 16,
  },
  title: {
    fontWeight: "bold",
    marginBottom: 8,
  },
});
