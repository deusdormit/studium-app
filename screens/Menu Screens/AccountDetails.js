import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  TextInput,
  Button,
  ScrollView,
} from "react-native";
import { getData, editData, deleteAllSessions, deleteUser } from "../../API";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

/* ----------------- STYLING AND THEMES ----------------- */
import universalStyles from "../../theme/universalStyles";
import { useThemeContext } from "../../theme/ThemeProvider";
import { useFontSize } from "../../context/FontSizeContext"; // Import useFontSize hook
/* ------------------------------------------------------ */

const AccountDetails = ({ navigation }) => {
  /* --------------- STATE MANAGEMENT ---------------- */
  const [userData, setUserData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [selectedField, setSelectedField] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false); // State to manage modal visibility
  const [bodyContent, setBodyContent] = useState("");
  /* ------------------------------------------------- */

  const { theme } = useThemeContext();
  const { fontSize } = useFontSize(); // Destructure fontSize from useFontSize hook

  useEffect(() => {
    fetchProfile();
  }, []);

  // Function to fetch profile data
  const fetchProfile = async () => {
    try {
      const token = await AsyncStorage.getItem("token");

      const response = await getData("users", {}, null, token);
      setUserData(response);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching presets:", error);
      setUserData([]);
    }
  };

  /* ---------------- MANAGE SELECTED FIELD ----------------- */
  const handleFieldSelection = (fieldName) => {
    setSelectedField(fieldName);
    setIsModalVisible(true);
  };
  /* -------------------------------------------------------- */

  /* --------- CREATE POST BODY WITH FIELD VARIABLE --------- */
  const submitField = async () => {
    try {
      const token = await AsyncStorage.getItem("token");

      const body = { [selectedField]: bodyContent }; // Use selectedField and bodyContent
      const response = await editData("users", body, token);
      console.log(response);
      // If the update was successful, fetch the user data again to reflect the changes
      fetchProfile();

      setIsModalVisible(false);
      setSelectedField("");
      setBodyContent("");
    } catch (error) {
      console.error("Error updating user info:", error);
    }
  };
  /* -------------------------------------------------------- */

  /* --------- CREATE POST BODY WITH FIELD VARIABLE --------- */
  const resetSessionData = async () => {
    try {
      const token = await AsyncStorage.getItem("token");

      const response = await deleteAllSessions(token);
      console.log(response);
    } catch (error) {
      console.error("Error deleting sessions:", error);
    }
  };
  /* -------------------------------------------------------- */

  /* ---------------------- DELETE USER --------------------- */
  const deleteAccount = async () => {
    try {
      const token = await AsyncStorage.getItem("token");

      const response = await deleteUser(token);
      console.log(response);
      navigation.navigate("Login");
    } catch (error) {
      console.error("Error deleting sessions:", error);
    }
  };
  /* ---------------------------------------------------------- */

  return (
    <LinearGradient // Add LinearGradient as wrapper
      colors={[theme.gradient.start, theme.gradient.end]}
      style={{ flex: 1 }}
    >
      <ScrollView style={universalStyles.container}>
        {/* -------------------------- MODAL ------------------------- */}
        <Modal
          visible={isModalVisible}
          animationType="fade"
          transparent={true}
          onRequestClose={() => setIsModalVisible(false)}
        >
          <View style={universalStyles.modalContainer}>
            <View style={[universalStyles.modalContent, theme.modal]}>
              <TextInput
                style={[
                  universalStyles.modalInput,
                  { color: theme.modal.color },
                ]}
                placeholder={`Update ${selectedField}`}
                value={bodyContent}
                onChangeText={setBodyContent}
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
                  onPress={submitField}
                >
                  <Text style={universalStyles.modalSubmitText}>Submit</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
        {/* ---------------------------------------------------------- */}
        <View style={universalStyles.headerContent}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons
              name={"chevron-back-outline"}
              size={24}
              style={[
                universalStyles.back,
                { color: theme.highContrast.color },
              ]}
            />
          </TouchableOpacity>
          <Text
            style={[
              universalStyles.subheading,
              theme.highContrast,
              { fontSize: fontSize },
            ]}
          >
            Account Details
          </Text>
        </View>
        {isLoading && userData ? (
          <ActivityIndicator />
        ) : (
          <View style={universalStyles.mainContent}>
            {/* ----------- Email button ----------- */}
            <Text style={[theme.highContrast, { fontSize: fontSize }]}>
              Email
            </Text>
            <TouchableOpacity
              style={[styles.button, universalStyles.button, theme.button]}
              onPress={() => handleFieldSelection("email")}
            >
              <View style={styles.buttonContent}>
                <View style={styles.buttonSub}>
                  <Ionicons
                    name={"mail-outline"}
                    style={styles.icon}
                    size={18}
                    color={theme.button.color}
                  />
                  <Text
                    style={[
                      styles.buttonText,
                      theme.button,
                      { fontSize: fontSize },
                    ]}
                  >
                    {userData.users[0].email}
                  </Text>
                </View>
                <Ionicons
                  name={"create-outline"}
                  style={styles.icon}
                  size={18}
                  color={theme.button.color}
                />
              </View>
            </TouchableOpacity>
            {/* ----------- Password button ----------- */}
            <Text style={[theme.highContrast, { fontSize: fontSize }]}>
              Password
            </Text>
            <TouchableOpacity
              style={[styles.button, universalStyles.button, theme.button]}
              onPress={() => handleFieldSelection("password")}
            >
              <View style={styles.buttonContent}>
                <View style={styles.buttonSub}>
                  <Ionicons
                    name={"key-outline"}
                    style={styles.icon}
                    size={18}
                    color={theme.button.color}
                  />
                  <Text
                    style={[
                      styles.buttonText,
                      theme.button,
                      { fontSize: fontSize },
                    ]}
                  >
                    {userData.users[0].password
                      .replace(/./g, "•")
                      .substring(0, 30)}
                  </Text>
                </View>
                <Ionicons
                  name={"create-outline"}
                  style={styles.icon}
                  size={18}
                  color={theme.button.color}
                />
              </View>
            </TouchableOpacity>

            {/* ----------- First Name button ----------- */}
            <Text style={[theme.highContrast, { fontSize: fontSize }]}>
              First Name
            </Text>
            <TouchableOpacity
              style={[styles.button, universalStyles.button, theme.button]}
              onPress={() => handleFieldSelection("firstName")}
            >
              <View style={styles.buttonContent}>
                <View style={styles.buttonSub}>
                  <Ionicons
                    name={"person-outline"}
                    style={styles.icon}
                    size={18}
                    color={theme.button.color}
                  />

                  <Text
                    style={[
                      styles.buttonText,
                      theme.button,
                      { fontSize: fontSize },
                    ]}
                  >
                    {userData.users[0].firstName}
                  </Text>
                </View>
                <Ionicons
                  name={"create-outline"}
                  style={styles.icon}
                  size={18}
                  color={theme.button.color}
                />
              </View>
            </TouchableOpacity>
            {/* ----------- Last Name button ----------- */}
            <Text style={[theme.highContrast, { fontSize: fontSize }]}>
              Last Name
            </Text>
            <TouchableOpacity
              style={[styles.button, universalStyles.button, theme.button]}
              onPress={() => handleFieldSelection("lastName")}
            >
              <View style={styles.buttonContent}>
                <View style={styles.buttonSub}>
                  <Ionicons
                    name={"person-outline"}
                    style={styles.icon}
                    size={18}
                    color={theme.button.color}
                  />
                  <Text
                    style={[
                      styles.buttonText,
                      theme.button,
                      { fontSize: fontSize },
                    ]}
                  >
                    {userData.users[0].lastName}
                  </Text>
                </View>
                <Ionicons
                  name={"create-outline"}
                  style={styles.icon}
                  size={18}
                  color={theme.button.color}
                />
              </View>
            </TouchableOpacity>
          </View>
        )}
        <View style={styles.buttonContainer}>
          <Text style={[theme.highContrast, { fontSize: fontSize }]}>
            Danger Zone
          </Text>
          <View>
            {/* ----------- Reset Data button ----------- */}
            <TouchableOpacity
              style={[styles.button, styles.warning, universalStyles.button]}
              onPress={resetSessionData}
            >
              <View style={styles.warningButtonContent}>
                <Ionicons name={"refresh-outline"} size={18} color={"white"} />
                <Text
                  style={[
                    styles.buttonText,
                    styles.warningText,
                    { fontSize: fontSize },
                  ]}
                >
                  Reset session data
                </Text>
              </View>
            </TouchableOpacity>
            {/* ----------- Delete Account button ----------- */}
            <TouchableOpacity
              style={[
                styles.button,
                styles.warning,
                universalStyles.button,
                { marginBottom: 100 },
              ]}
              onPress={deleteAccount}
            >
              <View style={styles.warningButtonContent}>
                <Ionicons name={"trash-outline"} size={18} color={"white"} />
                <Text
                  style={[
                    styles.buttonText,
                    styles.warningText,
                    { fontSize: fontSize },
                  ]}
                >
                  Delete account
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  button: {
    marginBottom: 20,
    marginTop: 10,
    paddingHorizontal: 30,
  },
  buttonContent: {
    flexDirection: "row", // Align icon and text horizontally
    alignItems: "center", // Center items vertically
    justifyContent: "space-between",
  },
  buttonText: {
    marginLeft: 10, // Add some space between the icon and the text
    fontSize: 16,
  },
  buttonContainer: {
    marginTop: 30,
  },
  warningText: {
    color: "white",
  },
  warning: {
    backgroundColor: "#A91101",
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  warningButtonContent: {
    flexDirection: "row", // Align icon and text horizontally
    alignItems: "center", // Center items vertically
  },
  buttonSub: {
    flexDirection: "row", // Align icon and text horizontally
    alignItems: "center", // Center items vertically
  },
});

export default AccountDetails;
