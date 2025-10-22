/* -------------------------- IMPORTS -------------------------- */
import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { getData } from "../API";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";

/* --------- STYLING AND THEMES --------- */
import universalStyles from "../theme/universalStyles";
import { useThemeContext } from "../theme/ThemeProvider";
/* -------------------------------------- */

/* ------------------------------------------------------------- */

const MainScreen = () => {
  /* --------------- STATE MANAGEMENT ---------------- */
  const [sessionGroups, setSessionGroups] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSegment, setSelectedSegment] = useState("Day");
  const [fullSessionStorage, setFullSessionStorage] = useState([]);
  /* ------------------------------------------------- */
  const { theme } = useThemeContext();

  useFocusEffect(
    React.useCallback(() => {
      fetchSessions();
    }, [])
  );

  // Set the maximum and minimum width for bars
  const maxWidth = 210;
  const minWidth = 50;

  // Function to fetch session data
  const fetchSessions = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      let allSessions = [];
      let page = 1;
      let response;

      do {
        response = await getData("sessions", { page }, null, token);

        if (!response) {
          throw new Error("Empty response");
        } else if (response === "Forbidden") {
          Alert.alert("Your session has expired, please login again.");
          return; // Exit function if token is invalid
        } else {
          allSessions = [...allSessions, ...response];
          page++; // Increment page for the next request
        }
      } while (response.length > 0); // Continue fetching until response is empty
      groupSessions(allSessions);
      setFullSessionStorage(allSessions);
      setIsLoading(false);
    } catch (error) {
      setSessionGroups([]);
      if (error.message === "Network request failed") {
        // Handle network request failed error
        Alert.alert(
          "Couldn't get session data",
          "Unable to connect to the server. Please check your internet connection or try again later."
        );
      } else {
        console.error("Error fetching session data:", error);
      }
      setIsLoading(false);
    }
  };

  // Filter sessions based on user-selected time constraints
  const groupSessions = (sessions) => {
    const currentDate = new Date();
    const lastMonthDate = new Date();
    lastMonthDate.setMonth(currentDate.getMonth() - 1);

    let filteredSessions;
    // Filtering for sessions within the last day
    if (selectedSegment === "Day") {
      filteredSessions = sessions.filter((session) => {
        const sessionDate = new Date(session.session_end);
        return (
          // Match year, month and exact date
          sessionDate.getFullYear() === currentDate.getFullYear() &&
          sessionDate.getMonth() === currentDate.getMonth() &&
          sessionDate.getDate() === currentDate.getDate()
        );
      });
    } else if (selectedSegment === "Month") {
      // Filtering for sessions within the last month
      filteredSessions = sessions.filter((session) => {
        const sessionDate = new Date(session.session_end);
        return (
          sessionDate >= lastMonthDate && // Session end date is after the start of last month
          sessionDate <= currentDate // Session end date is before or on the current date
        );
      });
    } else if (selectedSegment === "Year") {
      filteredSessions = sessions.filter((session) => {
        const sessionDate = new Date(session.session_end);
        return sessionDate.getFullYear() === currentDate.getFullYear();
      });
    } else if (selectedSegment === "Week") {
      const firstDayOfWeek = new Date(currentDate);
      const lastDayOfWeek = new Date(currentDate);
      const dayOfWeek = currentDate.getDay();

      // Calculate the first day of the week (Sunday)
      firstDayOfWeek.setDate(currentDate.getDate() - dayOfWeek);

      // Calculate the last day of the week (Saturday)
      lastDayOfWeek.setDate(currentDate.getDate() + (6 - dayOfWeek));

      filteredSessions = sessions.filter((session) => {
        const sessionDate = new Date(session.session_end);
        return sessionDate >= firstDayOfWeek && sessionDate <= lastDayOfWeek;
      });
    }

    const groups = filteredSessions.reduce((acc, session) => {
      const subjectName = session.subject_name || "No Tag";
      const existingGroup = acc.find(
        (group) => group.subjectName === subjectName
      );
      if (existingGroup) {
        existingGroup.totalDuration += session.duration;
      } else {
        acc.push({
          subjectName: subjectName,
          totalDuration: session.duration,
        });
      }
      return acc;
    }, []);

    setSessionGroups(groups);
  };

  // Function to calculate the width percentage of each bar, considering both maximum and minimum width
  const calculateBarWidth = (totalDuration, maxTotalDuration) => {
    const percentage = totalDuration / maxTotalDuration;
    return Math.max(minWidth, Math.min(maxWidth, percentage * maxWidth));
  };

  // Find the total duration of all groups
  const totalDurationOfAllGroups = sessionGroups.reduce(
    (total, group) => total + group.totalDuration,
    0
  );

  // Array of colors for bars
  const barColors = theme.barColors.colors;

  // Regroup session array whenever selected segment changes
  useEffect(() => {
    groupSessions(fullSessionStorage);
  }, [selectedSegment]);

  return (
    <LinearGradient // Add LinearGradient as wrapper
      colors={[theme.gradient.start, theme.gradient.end]}
      style={{ flex: 1 }}
    >
      <View style={universalStyles.container}>
        <Text style={[universalStyles.heading, theme.highContrast]}>
          Study Stats
        </Text>
        {/* Segmented Control */}
        <View
          style={[
            styles.segmentedControl,
            { backgroundColor: theme.selectionButton.backgroundColor },
          ]}
        >
          <TouchableOpacity
            style={[
              styles.segmentButton,
              selectedSegment === "Day" && styles.selectedSegment,
            ]}
            onPress={() => setSelectedSegment("Day")}
          >
            <Text
              style={[
                styles.segmentText,
                selectedSegment === "Day"
                  ? theme.selectedSegmentText
                  : theme.segmentText,
              ]}
            >
              Day
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.segmentButton,
              selectedSegment === "Week" && styles.selectedSegment,
            ]}
            onPress={() => setSelectedSegment("Week")}
          >
            <Text
              style={[
                styles.segmentText,
                selectedSegment === "Week"
                  ? theme.selectedSegmentText
                  : theme.segmentText,
              ]}
            >
              Week
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.segmentButton,
              selectedSegment === "Month" && styles.selectedSegment,
            ]}
            onPress={() => setSelectedSegment("Month")}
          >
            <Text
              style={[
                styles.segmentText,
                selectedSegment === "Month"
                  ? theme.selectedSegmentText
                  : theme.segmentText,
              ]}
            >
              Month
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.segmentButton,
              selectedSegment === "Year" && styles.selectedSegment,
            ]}
            onPress={() => setSelectedSegment("Year")}
          >
            <Text
              style={[
                styles.segmentText,
                selectedSegment === "Year"
                  ? theme.selectedSegmentText
                  : theme.segmentText,
              ]}
            >
              Year
            </Text>
          </TouchableOpacity>
        </View>

        {/* Bar Chart */}
        <View
          style={[
            styles.chart,
            sessionGroups.length > 0
              ? { backgroundColor: theme.selectionButton.backgroundColor }
              : null,
          ]}
        >
          {/* Conditionally render bars only when sessionGroups is not empty */}
          {sessionGroups.length > 0 ? (
            sessionGroups.map((group, index) => (
              <View key={index} style={styles.barContainer}>
                <View
                  style={[
                    styles.bar,
                    {
                      width: calculateBarWidth(
                        group.totalDuration,
                        totalDurationOfAllGroups
                      ),
                      backgroundColor: barColors[index % barColors.length], // Assigning a color from the array based on index
                    },
                  ]}
                >
                  <Text style={[styles.percentText, theme.highContrast]}>
                    {Math.round(
                      (group.totalDuration / totalDurationOfAllGroups) * 100
                    )}
                    %
                  </Text>
                </View>
                <View style={styles.infoContainer}>
                  <Text style={[styles.barLabel, theme.highContrast]}>
                    {group.subjectName}
                  </Text>
                  <Text style={styles.totalDuration}>
                    {group.totalDuration}m
                  </Text>
                </View>
              </View>
            ))
          ) : (
            <View>
              <Text
                style={[
                  theme.highContrast,
                  styles.noSessions,
                  { marginTop: 150 },
                ]}
              >
                No study sessions recorded yet.
              </Text>
              <Text style={[theme.highContrast, styles.noSessions]}>
                Ready to make a start?
              </Text>
            </View>
          )}
        </View>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  segmentedControl: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
    marginTop: 30,
    backgroundColor: "#F5f5f5",
    borderRadius: 50,
  },
  segmentButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 20,
  },
  selectedSegment: {
    backgroundColor: "#FFFFFF",
  },
  segmentText: {
    fontSize: 16,
    fontFamily: "Aspekta 550",
  },
  barContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  bar: {
    height: 60,
    marginRight: 10,
    borderRadius: 25,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
  },
  infoContainer: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "flex-start",
  },
  barLabel: {
    marginRight: 5,
    fontFamily: "Aspekta 600",
    fontSize: 16,
  },
  totalDuration: {
    fontSize: 14,
    color: "#999",
    fontFamily: "Aspekta 500",
  },
  percentText: {
    position: "absolute",
    left: 13,
    color: "black",
    fontFamily: "Aspekta 600",
    fontSize: 15,
  },
  chart: {
    marginTop: 20,
    padding: 30,
    borderRadius: 40,
  },
  noSessions: {
    textAlign: "center",
    fontSize: 18,
    fontFamily: "Aspekta 550",
  },
});

export default MainScreen;
