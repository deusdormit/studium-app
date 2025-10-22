/* -------------------------- IMPORTS -------------------------- */
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Linking,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

/* --------- API REQUEST FUNCTION(S) --------- */
import { getData } from "../API";
/* ------------------------------------------- */

/* --------- ICONS --------- */
import { Ionicons } from "@expo/vector-icons";
/* ------------------------- */

/* ----------------- STYLING AND THEMES ----------------- */
import universalStyles from "../theme/universalStyles";
import { useThemeContext } from "../theme/ThemeProvider";
import { useFontSize } from "../context/FontSizeContext"; // Import useFontSize hook
import { LinearGradient } from "expo-linear-gradient";
/* ------------------------------------------------------ */

/* --------- LOCAL JSON DATA --------- */
import menuButtons from "../assets/JSON/menubuttons.json";
/* ----------------------------------- */

/* -------------------------- SCREEN -------------------------- */
const MenuScreen = ({ navigation }) => {
  const { theme } = useThemeContext();
  const { fontSize } = useFontSize(); // Destructure fontSize from useFontSize hook

  /* --------------- STATE MANAGEMENT ---------------- */
  const [userData, setUserData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  /* ------------------------------------------------- */

  // Variable button action based on button identifier from JSON
  const handlePress = (onPressAction) => {
    if (onPressAction.id === 4) {
      // Check if the button ID is 4
      const email = "freyadcs@gmail.com"; // Replace with the desired email address
      Linking.openURL(`mailto:${email}`);
    } else if (
      onPressAction.isLoadingCheck &&
      (!userData || userData.length === 0 || isLoading)
    ) {
      Alert.alert(onPressAction.alertMessage);
    } else {
      navigation.navigate(onPressAction.navigateTo);
    }
  };
  useEffect(() => {
    fetchProfile();
  }, []);

  // Function to fetch profile data
  const fetchProfile = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const response = await getData("users", {}, null, token);

      if (!response) {
        throw new Error("Empty response");
      } else if (response && response === "Forbidden") {
        Alert.alert("Your session has expired, please login again.");
        navigation.navigate("Login");
      } else {
        setUserData(response);
        setIsLoading(false);
      }
    } catch (error) {
      setUserData([]);
      if (error.message === "Network request failed") {
        // Handle network request failed error
        Alert.alert(
          "Couldn't get profile data",
          "Unable to connect to the server. Please check your internet connection or try again later."
        );
      } else {
        console.error("Error fetching profile data:", error);
      }
      setIsLoading(false);
    }
  };

  return (
    <LinearGradient // Add LinearGradient as wrapper
      colors={[theme.gradient.start, theme.gradient.end]}
      style={{ flex: 1 }}
    >
      <View style={universalStyles.container}>
        <Text
          style={[universalStyles.heading, styles.heading, theme.highContrast]}
        >
          Menu
        </Text>
        {/* Render subheading conditionally */}
        {!isLoading &&
          userData &&
          userData.users &&
          userData.users.length > 0 && (
            <Text
              style={[universalStyles.subheading, theme.menuSubheading]}
            >{`@${userData.users[0].username}`}</Text>
          )}
        {/* Render loading indicator if isLoading is true */}
        {isLoading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="black" />
            <Text>Getting your info...</Text>
          </View>
        )}

        {/* Render menu buttons from JSON */}
        <View style={styles.buttonContainer}>
          {menuButtons.map((button) => (
            <TouchableOpacity
              key={button.id}
              style={[styles.button, universalStyles.button, theme.button]}
              onPress={() => handlePress(button.onPressAction)}
            >
              <View style={styles.buttonContent}>
                {/* Left-aligned icon and text content */}
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Ionicons
                    name={button.iconName}
                    size={20}
                    color={theme.button.color}
                    style={{ marginLeft: 10 }}
                  />
                  <Text
                    style={[
                      styles.buttonText,
                      theme.button,
                      { fontSize: fontSize },
                    ]}
                  >
                    {button.text}
                  </Text>
                </View>
                {/* Right-aligned icon */}
                <Ionicons
                  name="chevron-forward-outline"
                  size={20}
                  color={theme.button.color}
                  style={{ marginLeft: "auto" }} // Align the icon to the right
                />
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={[universalStyles.bottomText, { fontSize: fontSize }]}>
          Studium v1.0
        </Text>
        <Text style={[universalStyles.bottomText, { fontSize: fontSize }]}>
          Freya Sambain 2024
        </Text>
      </View>
    </LinearGradient>
  );
};
const styles = StyleSheet.create({
  heading: {
    textAlign: "left",
  },
  buttonContent: {
    flexDirection: "row", // Align icon and text horizontally
    alignItems: "center", // Center items vertically
  },
  buttonText: {
    marginLeft: 15,
    fontSize: 16,
    fontFamily: "Aspekta 550",
  },
  buttonContainer: {
    marginTop: 30,
    marginBottom: 60,
  },
  button: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  loadingContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
});

export default MenuScreen;
