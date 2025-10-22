import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Switch } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFontSize } from "../../context/FontSizeContext";
import { LinearGradient } from "expo-linear-gradient";
import universalStyles from "../../theme/universalStyles";
import { useThemeContext } from "../../theme/ThemeProvider";

const AppSettings = ({ navigation }) => {
  const { theme, toggleTheme } = useThemeContext();
  const { fontSize, setFontSize } = useFontSize();
  const [isEnabled, setIsEnabled] = useState(false);

  useEffect(() => {
    const fetchThemePreference = async () => {
      try {
        const storedTheme = await AsyncStorage.getItem("theme");
        setIsEnabled(storedTheme === "dark");
      } catch (error) {
        console.error("Error fetching theme preference:", error);
      }
    };

    fetchThemePreference();
  }, []);

  const toggleSwitch = () => {
    const newEnabledState = !isEnabled;
    setIsEnabled(newEnabledState);
    const newTheme = newEnabledState ? "dark" : "light";
    AsyncStorage.setItem("theme", newTheme);
    toggleTheme();
  };

  const handleLogout = () => {
    AsyncStorage.removeItem("theme");
    AsyncStorage.removeItem("token");
    console.log("Logged out successfully");

    // Reset theme state after logout
    toggleTheme(false); // Pass false to set theme to light mode
    navigation.navigate("Login");
  };

  const handleTextSizeChange = (size) => {
    setFontSize(size);
  };

  return (
    <LinearGradient
      colors={[theme.gradient.start, theme.gradient.end]}
      style={{ flex: 1 }}
    >
      <View style={universalStyles.container}>
        <View style={universalStyles.headerContent}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons
              name={"chevron-back-outline"}
              size={24}
              style={[universalStyles.back, theme.highContrast]}
            />
          </TouchableOpacity>
          <Text
            style={[
              universalStyles.subheading,
              theme.highContrast,
              { fontSize: fontSize },
            ]}
          >
            App Settings
          </Text>
        </View>
        <View
          style={[
            styles.switchContainer,
            { backgroundColor: theme.selectionButton.backgroundColor },
          ]}
        >
          <View style={styles.flexContainer}>
            <Ionicons
              name={"moon"}
              size={24}
              style={[theme.highContrast, { marginRight: 10 }]}
            />
            <Text style={[theme.highContrast, { fontSize: fontSize }]}>
              Enable dark mode
            </Text>
          </View>
          <Switch
            trackColor={{ false: "#464750", true: "#d96d57" }}
            thumbColor={"#FFFFFF"}
            ios_backgroundColor="#3e3e3e"
            onValueChange={toggleSwitch}
            value={isEnabled}
          />
        </View>
        <View
          style={[
            styles.fontSizeToggle,
            { backgroundColor: theme.selectionButton.backgroundColor },
          ]}
        >
          <View style={styles.flexContainer}>
            <Ionicons
              name={"text"}
              size={24}
              style={[theme.highContrast, { marginRight: 10 }]}
            />
            <Text style={[theme.highContrast, { fontSize: fontSize }]}>
              Font size
            </Text>
          </View>
          <View style={styles.radioContainer}>
            <TouchableOpacity onPress={() => handleTextSizeChange(16)}>
              <Text style={[theme.highContrast, { fontSize: 18 }]}>Normal</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleTextSizeChange(19)}>
              <Text style={[theme.highContrast, { fontSize: 20 }]}>Large</Text>
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity
          style={[universalStyles.button, theme.button]}
          onPress={handleLogout}
        >
          <View style={styles.buttonContent}>
            <Ionicons
              name={"log-out-outline"}
              size={24}
              style={[theme.button, { marginLeft: 10 }]}
            />
            <Text
              style={[theme.button, { fontSize: fontSize }, { marginLeft: 10 }]}
            >
              Logout
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  switchContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 20,
    marginTop: 60,
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderRadius: 25,
  },
  radioContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  fontSizeToggle: {
    marginTop: 10,
    marginBottom: 30,
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderRadius: 25,
  },
  flexContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
});

export default AppSettings;
