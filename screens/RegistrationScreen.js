import React, { useState } from "react";
import {
  View,
  TextInput,
  Text,
  Alert,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { registerUser } from "../API";
import { useNavigation } from "@react-navigation/native";
import { loginUser } from "../API";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useThemeContext } from "../theme/ThemeProvider";
import { LinearGradient } from "expo-linear-gradient";

/* ----------------- STYLING AND THEMES ----------------- */
import universalStyles from "../theme/universalStyles";
/* ------------------------------------------------------ */

const RegistrationScreen = () => {
  const navigation = useNavigation();
  const { theme } = useThemeContext();

  const [newUser, setNewUser] = useState({
    username: "",
    email: "",
    password: "",
    firstName: "",
    lastName: "",
  });

  const [errorMessage, setErrorMessage] = useState(null);
  const [isEmailValid, setIsEmailValid] = useState(false);
  const [isUsernameValid, setIsUsernameValid] = useState(false);
  const [isFirstNameValid, setIsFirstNameValid] = useState(false);
  const [isLastNameValid, setIsLastNameValid] = useState(false);

  const handleInputChange = (field, value) => {
    setNewUser((prevUser) => ({
      ...prevUser,
      [field]: value,
    }));

    if (field === "email") {
      setIsEmailValid(validateEmail(value));
    } else if (field === "username") {
      setIsUsernameValid(validateUsername(value));
    } else if (field === "firstName") {
      setIsFirstNameValid(validateName(value));
    } else if (field === "lastName") {
      setIsLastNameValid(validateName(value));
    }
  };

  const handleRegister = async () => {
    try {
      const response = await registerUser(newUser);
      if (response.error) {
        setErrorMessage(response.error);
        Alert.alert("Woops!", response.error);
      } else {
        setErrorMessage(null);
        console.log(response);

        // Automatic login after successful registration
        await handleLogin(newUser.email, newUser.password);
      }
    } catch (error) {
      console.error("Error registering user:", error);
      setErrorMessage(error.message || "An unknown error occurred");
    }
  };

  // Auto login handler
  const handleLogin = async (email, password) => {
    try {
      const response = await loginUser(email, password);
      const token = response.token;

      // Store the token (e.g., in local storage)
      await AsyncStorage.setItem("token", token);

      // Navigate to the main screen of your timer app
      navigation.navigate("MainTabNavigator");
    } catch (error) {
      console.error("Error logging in:", error);
      Alert.alert("Login failed", "An error occurred while logging in.");
    }
  };

  const handleBack = () => {
    navigation.goBack();
  };

  const validateEmail = (email) => {
    const isValid =
      /^[^\s@]+@[^\s@]+\.(com|net|org|edu|gov|au|mil|co\.uk|org\.uk|ac\.uk|net\.uk|edu\.au|gov\.au|net\.au|org\.au)$/i.test(
        email
      );
    return isValid;
  };

  const validateUsername = (username) => {
    const isValid = /^[a-zA-Z0-9]+$/.test(username);
    return isValid;
  };

  const validateName = (name) => {
    const isValid = /^[a-zA-Z]+$/.test(name);
    return isValid;
  };

  return (
    <LinearGradient // Add LinearGradient as wrapper
      colors={[theme.gradient.start, theme.gradient.end]}
      style={{ flex: 1 }}
    >
      <View style={[universalStyles.container, styles.container]}>
        <Text style={[styles.subheading, theme.highContrast]}>Sign Up</Text>
        <TextInput
          style={[universalStyles.input, theme.button]}
          placeholder="Username"
          onChangeText={(value) => handleInputChange("username", value)}
          autoCapitalize="none"
          placeholderTextColor={theme.button.color}
        />
        <TextInput
          style={[universalStyles.input, theme.button]}
          placeholder="Email"
          onChangeText={(value) => handleInputChange("email", value)}
          autoCapitalize="none"
          placeholderTextColor={theme.button.color}
        />
        <TextInput
          style={[universalStyles.input, theme.button]}
          placeholder="Password"
          secureTextEntry={true}
          onChangeText={(value) => handleInputChange("password", value)}
          autoCapitalize="none"
          placeholderTextColor={theme.button.color}
        />
        <TextInput
          style={[universalStyles.input, theme.button]}
          placeholder="First Name"
          onChangeText={(value) => handleInputChange("firstName", value)}
          placeholderTextColor={theme.button.color}
        />
        <TextInput
          style={[universalStyles.input, theme.button]}
          placeholder="Last Name"
          onChangeText={(value) => handleInputChange("lastName", value)}
          placeholderTextColor={theme.button.color}
        />
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[
              universalStyles.loginSignupButton,
              {
                backgroundColor: !(
                  isEmailValid &&
                  isUsernameValid &&
                  isFirstNameValid &&
                  isLastNameValid
                )
                  ? theme.loginSignupButton.invalid.backgroundColor
                  : theme.loginSignupButton.valid.backgroundColor,
              },
            ]}
            onPress={handleRegister}
            disabled={
              !isEmailValid ||
              !isUsernameValid ||
              !isFirstNameValid ||
              !isLastNameValid
            }
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
              Signup
            </Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={handleBack}>
          <Text style={[styles.link, theme.highContrast]}>Back</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
  },
  subheading: {
    marginBottom: 60,
    fontSize: 30,
  },
  link: {
    textDecorationLine: "underline",
    fontSize: 18,
  },
});

export default RegistrationScreen;
