import { useEffect, useMemo, useState } from "react";
import { themeTokens } from "./theme";
import { ThemeContext } from "./themeContext";
import {
  createTheme,
  ThemeProvider as MuiThemeProvider,
} from "@mui/material/styles";

function getInitialThemeMode() {
  if (typeof window === "undefined") {
    return "light";
  }

  const savedTheme = window.localStorage.getItem("themeMode");

  if (savedTheme === "light" || savedTheme === "dark") {
    return savedTheme;
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

export function ThemeProvider({ children }) {
  const [themeMode, setThemeMode] = useState(getInitialThemeMode);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    window.localStorage.setItem("themeMode", themeMode);
    document.documentElement.dataset.theme = themeMode;
  }, [themeMode]);

  const value = useMemo(() => {
    const activeTheme = themeTokens[themeMode];
    const muiTheme = createTheme({
      direction: "rtl",
      typography: {
        fontFamily: activeTheme.fontFamily.arabic.join(", "),
      },
    });

    return {
      themeMode,
      activeTheme,
      muiTheme,
      isDarkMode: themeMode === "dark",
      isLightMode: themeMode === "light",
      setDarkMode: () => setThemeMode("dark"),
      setLightMode: () => setThemeMode("light"),
      toggleTheme: () =>
        setThemeMode((currentMode) =>
          currentMode === "dark" ? "light" : "dark",
        ),
    };
  }, [themeMode]);

  return (
    <ThemeContext.Provider value={value}>
      <MuiThemeProvider theme={value.muiTheme}>{children}</MuiThemeProvider>
    </ThemeContext.Provider>
  );
}
