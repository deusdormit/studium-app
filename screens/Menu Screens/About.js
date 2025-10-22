import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Linking,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import packagesData from "../../assets/JSON/licenses.json";
import { LinearGradient } from "expo-linear-gradient";

/* ----------------- STYLING AND THEMES ----------------- */
import universalStyles from "../../theme/universalStyles";
import { useThemeContext } from "../../theme/ThemeProvider";
import { useFontSize } from "../../context/FontSizeContext"; // Import useFontSize hook
/* ------------------------------------------------------ */

const About = ({ navigation }) => {
  const { theme } = useThemeContext();
  const { fontSize } = useFontSize(); // Destructure fontSize from useFontSize hook

  const handlePress = () => {
    // This is the URL you want to open
    const url =
      "https://www.freepik.com/free-psd/kawaii-3d-object-icon_49635539.htm#fromView=search&page=1&position=23&uuid=0591bcc2-3d69-4490-b5ab-c07cdd2a5737";
    Linking.openURL(url);
  };

  return (
    <LinearGradient // Add LinearGradient as wrapper
      colors={[theme.gradient.start, theme.gradient.end]}
      style={{ flex: 1 }}
    >
      <ScrollView style={universalStyles.container}>
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
          <Text style={[universalStyles.subheading, theme.highContrast]}>
            About
          </Text>
        </View>
        <Text
          style={[
            styles.subheading,
            theme.highContrast,
            { fontSize: fontSize },
          ]}
        >
          Studium is a simple, distraction-free productivity timer app for
          students. Developed for IFN666 A3 2024.
        </Text>
        <TouchableOpacity onPress={handlePress}>
          <Text
            style={[
              styles.subheading,
              theme.highContrast,
              {
                fontSize: fontSize,
                textDecorationLine: "underline",
              },
            ]}
          >
            Studium Icon credit: 'Kawaii 3d object icon' on Freepik.com. Used
            according to Freepik license guidelines.
          </Text>
        </TouchableOpacity>

        <View style={styles.tableContainer}>
          <View style={styles.tableRow}>
            <Text
              style={[
                styles.tableCell,
                styles.headerCell,
                {
                  backgroundColor: theme.button.backgroundColor,
                  color: "white",
                },
              ]}
            >
              Package Name
            </Text>
            <Text
              style={[
                styles.tableCell,
                styles.headerCell,
                {
                  backgroundColor: theme.button.backgroundColor,
                  color: "white",
                },
              ]}
            >
              License
            </Text>
          </View>
          {packagesData.packages.map((pkg, index) => (
            <View key={index} style={styles.tableRow}>
              <Text style={[styles.tableCell, theme.highContrast]}>
                {pkg.name}
              </Text>
              <Text style={[styles.tableCell, theme.highContrast]}>
                {pkg.license}
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  tableContainer: {
    marginTop: 40,
    paddingBottom: 50,
  },
  tableRow: {
    flexDirection: "row",
    marginBottom: 10,
  },
  tableCell: {
    flex: 1,
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  headerCell: {
    fontWeight: "bold",
  },
  subheading: {
    marginTop: 30,
  },
});

export default About;
