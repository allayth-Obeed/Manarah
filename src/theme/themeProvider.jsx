import { useEffect, useMemo, useState } from "react";
import { themeTokens } from "./theme";
import { ThemeContext } from "./themeContext";

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

    return {
      themeMode,
      activeTheme,
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
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}
