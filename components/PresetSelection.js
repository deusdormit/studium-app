import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  TextInput,
  Button,
  Alert,
} from "react-native";
import { getData, postData, deleteData } from "../API";
import AsyncStorage from "@react-native-async-storage/async-storage";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import defaultPresets from "../assets/JSON/timerdefaults.json";
import { Ionicons } from "@expo/vector-icons";

/* ----------------- STYLING AND THEMES ----------------- */
import universalStyles from "../theme/universalStyles";
/* ------------------------------------------------------ */

const PresetSelection = ({ setTimerValue, theme, navigation }) => {
  /* --------------- STATE MANAGEMENT ---------------- */
  const [presets, setPresets] = useState([]); // State to store fetched presets
  const [selectedPreset, setSelectedPreset] = useState(null); // State to store the selected preset
  const [isModalVisible, setIsModalVisible] = useState(false); // State to manage modal visibility
  const [newPresetName, setNewPresetName] = useState(""); // State to store the new preset name
  /* ------------------------------------------------- */

  useEffect(() => {
    fetchPresets();
  }, []);

  // Function to fetch presets
  const fetchPresets = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const response = await getData("presets", {}, null, token);

      if (response.error === "Forbidden") {
        // Handle Forbidden error
        navigation.navigate("ForbiddenScreen");
      }

      if (!response) {
        throw new Error("Empty response");
      } else if (response && response === "Forbidden") {
        console.log("SESSION EXPIRED");
      } else {
        setPresets(response);
      }
    } catch (error) {
      if (error.message === "Empty response") {
        setPresets([]);
        Alert.alert("Error", "The response was empty.");
      } else if (error.message === "Network request failed") {
        // Handle network request failed error
        Alert.alert(
          "Couldn't get presets",
          "Unable to connect to the server. Please check your internet connection or try again later."
        );
      } else {
        setPresets([]);
        Alert.alert("Error", "An error occurred while fetching presets.");
      }
    }
  };

  // Handle selection of a preset
  const handlePresetSelection = (preset) => {
    // If the selected preset is the same as the current preset, deselect it
    if (selectedPreset?.session_id === preset.session_id) {
      setSelectedPreset(null);
      setTimerValue(0);
    } else {
      // Otherwise, select the new preset
      setSelectedPreset(preset);
      setTimerValue(preset.session_length_minutes);
    }
  };

  // Handle adding a new preset
  const handleAddPreset = () => {
    if (presets.length < 4) {
      setIsModalVisible(true); // Show the modal
    } else {
      Alert.alert(
        "Class preset limit reached. Delete one or edit an existing one."
      );
    }
  };

  // Handle submitting the new preset
  const handleSubmitPreset = async () => {
    try {
      const token = await AsyncStorage.getItem("token");

      // Check if newPresetName is greater than 180
      const presetMinutes = parseInt(newPresetName);
      if (presetMinutes >= 180) {
        Alert.alert("Session length must be less than 180 minutes.");
        return;
      }

      const body = { sessionLengthMinutes: presetMinutes };

      const response = await postData("presets", body, token);
      console.log(response);
      setIsModalVisible(false); // Close the modal
      setNewPresetName(""); // Clear the input field
      fetchPresets(); // Fetch presets again to refresh the list
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
        console.error("Error adding preset:", error);
      }
    }
  };

  // Function to handle deleting a preset
  const handleDeletePreset = async (presetId) => {
    try {
      const token = await AsyncStorage.getItem("token");

      // Send DELETE request to delete the preset with the specified subjectId
      const response = await deleteData("presets", presetId, token);
      console.log(response);
      fetchPresets();
    } catch (error) {
      console.error("Error deleting preset:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Modal
        visible={isModalVisible}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={universalStyles.modalContainer}>
          <View style={[universalStyles.modalContent, theme.modal]}>
            <TextInput
              style={[universalStyles.modalInput, { color: theme.modal.color }]}
              placeholder="Enter preset name"
              value={newPresetName}
              onChangeText={setNewPresetName}
              placeholderTextColor={theme.modal.color}
            />
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginTop: 10,
              }}
            >
              <TouchableOpacity
                title="Cancel"
                onPress={() => setIsModalVisible(false)}
                style={universalStyles.modalCancelButton}
              >
                <Text style={universalStyles.modalSubmitText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  universalStyles.modalSubmitButton,
                  { backgroundColor: theme.addButton.backgroundColor },
                ]}
                title="Add"
                onPress={handleSubmitPreset}
              >
                <Text style={universalStyles.modalSubmitText}>Submit</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      <View style={styles.headerContainer}>
        <Ionicons
          name={"hourglass"}
          size={20}
          color={theme.highContrast.color}
        />
        <Text style={[styles.header, theme.highContrast, { marginLeft: 15 }]}>
          Timer Presets
        </Text>
      </View>
      <View style={styles.presetContainer}>
        {defaultPresets.map((preset) => (
          <TouchableOpacity
            key={preset.session_id}
            style={[
              styles.preset,
              selectedPreset === preset && styles.selectedPreset,
              theme.selectionButton,
            ]}
            onPress={() => handlePresetSelection(preset)}
          >
            <Text style={[styles.minutes, theme.highContrast]}>
              {preset.session_length_minutes}
            </Text>
          </TouchableOpacity>
        ))}
        {presets &&
          presets.map &&
          presets.map((preset) => (
            <TouchableOpacity
              key={preset.session_id}
              style={[
                styles.preset,
                selectedPreset === preset && styles.selectedPreset,
                theme.selectionButton,
              ]}
              onPress={() => handlePresetSelection(preset)}
            >
              <Text style={[styles.minutes, theme.highContrast]}>
                {preset.session_length_minutes}
              </Text>
              <TouchableOpacity
                onPress={() => handleDeletePreset(preset.session_id)}
              >
                <FontAwesome
                  style={[styles.deleteButton, theme.highContrast]}
                  name={"times-circle"}
                  size={18}
                  color="black"
                />
              </TouchableOpacity>
            </TouchableOpacity>
          ))}

        <TouchableOpacity
          style={[styles.preset, theme.addButton]}
          onPress={handleAddPreset}
        >
          <Text style={[theme.highContrast, { fontSize: 16 }]}>Add Preset</Text>
          <FontAwesome
            style={[styles.deleteButton, theme.highContrast]}
            name={"plus"}
            size={18}
            color="black"
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    fontSize: 20,
    marginVertical: 20,
    fontFamily: "Aspekta 600",
  },
  headerContainer: {
    flexDirection: "row", // Display children horizontally
    alignItems: "center", // Center children vertically
  },
  container: {
    flex: 1,
    padding: 20,
  },
  addButton: {
    backgroundColor: "white",
    padding: 19,
  },
  minutes: {
    fontSize: 15,
  },
  preset: {
    flexDirection: "row", // Align tag content horizontally
    alignItems: "center", // Center items vertically
    borderRadius: 25,
    padding: 18,
    marginRight: 10, // Add margin between tags
    marginBottom: 10, // Add margin at the bottom of each tag
    borderWidth: 1,
  },
  presetContainer: {
    flexDirection: "row", // Display presets in a row
    flexWrap: "wrap", // Allow presets to wrap to the next row if needed
  },
  deleteButton: {
    marginLeft: 10,
  },
});

export default PresetSelection;
