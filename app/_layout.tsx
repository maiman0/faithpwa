import { Stack, useRouter, useSegments } from "expo-router";
import { DesignProvider } from "../contexts/designContext";
import { ThemeProvider } from "../contexts/themeContext";
import { OverlayProvider, OverlayOutlet } from "../contexts/overlayContext";
import { AuthProvider, useAuth } from "../contexts/authContext";
import { TokenProvider } from "../contexts/tokenContext";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import {
  useFonts,
  SourceSansPro_400Regular,
  SourceSansPro_600SemiBold,
  SourceSansPro_700Bold,
} from "@expo-google-fonts/source-sans-pro";
import { useEffect, useState } from "react";
import { View, Text, Platform, useWindowDimensions } from "react-native";
import { useTheme, Portal } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import {
  SafeAreaProvider,
  SafeAreaView,
} from "react-native-safe-area-context";
import { useOverlay } from "../contexts/overlayContext";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded, error] = useFonts({
    SourceSansPro_400Regular,
    SourceSansPro_600SemiBold,
    SourceSansPro_700Bold,
  });

  if (error) {
    console.error("Font loading error:", error);
  }

  return (
    <SafeAreaProvider>
      <DesignProvider>
        <ThemeProvider>
          <OverlayProvider>
            <TokenProvider>
              <AuthProvider>
                <AppContent fontsLoaded={fontsLoaded} />
              </AuthProvider>
            </TokenProvider>
          </OverlayProvider>
        </ThemeProvider>
      </DesignProvider>
    </SafeAreaProvider>
  );
}

