import {
  MD3DarkTheme,
  MD3LightTheme,
  configureFonts,
  type MD3Theme,
} from "react-native-paper";

const make = (
  family: string,
  weight: "400" | "700",
  fontSize: number,
  lineHeight: number,
  letterSpacing = 0,
) => ({
  fontFamily: family,
  fontWeight: weight,
  fontSize,
  lineHeight,
  letterSpacing,
});

const fontConfig = {
  displayLarge: make("SourceSansPro_700Bold", "700", 52, 58),
  displayMedium: make("SourceSansPro_700Bold", "700", 40, 46),
  displaySmall: make("SourceSansPro_700Bold", "700", 32, 40),

  headlineLarge: make("SourceSansPro_700Bold", "700", 28, 36),
  headlineMedium: make("SourceSansPro_700Bold", "700", 24, 32),
  headlineSmall: make("SourceSansPro_700Bold", "700", 20, 28),

  titleLarge: make("SourceSansPro_700Bold", "700", 20, 26),
  titleMedium: make("SourceSansPro_700Bold", "700", 15, 22, 0.1),
  titleSmall: make("SourceSansPro_700Bold", "700", 13, 18, 0.1),

  labelLarge: make("SourceSansPro_700Bold", "700", 13, 18, 0.1),
  labelMedium: make("SourceSansPro_400Regular", "400", 11, 14, 0.5),
  labelSmall: make("SourceSansPro_400Regular", "400", 10, 14, 0.5),

  bodyLarge: make("SourceSansPro_400Regular", "400", 15, 22),
  bodyMedium: make("SourceSansPro_400Regular", "400", 13, 18),
  bodySmall: make("SourceSansPro_400Regular", "400", 11, 14),
};

const fonts = configureFonts({ config: fontConfig });

export const lightTheme: MD3Theme = {
  ...MD3LightTheme,
  roundness: 12,
  fonts,
  colors: {
    ...MD3LightTheme.colors,
    primary: "#7C3AEC",
    onPrimary: "#FFFFFF",
    primaryContainer: "#D9C8FF",
    onPrimaryContainer: "#2A0A68",

    secondary: "#E1466F",
    onSecondary: "#FFFFFF",
    secondaryContainer: "#FFC9D4",
    onSecondaryContainer: "#5A1022",

    tertiary: "#5FA38C",
    onTertiary: "#FFFFFF",
    tertiaryContainer: "#CBE7DD",
    onTertiaryContainer: "#173D31",

    error: "#D14343",
    onError: "#FFFFFF",
    errorContainer: "#F3BDBD",
    onErrorContainer: "#5C1A1A",

    surface: "#FFFFFF",
    onSurface: "#1A1A1A",
    surfaceVariant: "#ECE7F8",
    onSurfaceVariant: "#333333",

    background: "#F7F5FC",
    onBackground: "#121212",
    outline: "#B8B2CC",
    shadow: "#A0A3B0",
    scrim: "#000000",
    surfaceDisabled: "rgba(26,27,30,0.12)",
    onSurfaceDisabled: "rgba(26,27,30,0.38)",
    backdrop: "rgba(26,27,30,0.4)",

    elevation: { ...MD3LightTheme.colors.elevation },
  },
};

export const darkTheme: MD3Theme = {
  ...MD3DarkTheme,
  roundness: 12,
  fonts,
  colors: {
    ...MD3DarkTheme.colors,
    primary: "#C4A8FF",
    onPrimary: "#2F136F",
    primaryContainer: "#7C3AEC",
    onPrimaryContainer: "#FFFFFF",

    secondary: "#FF8AA3",
    onSecondary: "#5A1022",
    secondaryContainer: "#E1466F",
    onSecondaryContainer: "#FFFFFF",

    tertiary: "#9FD4C3",
    onTertiary: "#16362C",
    tertiaryContainer: "#5FA38C",
    onTertiaryContainer: "#FFFFFF",

    error: "#B35C5C",
    onError: "#1F0D0D",
    errorContainer: "#8C3B3B",
    onErrorContainer: "#FFFFFF",

    surface: "#18141F",
    onSurface: "#F5F3FA",
    surfaceVariant: "#302A3C",
    onSurfaceVariant: "#D9D3E8",

    background: "#120F18",
    onBackground: "#F5F3FA",
    outline: "#655E78",
    shadow: "#000000",
    scrim: "#000000",
    surfaceDisabled: "rgba(227,227,232,0.12)",
    onSurfaceDisabled: "rgba(227,227,232,0.38)",
    backdrop: "rgba(0,0,0,0.4)",

    elevation: { ...MD3DarkTheme.colors.elevation },
  },
};
