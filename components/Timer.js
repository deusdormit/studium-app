import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { useCountdown } from "react-native-use-countdown";
import { postData } from "../API";
import AsyncStorage from "@react-native-async-storage/async-storage";
import moment from "moment-timezone";
import { Ionicons } from "@expo/vector-icons";

/* ----------------- STYLING AND THEMES ----------------- */
import universalStyles from "../theme/universalStyles";
/* ------------------------------------------------------ */

const Timer = ({
  selectedTag,
  timerValue,
  setTagButtonBool,
  theme,
  navigation,
  setTimerActiveMain,
}) => {
  const { formattedTime, isCountdownActive, start, reset } = useCountdown(
    timerValue * 60
  );

  // State to hold the session object
  const [session, setSession] = useState(null);

  // Function to create session object with adjusted timestamps
  const createSessionObject = () => {
    const currentDateTime = moment().format("YYYY-MM-DD HH:mm:ss"); // Get the current date and time in local timezone

    if (selectedTag) {
      const newSession = {
        subjectId: selectedTag.subject_id,
        sessionStart: currentDateTime,
        sessionEnd: null,
        sessionDuration: timerValue,
        subjectName: selectedTag.subject_name,
      };
      setSession(newSession);
    } else {
      const newSession = {
        sessionStart: currentDateTime,
        sessionEnd: null,
        sessionDuration: timerValue,
      };
      setSession(newSession);
    }
    setTimerActiveMain(true);
  };

  // Function to handle button press
  const handleButtonPress = () => {
    if (isCountdownActive) {
      reset(); // Reset the countdown if it's active
      setTagButtonBool(false);
      setTimerActiveMain(false);
    } else {
      createSessionObject(); // Create the session object
      start(); // Start the countdown if it's not active
      setTagButtonBool(true);
    }
  };

  // Function to handle countdown end with adjusted timestamp
  const handleCountdownEnd = async () => {
    if (session && session.sessionEnd === null) {
      setTimerActiveMain(false);

      setTagButtonBool(false);
      const updatedSession = { ...session };
      const currentDateTime = moment().format("YYYY-MM-DD HH:mm:ss"); // Get the current date and time in local timezone
      updatedSession.sessionEnd = currentDateTime;

      console.log(updatedSession);

      try {
        const token = await AsyncStorage.getItem("token");
        const response = await postData("sessions", updatedSession, token);
        console.log(response);
      } catch (error) {
        if (error.message === "JWT token expired") {
          Alert.alert(
            "Could not send data. Session expired, please login again."
          );
          navigation.navigate("Login");
        } else if (error.message === "Network request failed") {
          Alert.alert(
            "Server connection failed. Please check your internet connection or try again later."
          );
        } else {
          console.error("Error sending session data:", error);
        }
      }
    }
  };

  useEffect(() => {
    if (formattedTime === "00:00") {
      handleCountdownEnd();
    }
  }, [formattedTime]);

  useEffect(() => {
    reset();
  }, [timerValue]);

  /* ----------------------------- UI ----------------------------- */
  return (
    <View style={styles.container}>
      <View style={styles.timeBox}>
        <Text style={[styles.timeText, theme.highContrast]}>
          {formattedTime}
        </Text>
      </View>

      <TouchableOpacity
        style={[styles.button, theme.timeButton]}
        onPress={handleButtonPress}
      >
        <Text
          style={[
            styles.buttonText,
            universalStyles.buttonText,
            { color: "white", fontSize: 18 },
          ]}
        >
          {isCountdownActive ? "Cancel" : "Start"}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginBottom: 60,
  },
  timeBox: {
    borderRadius: 10,
    marginBottom: 10, // Adjust this value to control the spacing below the timer
  },
  timeText: {
    color: "#262626",
    fontSize: 85,
    fontFamily: "Aspekta 600",
  },
  button: {
    padding: 20,
    paddingHorizontal: 15,
    borderRadius: 30,
    width: 120,
    marginTop: 15,
  },
  buttonText: {
    fontFamily: "Aspekta 600",
  },
  subjectName: {
    marginTop: 10,
    fontSize: 18,
  },
});

export default Timer;
