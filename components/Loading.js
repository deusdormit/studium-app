import React from "react";
import { View, Image, ActivityIndicator, StyleSheet } from "react-native";
import studiumIcon from "../assets/studium-icon-small.png";
import * as Progress from "react-native-progress";
import { LinearGradient } from "expo-linear-gradient";

const Loading = ({ theme }) => {
  return (
    <LinearGradient // Add LinearGradient as wrapper
      colors={[theme.gradient.start, theme.gradient.end]}
      style={{ flex: 1 }}
    >
      <View style={styles.container}>
        {/* Image component */}
        <Image
          source={studiumIcon} // Replace with the path to your image
          style={styles.image}
          resizeMode="contain"
        />
        {/* ActivityIndicator component */}
        <Progress.Bar
          indeterminate={true}
          width={130}
          color={theme.highContrast.color}
          borderRadius={10}
          height={15}
        />
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: 150, // Adjust the width as needed
    height: 150, // Adjust the height as needed
    marginBottom: 40, // Adjust the margin as needed
  },
});

export default Loading;
