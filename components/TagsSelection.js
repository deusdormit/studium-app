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
import { Ionicons } from "@expo/vector-icons";

/* ----------------- STYLING AND THEMES ----------------- */
import universalStyles from "../theme/universalStyles";
/* ------------------------------------------------------ */

const TagSelection = ({
  onSelectTag,
  navigation,
  theme,
  selectedTag,
  setSelectedTag,
}) => {
  const [tags, setTags] = useState([]); // State to store fetched tags
  const [isModalVisible, setIsModalVisible] = useState(false); // State to manage modal visibility
  const [newTagName, setNewTagName] = useState(""); // State to store the new tag name

  useEffect(() => {
    fetchTags();
  }, []);

  // Function to fetch tags
  const fetchTags = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const response = await getData("subjects", {}, null, token);

      if (response.error === "Forbidden") {
        navigation.navigate("ForbiddenScreen");
      }

      if (!response) {
        throw new Error("Empty response");
      } else if (response && response === "Forbidden") {
        Alert.alert("Your session has expired, please login again.");
        navigation.navigate("Login");
      } else {
        setTags(response);
      }
    } catch (error) {
      if (error.message === "Empty response") {
        setTags([]);
        Alert.alert("Error", "The response was empty.");
      } else if (error.message === "Network request failed") {
        // Handle network request failed error
        Alert.alert(
          "Couldn't get tags",
          "Unable to connect to the server. Please check your internet connection or try again later."
        );
      } else {
        setTags([]);
        Alert.alert("Error", "An error occurred while fetching tags.");
      }
    }
  };

  // Handle selection of a tag
  const handleTagSelection = (tag) => {
    // If the selected tag is the same as the current tag, deselect it
    if (selectedTag?.subject_id === tag.subject_id) {
      setSelectedTag(null);
      onSelectTag(null); // Pass null to indicate no tag is selected
    } else {
      // Otherwise, select the new tag
      setSelectedTag(tag);
      onSelectTag(tag); // Pass the selected tag to the parent component
    }
  };

  // Handle adding a new tag
  const handleAddTag = () => {
    if (tags.length < 6) {
      setIsModalVisible(true); // Show the modal
    } else {
      Alert.alert(
        "Class tag limit reached. Delete one or edit an existing one."
      );
    }
  };

  // Handle submitting the new tag
  const handleSubmitTag = async () => {
    try {
      const token = await AsyncStorage.getItem("token");

      // Check if newTagName exceeds 25 characters
      if (newTagName.length > 25) {
        Alert.alert("Tag name must not exceed 25 characters.");
        return;
      }

      const body = { subjectName: newTagName };

      const response = await postData("subjects", body, token);
      console.log(response);
      setIsModalVisible(false); // Close the modal
      setNewTagName(""); // Clear the input field
      fetchTags(); // Fetch tags again to refresh the list
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
        console.error("Error adding tag:", error);
      }
    }
  };

  // Function to handle deleting a tag
  const handleDeleteTag = async (subjectId) => {
    try {
      const token = await AsyncStorage.getItem("token");

      // Send DELETE request to delete the tag with the specified subjectId
      const response = await deleteData("subjects", subjectId, token);

      // Check if the tag was deleted successfully
      if (response.message === "Subject deleted successfully") {
        // Refresh the list of tags after successful deletion
        fetchTags();
      } else {
        // Handle error or display a message if deletion failed
        console.error("Error deleting tag:", response.error);
      }
    } catch (error) {
      console.error("Error deleting tag:", error);
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
              placeholder="Enter tag name"
              value={newTagName}
              onChangeText={setNewTagName}
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
                onPress={handleSubmitTag}
              >
                <Text style={universalStyles.modalSubmitText}>Submit</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      <View style={styles.headerContainer}>
        <Ionicons
          name={"pricetag"}
          size={20}
          color={theme.highContrast.color}
        />
        <Text style={[styles.header, theme.highContrast, { marginLeft: 15 }]}>
          Subject Tags
        </Text>
      </View>

      <View style={styles.tagContainer}>
        {tags &&
          tags.map &&
          tags.map((tag) => (
            <TouchableOpacity
              key={tag.subject_id}
              style={[
                styles.tag,
                selectedTag === tag && styles.selectedTag,
                theme.selectionButton, // Apply styles for selected tag
              ]}
              onPress={() => handleTagSelection(tag)}
            >
              <Text style={[theme.highContrast, { fontSize: 16 }]}>
                {tag.subject_name}
              </Text>
              <TouchableOpacity onPress={() => handleDeleteTag(tag.subject_id)}>
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
          style={[styles.tag, theme.addButton]}
          onPress={handleAddTag}
        >
          <Text style={[theme.highContrast, { fontSize: 16 }]}>Add Tag</Text>
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
  headerContainer: {
    flexDirection: "row", // Display children horizontally
    alignItems: "center", // Center children vertically
  },
  header: {
    fontSize: 20,
    marginVertical: 20,
    fontFamily: "Aspekta 600",
  },
  container: {
    flex: 1,
    padding: 20,
  },
  addButton: {
    padding: 25,
    marginBottom: 20,
  },
  tag: {
    flexDirection: "row", // Align tag content horizontally
    alignItems: "center", // Center items vertically
    borderRadius: 30,
    padding: 25,
    marginRight: 10, // Add margin between tags
    marginBottom: 10, // Add margin at the bottom of each tag
    borderWidth: 1,
    borderColor: "#3a3d47",
  },
  tagContainer: {
    flexDirection: "row", // Display tags in a row
    flexWrap: "wrap", // Allow tags to wrap to the next row if needed
  },
  deleteButton: {
    marginLeft: 10,
  },
});

export default TagSelection;
