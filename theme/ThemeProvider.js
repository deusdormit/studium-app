import React, { createContext, useContext } from "react";
import useTheme from "./themes";

// Step 1: Create a Theme Context
const ThemeContext = createContext();

// Step 2: Create a Theme Provider Component
export const ThemeProvider = ({ children }) => {
  const theme = useTheme(); // Initialize the theme using the custom hook

  return (
    <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>
  );
};

// Step 3: Custom hook to consume the theme context
export const useThemeContext = () => useContext(ThemeContext);
