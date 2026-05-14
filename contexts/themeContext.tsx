import React, { createContext, useContext, useMemo, useState } from "react";
import { PaperProvider } from "react-native-paper";
import { lightTheme, darkTheme } from "../constants/theme";

type Ctx = {
  isDark: boolean;
  toggle: () => void;
};

const ThemeCtx = createContext<Ctx>({
  isDark: false,
  toggle: () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [isDark, setIsDark] = useState(false);

  const value = useMemo<Ctx>(
    () => ({
      isDark,
      toggle: () => setIsDark((v) => !v),
    }),
    [isDark],
  );

  const theme = isDark ? darkTheme : lightTheme;

  return (
    <ThemeCtx.Provider value={value}>
      <PaperProvider theme={theme}>{children}</PaperProvider>
    </ThemeCtx.Provider>
  );
}

export const useAppTheme = () => useContext(ThemeCtx);
