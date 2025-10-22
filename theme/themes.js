import { useState, useEffect } from "react";
import { StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const useTheme = () => {
  const [isDarkMode, setIsDarkMode] = useState(false); // Initial value set to false

  useEffect(() => {
    // Retrieve the theme preference from AsyncStorage
    const getThemePreference = async () => {
      try {
        const storedTheme = await AsyncStorage.getItem("theme");
        if (storedTheme !== null) {
          setIsDarkMode(storedTheme === "dark"); // Check for "dark" theme
        }
      } catch (error) {
        console.error("Error retrieving theme preference:", error);
      }
    };

    getThemePreference();
  }, []);

  const toggleTheme = (isDark = !isDarkMode) => {
    // Toggle the theme preference
    const newTheme = isDark ? "dark" : "light";
    setIsDarkMode(isDark);
    // Store the updated theme preference in AsyncStorage
    AsyncStorage.setItem("theme", newTheme);
  };

  // Define the stylesheets based on the current theme
  const theme = isDarkMode ? darkTheme : lightTheme; // Adjusted condition to match the preference for initializing in light mode

  return { isDarkMode, toggleTheme, theme };
};

const lightTheme = StyleSheet.create({
  background: {
    backgroundColor: "#FFFFFF",
  },
  highContrast: {
    color: "#615549",
  },
  button: {
    color: "#FFFFFF",
    backgroundColor: "#615549",
    borderColor: "#615549",
  },
  gradient: {
    start: "#ffecd8", // Example start color for light mode gradient
    end: "#ffffff", // Example end color for light mode gradient
  },
  tabIcon: {
    color: "#FFA667",
  },
  editSessionModal: {
    backgroundColor: "#f0e4d8",
  },
  timeButton: {
    backgroundColor: "#FFA667",
  },
  selectionButton: {
    backgroundColor: "#f9f4ef",
    borderColor: "#f9f4ef",
  },
  addButton: {
    backgroundColor: "#FFA667",
    borderColor: "#FFA667",
  },
  menuSubheading: {
    color: "#FFA667",
  },
  barColors: {
    colors: ["#FFA667", "#F4A172", "#DE9888", "#D39492", "#C88F9D", "#BD8BA8"],
  },
  segmentedControl: {
    backgroundColor: "#FFFFFF",
  },
  segmentText: {
    color: "#b5aca2",
  },
  selectedSegmentText: {
    color: "#5d5145",
  },
  modal: {
    backgroundColor: "#f9f4ef",
    color: "#615549",
  },
  loginSignupButton: {
    invalid: {
      backgroundColor: "rgba(255, 166, 103, 0.4)",
    },
    valid: {
      backgroundColor: "#FFA667",
    },
  },
});

const darkTheme = StyleSheet.create({
  background: {
    backgroundColor: "#020202",
  },
  highContrast: {
    color: "#FFFFFF",
  },
  button: {
    color: "#FFFFFF",
    backgroundColor: "#3a3d47",
    borderColor: "#3a3d47",
  },
  gradient: {
    start: "#161925", // Example start color for dark mode gradient
    end: "#27303e", // Example end color for dark mode gradient
  },
  tabIcon: {
    color: "#d96d57",
  },
  editSessionModal: {
    backgroundColor: "#242833",
  },
  timeButton: {
    backgroundColor: "#39404a",
  },
  selectionButton: {
    backgroundColor: "#3a3d47",
    borderColor: "#3a3d47",
  },
  addButton: {
    backgroundColor: "#d96d57",
    borderColor: "#d96d57",
  },
  menuSubheading: {
    color: "#d96d57",
  },
  barColors: {
    colors: ["#D96D57", "#D06B60", "#C66A6A", "#BD6873", "#B4677C", "#AB6585"],
  },
  segmentedControl: {
    backgroundColor: "#FFFFFF",
  },
  segmentText: {
    color: "#77787e",
  },
  selectedSegmentText: {
    color: "#1f232e",
  },
  modal: {
    backgroundColor: "#3a3d47",
    color: "#FFFFFF",
  },
  loginSignupButton: {
    invalid: {
      backgroundColor: "rgba(217, 109, 87, 0.4)",
    },
    valid: {
      backgroundColor: "#d96d57",
    },
  },
});

export default useTheme;
