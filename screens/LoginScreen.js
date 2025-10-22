/* -------------------------- IMPORTS -------------------------- */
import React, { useState, useEffect } from "react";
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  Alert,
  TouchableOpacity,
  Image,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import studiumLogo from "../assets/studium-icon-small.png";

/* --------- API REQUEST FUNCTION(S) --------- */
import { loginUser } from "../API";
/* ------------------------------------------- */

/* -------------- STYLING AND THEMES -------------- */
import universalStyles from "../theme/universalStyles";
import { LinearGradient } from "expo-linear-gradient";
import { useThemeContext } from "../theme/ThemeProvider";
/* ------------------------------------------------ */

/* -------------------------- SCREEN -------------------------- */
const LoginScreen = ({ navigation }) => {
  const { theme } = useThemeContext();

  /* ----------- STATE MANAGEMENT ----------- */
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isEmailValid, setIsEmailValid] = useState(false);
  const [isPasswordValid, setIsPasswordValid] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [token, setToken] = useState(null);
  /* ---------------------------------------- */

  // AUTOLOGIN IF EXISTING SESSION TOKEN FOUND IN ASYNC STORAGE
  useEffect(() => {
    const checkToken = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        if (token) {
          console.log("Session found");
          navigation.navigate("MainTabNavigator");
        }
      } catch (error) {
        console.error("Error checking token:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkToken();
  }, []);

  // Login when button selected
  const handleLogin = async () => {
    try {
      if (!isEmailValid || !isPasswordValid) {
        Alert.alert("Invalid Input", "Please enter valid email and password.");
        return;
      }

      // Call API function passing email and password as params
      const response = await loginUser(email, password);

      if (response) {
        if (response.token != null) {
          setToken(response.token);
          await AsyncStorage.setItem("token", response.token);

          // Resetting email and password fields
          setEmail("");
          setPassword("");
          navigation.navigate("MainTabNavigator");
          // 401
        } else if (response.error === "Invalid password") {
          Alert.alert(
            "Incorrect details: Please check your email and password and try again."
          );
          // 404
        } else if (response.error === "User not found") {
          Alert.alert("User not found");
        }
      } else {
        Alert.alert("Login failed", "An error occurred while logging in.");
      }
      // Login error handling
    } catch (error) {
      if (error.message === "Network request failed") {
        Alert.alert(
          "Connection Error",
          "Unable to connect to the server. Please check your internet connection or try again later."
        );
      } else {
        Alert.alert("Login failed", "An error occurred while logging in.");
      }
    }
  };

  // INPUT VALIDATION REGEX
  const validateEmail = (email) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  };

  const validatePassword = (password) => {
    return password.length >= 1;
  };

  return (
    <LinearGradient // Add LinearGradient as wrapper
      colors={[theme.gradient.start, theme.gradient.end]}
      style={{ flex: 1 }}
    >
      <View style={[universalStyles.container, styles.container]}>
        <Image source={studiumLogo} style={styles.logo} />
        {/* ------- HEADER CONTENT ------- */}
        <Text style={[styles.heading, theme.highContrast]}>Studium</Text>
        <Text style={[styles.subheading, theme.highContrast]}>
          Time to get studious
        </Text>
        {/* ------- EMAIL AND PASSWORD INPUT ------- */}
        <TextInput
          style={[
            universalStyles.input,
            !isEmailValid && styles.inputError,
            theme.button,
          ]}
          placeholder="Email"
          value={email}
          onChangeText={(text) => {
            setEmail(text);
            setIsEmailValid(validateEmail(text));
          }}
          keyboardType="email-address"
          autoCapitalize="none"
          placeholderTextColor={theme.button.color}
        />
        <TextInput
          style={[
            universalStyles.input,
            !isPasswordValid && styles.inputError,
            theme.button,
          ]}
          placeholder="Password"
          placeholderTextColor={theme.button.color}
          secureTextEntry={true}
          value={password}
          onChangeText={(text) => {
            setPassword(text);
            setIsPasswordValid(validatePassword(text));
          }}
        />
        {/* ------- LOGIN AND SIGNUP BUTTONS ------- */}
        <View style={styles.buttonContainer}>
          {/* ------- LOGIN BUTTON ------- */}
          <TouchableOpacity
            style={[
              universalStyles.loginSignupButton,
              {
                backgroundColor: !(isEmailValid && isPasswordValid)
                  ? theme.loginSignupButton.invalid.backgroundColor
                  : theme.loginSignupButton.valid.backgroundColor,
              },
            ]}
            onPress={handleLogin}
            disabled={!isEmailValid || !isPasswordValid}
          >
            <Text
              style={[
                universalStyles.buttonText,
                {
                  color: "white",
                  fontSize: universalStyles.loginSignupButton.fontSize,
                },
              ]}
            >
              Login
            </Text>
          </TouchableOpacity>
        </View>
        {/* ------- SIGNUP BUTTON ------- */}
        <TouchableOpacity onPress={() => navigation.navigate("Register")}>
          <Text style={[styles.underline, theme.highContrast]}>Sign up</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  heading: {
    fontSize: 50,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
    fontFamily: "Aspekta 600",
    color: "#262626",
  },
  subheading: {
    marginBottom: 60,
    fontSize: 20,
  },
  link: {
    textDecorationLine: "underline",
  },
  underline: {
    textDecorationLine: "underline",
    fontSize: 16,
  },
  container: {
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 30,
  },
});

export default LoginScreen;