function AppContent({ fontsLoaded }: { fontsLoaded: boolean }) {
  const theme = useTheme();
  const { isOverlayActive } = useOverlay();
  const { user, isLoading: isAuthLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isMobileWidth = width <= 500;
  const [isStandalonePwa, setIsStandalonePwa] = useState(false);

  // Detect installed/standalone PWA so the desktop device frame collapses there —
  // an installed app already fills the screen natively and doesn't need a mockup.
  useEffect(() => {
    if (Platform.OS !== "web") return;
    const query = window.matchMedia("(display-mode: standalone)");
    setIsStandalonePwa(query.matches);
    const handleChange = (e: MediaQueryListEvent) => setIsStandalonePwa(e.matches);
    query.addEventListener("change", handleChange);
    return () => query.removeEventListener("change", handleChange);
  }, []);

  const showDeviceFrame = Platform.OS === "web" && !isMobileWidth && !isStandalonePwa;

  // 1. Unified Navigation Guard
  useEffect(() => {
    if (isAuthLoading || !fontsLoaded) return;

    // /main is an unlisted Overlay-system demo page, exempt from the
    // logged-in/out redirect so it's reachable by URL regardless of auth state.
    if (segments[0] === "main") return;

    const inAuthGroup = segments[0] === "(tabs)";

    if (!user && inAuthGroup) {
      // Redirect to login if trying to access private routes while logged out
      router.replace("/");
    } else if (user && !inAuthGroup) {
      // Redirect to home if trying to access login while already authenticated
      router.replace("/(tabs)/home");
    }
  }, [user, isAuthLoading, segments, fontsLoaded]);

  // 2. Hide Splash Screen only when EVERYTHING is ready
  useEffect(() => {
    if (fontsLoaded && !isAuthLoading) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, isAuthLoading]);

  // 3. Web & PWA specific logic
  useEffect(() => {
    if (Platform.OS === "web") {
      // Disable native overscroll refresh/rubber-banding
      document.body.style.overscrollBehavior = "none";
      document.documentElement.style.overscrollBehavior = "none";

      // Register Service Worker for PWA
      if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
          navigator.serviceWorker.register('/sw.js').then(registration => {
            console.log('SW registered: ', registration);
          }).catch(registrationError => {
            console.log('SW registration failed: ', registrationError);
          });
        });
      }

      const color = isOverlayActive
        ? "#9c9ea0"
        : !isMobileWidth
          ? theme.colors.surfaceVariant
          : theme.colors.background;

      document.body.style.backgroundColor = color;

      let meta = document.querySelector('meta[name="theme-color"]');
      if (!meta) {
        meta = document.createElement("meta");
        meta.setAttribute("name", "theme-color");
        // Only theme the bar in the installed (standalone) app. In a browser
        // this would tint the URL/search bar with the app background, which we
        // don't want — leave the browser's own chrome untouched.
        meta.setAttribute("media", "(display-mode: standalone)");
        document.getElementsByTagName("head")[0].appendChild(meta);
      }
      const metaColor = isOverlayActive ? "#9c9ea0" : theme.colors.background;
      meta.setAttribute("content", metaColor);
    }
  }, [theme.colors.background, theme.colors.surfaceVariant, isOverlayActive, isMobileWidth]);

  // Prevent rendering the stack until auth state is determined to avoid layout flashes
  if (!fontsLoaded || isAuthLoading) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: theme.colors.background,
        }}
      />
    );
  }

  const stack = (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: {
          backgroundColor: theme.colors.background,
        },
      }}
    />
  );

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: showDeviceFrame
          ? theme.colors.surfaceVariant
          : theme.colors.background,
        alignItems: "center",
        justifyContent: showDeviceFrame ? "center" : "flex-start",
        // @ts-ignore - overscrollBehavior is supported on web
        overscrollBehavior: "none",
      }}
    >
      <StatusBar style={theme.dark ? "light" : "dark"} />
      {showDeviceFrame ? (
        <View
          style={{
            width: 390,
            height: "90%",
            maxHeight: 844,
            backgroundColor: "#111318",
            borderRadius: 54,
            padding: 14,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 30 },
            shadowOpacity: 0.35,
            shadowRadius: 50,
          }}
        >
          <View
            style={{
              flex: 1,
              backgroundColor: theme.colors.background,
              borderRadius: 40,
              overflow: "hidden",
            }}
          >
            {/* Local Portal.Host so overlays (toast/modal/sheet/loader) render
                clipped to the device frame instead of escaping to the default
                outer Portal.Host, which spans the full browser viewport. */}
            <Portal.Host>
              {/* Fake status bar — reserves top safe-area space so app content never sits under the notch */}
              <View
                style={{
                  height: 44,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "flex-end",
                  paddingHorizontal: 28,
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 4,
                  }}
                >
                  <MaterialCommunityIcons
                    name="signal-cellular-3"
                    size={14}
                    color={theme.colors.onSurface}
                  />
                  <MaterialCommunityIcons
                    name="wifi"
                    size={14}
                    color={theme.colors.onSurface}
                  />
                  <MaterialCommunityIcons
                    name="battery"
                    size={16}
                    color={theme.colors.onSurface}
                  />
                </View>

                {/* Notch — cuts into the top edge, overlapping the status bar row only */}
                <View
                  style={{
                    position: "absolute",
                    top: 0,
                    left: "50%",
                    transform: [{ translateX: -60 }],
                    width: 120,
                    height: 26,
                    backgroundColor: "#111318",
                    borderBottomLeftRadius: 16,
                    borderBottomRightRadius: 16,
                  }}
                />
              </View>

              <SafeAreaView style={{ flex: 1 }}>{stack}</SafeAreaView>

              {/* Fake home indicator — reserves bottom safe-area space */}
              <View
                style={{
                  height: 30,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <View
                  style={{
                    width: 120,
                    height: 5,
                    borderRadius: 3,
                    backgroundColor: theme.colors.onSurfaceVariant,
                    opacity: 0.5,
                  }}
                />
              </View>

              <OverlayOutlet />
            </Portal.Host>
          </View>
        </View>
      ) : (
        <SafeAreaView
          style={{
            flex: 1,
            width: "100%",
            maxWidth: 500,
            backgroundColor: theme.colors.background,
            overflow: "hidden",
            ...(Platform.OS === "web" && {
              shadowColor: theme.colors.shadow,
              shadowOffset: { width: 0, height: 0 },
              shadowOpacity: 0.1,
              shadowRadius: 20,
              borderLeftWidth: 1,
              borderRightWidth: 1,
              borderColor: theme.colors.outlineVariant,
            }),
          }}
        >
          {stack}
          <OverlayOutlet />
        </SafeAreaView>
      )}
    </View>
  );
}
