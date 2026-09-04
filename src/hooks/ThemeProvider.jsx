import { createContext, useContext } from "react";
import { useTheme } from "./useTheme";

const ThemeContext = createContext(null);

export const ThemeProvider = ({ children }) => {
  const value = useTheme();
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useThemeContext = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useThemeContext must be used within a ThemeProvider");
  return ctx;
};
