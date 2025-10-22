/* -------------------------- IMPORTS -------------------------- */
import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

/* --------- API REQUEST FUNCTION(S) --------- */
import { getData } from "../API";
/* ------------------------------------------- */

/* --------- TIMER HOOK --------- */
import Timer from "../components/Timer";
/* ------------------------------- */

/* --------- COMPONENTS --------- */
import TagSelection from "../components/TagsSelection";
import PresetSelection from "../components/PresetSelection";
/* -------------------------------------- */

/* --------- MODAL CONFIG --------- */
import { Modalize } from "react-native-modalize";
import { Portal } from "react-native-portalize";
/* -------------------------------- */

/* --------- ICONS --------- */
import { Ionicons } from "@expo/vector-icons";
/* ------------------------- */

/* --------- STYLING AND THEMES --------- */
import universalStyles from "../theme/universalStyles";
import { useThemeContext } from "../theme/ThemeProvider";
import { useFontSize } from "../context/FontSizeContext"; // Import useFontSize hook
import { LinearGradient } from "expo-linear-gradient"; // Import LinearGradient
/* -------------------------------------- */

/* --------- LOCAL JSON DATA --------- */
import greetingsData from "../assets/JSON/greetings.json";
/* ----------------------------------- */

/* -------------------------- SCREEN -------------------------- */
const MainScreen = ({ navigation }) => {
  /* --------------- STATE MANAGEMENT ---------------- */
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [greeting, setGreeting] = useState("");
  const [iconName, setIconName] = useState("");
  const [selectedTag, setSelectedTag] = useState(null);
  const [timerValue, setTimerValue] = useState(45);
  const [tagButtonBool, setTagButtonBool] = useState(false);
  const [timerActiveMain, setTimerActiveMain] = useState(false);
  /* ------------------------------------------------- */

  const { theme } = useThemeContext();
  const { fontSize } = useFontSize();
  const modalRef = useRef(null);

  const handleTagSelection = (tag) => {
    setSelectedTag(tag);
  };

  // Initial greetings variables
  const { morningGreetings, afternoonGreetings, eveningGreetings } =
    greetingsData;
  const salutations = ["Morning", "Afternoon", "Evening"];

  // Set greeting based on system time
  const getTimeBasedGreeting = () => {
    const currentHour = new Date().getHours();
    let greetingArray, salutation;

    // 5am-12pm
    if (currentHour >= 5 && currentHour < 12) {
      greetingArray = morningGreetings;
      salutation = salutations[0];
      // 12pm-4pm
    } else if (currentHour >= 12 && currentHour < 16) {
      greetingArray = afternoonGreetings;
      salutation = salutations[1];
    } else {
      // 4pm-5am
      greetingArray = eveningGreetings;
      salutation = salutations[2];
    }

    // Randomly get greeting from time-appropriate list
    const randomGreeting =
      greetingArray[Math.floor(Math.random() * greetingArray.length)];
    return { salutation, randomGreeting };
  };

  // Template API call function
  useEffect(() => {
    const fetchData = async (endpoint) => {
      try {
        const token = await AsyncStorage.getItem("token");
        const response = await getData(endpoint, {}, null, token);

        if (response.error === "Forbidden") {
          navigation.navigate("ForbiddenScreen");
        }

        return response;
      } catch (error) {
        console.error("Error fetching data:", error);
        throw error;
      }
    };

    // Call for users
    const getUsers = async () => {
      try {
        const response = await fetchData("users");

        if (!response) {
          throw new Error("Empty response");
        }

        setUserData(response);
      } catch (error) {
        console.error("Error fetching users:", error);
        if (error.message === "Empty response") {
          Alert.alert("Error", "The response was empty.");
        } else {
          Alert.alert("Error", "An error occurred while fetching user data.");
        }
      }
    };

    // EXECUTE API REQUEST - EDITABLE FOR OTHER DATA CALLS
    const fetchDataForBothEndpoints = async () => {
      try {
        await getUsers();
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching data for both endpoints:", error);
        if (error.message === "Network request failed") {
          Alert.alert(
            "Connection Error",
            "Unable to connect to the server. Please check your internet connection or try again later."
          );
        } else {
          Alert.alert(
            "Error",
            "An error occurred while fetching data for both endpoints."
          );
          console.error(error);
        }
      }
    };

    fetchDataForBothEndpoints();
  }, []);

  // Time-based icon name setting
  useEffect(() => {
    if (!isLoading && userData) {
      const timeBasedGreeting = getTimeBasedGreeting();
      setGreeting(timeBasedGreeting);
      if (timeBasedGreeting.salutation === "Morning") {
        setIconName("sunny");
      } else if (timeBasedGreeting.salutation === "Afternoon") {
        setIconName("partly-sunny");
      } else {
        setIconName("moon");
      }
    }
  }, [isLoading, userData]);

  // Log timer value updates
  useEffect(() => {
    console.log("The new value of the timer is:", timerValue);
  }, [timerValue]);

  /* -------------------------- RENDERED CONTENT -------------------------- */
  return (
    <LinearGradient // Add LinearGradient as wrapper
      colors={[theme.gradient.start, theme.gradient.end]} // Use theme colors for gradient
      style={styles.container}
    >
      {/* -------- Activity indicator while user data loading -------- */}
      <View style={universalStyles.timerContainer}>
        {isLoading ? (
          <>
            <ActivityIndicator size="large" color="blue" />
            <Text>Getting your info...</Text>
          </>
        ) : (
          <>
            {/* -------- Top icon -------- */}
            <View style={styles.iconContainer}>
              <Ionicons
                name={iconName}
                size={55}
                color={theme.highContrast.color}
              />
            </View>

            {/* -------- Greeting with name -------- */}
            {userData && userData.users && userData.users.length > 0 && (
              <Text
                style={[
                  universalStyles.heading,
                  theme.highContrast,
                  { marginTop: 30 },
                ]}
              >
                {greeting.salutation} {userData.users[0].firstName}
              </Text>
            )}
            {/* -------- Time-based subheading -------- */}
            <Text
              style={[
                styles.subheading,
                theme.highContrast,
                { fontSize: fontSize, width: 270 },
              ]}
            >
              {greeting.randomGreeting}
            </Text>
            {/* -------- Edit session button - popup modal trigger -------- */}
            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                modalRef.current?.open();
              }}
              disabled={tagButtonBool}
            >
              <View style={styles.buttonContent}>
                {/* -------- Change tag content based on tag selection state -------- */}
                {selectedTag === null ? (
                  // If a tag has not been selected
                  <>
                    <Text
                      style={[
                        timerActiveMain ? { opacity: 0.5 } : { opacity: 1 },
                        styles.buttonText,
                        theme.highContrast,
                      ]}
                    >
                      Edit session
                    </Text>
                    {/* -------- Button icon changing based on timer state -------- */}
                    <Ionicons
                      name={timerActiveMain ? "lock-closed" : "chevron-forward"}
                      size={18}
                      color={theme.highContrast.color}
                      style={
                        timerActiveMain ? { opacity: 0.5 } : { opacity: 1 } // Grey out button while timer active
                      }
                    />
                  </>
                ) : (
                  // If a tag HAS been selected
                  <>
                    <Ionicons
                      name={"pricetag"}
                      size={18}
                      color={theme.highContrast.color}
                      style={
                        timerActiveMain ? { opacity: 0.5 } : { opacity: 1 }
                      }
                    />
                    <Text
                      style={[
                        styles.buttonText,
                        theme.highContrast,
                        { marginLeft: 10 },
                        timerActiveMain ? { opacity: 0.5 } : { opacity: 1 },
                      ]}
                    >
                      {/* Set button text to tag name */}
                      {selectedTag.subject_name}
                    </Text>
                    {/* -------- Button icon changing based on timer state -------- */}
                    <Ionicons
                      name={timerActiveMain ? "lock-closed" : "chevron-forward"}
                      size={18}
                      color={theme.highContrast.color}
                      style={
                        timerActiveMain ? { opacity: 0.5 } : { opacity: 1 }
                      }
                    />
                  </>
                )}
              </View>
            </TouchableOpacity>
            {/* -------- Timer component (includes start button) -------- */}
            <Timer
              selectedTag={selectedTag}
              timerValue={timerValue}
              setTagButtonBool={setTagButtonBool}
              theme={theme}
              navigation={navigation}
              timerActiveMain={timerActiveMain}
              setTimerActiveMain={setTimerActiveMain}
            />
          </>
        )}
      </View>
      {/* -------- Portal lifts modal above nav UI -------- */}
      <Portal>
        {/* -------- Presets & Tags Modal -------- */}
        <Modalize
          ref={modalRef}
          modalStyle={[
            styles.modal,
            { backgroundColor: theme.editSessionModal.backgroundColor },
          ]}
          overlayStyle={styles.overlay}
          modalHeight={700}
        >
          {/* -------- Custom Tag Selection Component -------- */}
          <TagSelection
            onSelectTag={handleTagSelection}
            navigation={navigation}
            theme={theme}
            selectedTag={selectedTag}
            setSelectedTag={setSelectedTag}
          />
          {/* -------- Custom Preset Selection Component -------- */}
          <PresetSelection
            setTimerValue={setTimerValue}
            theme={theme}
            navigation={navigation}
          />
        </Modalize>
      </Portal>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  subheading: {
    fontSize: 20,
    fontFamily: "Aspekta 550",
    marginTop: 20,
    textAlign: "center",
  },
  button: {
    padding: 10,
    borderRadius: 10,
    marginTop: 70,
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  buttonText: {
    marginRight: 10,
    fontSize: 18,
    fontFamily: "Aspekta 600",
  },
  modal: {
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    paddingHorizontal: 15,
  },
  // White glow on dark mode
  iconContainer: {
    shadowColor: "white",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 8,
    elevation: 5,
  },
});

export default MainScreen;
