/* -------------------------- IMPORTS -------------------------- */
import React, { useEffect, useState } from "react";
import { StatusBar, View } from "react-native";
import { useFonts } from "expo-font";
import { Host } from "react-native-portalize";

/* --------- NAVIGATION --------- */
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
/* ------------------------------ */

/* --------- THEMEING --------- */
import { ThemeProvider } from "./theme/ThemeProvider";
import { useThemeContext } from "./theme/ThemeProvider";
/* ---------------------------- */

/* --------- SPLASH SCREEN --------- */
import Loading from "./components/Loading";
/* --------------------------------- */

/* --------- FONTSIZE MANAGER --------- */
import { FontSizeProvider } from "./context/FontSizeContext";
/* ------------------------------------ */

/* --------- GRADIENT APP BACKGROUND --------- */
import { LinearGradient } from "expo-linear-gradient";
/* ------------------------------------------- */

/* --------- SCREENS --------- */
import LoginScreen from "./screens/LoginScreen";
import RegistrationScreen from "./screens/RegistrationScreen";
import MainScreen from "./screens/MainScreen";
import MenuScreen from "./screens/MenuScreen";
import StudyStats from "./screens/StudyStats";
import AccountDetails from "./screens/Menu Screens/AccountDetails";
import AppSettings from "./screens/Menu Screens/AppSettings";
import About from "./screens/Menu Screens/About";
/* -------------------------- */

/* --------- ICONS --------- */
import { Ionicons } from "@expo/vector-icons";
/* -------------------------- */

/* --------- NAV VARIABLES --------- */
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
/* --------------------------------- */

/* -------------------------- TAB NAVIGATION -------------------------- */
const MainTabNavigator = ({ theme }) => (
  <Host>
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: theme.gradient.end,
          height: 80,
          borderTopWidth: 0,
        },
        tabBarIconStyle: {
          color: "#333333",
        },
        tabBarActiveTintColor: theme.tabIcon.color,
      }}
    >
      <Tab.Screen
        name="Home"
        component={MainScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <Ionicons name="timer" color={color} size={28} />
          ),
          tabBarLabel: "",
        }}
      />
      <Tab.Screen
        name="Stats"
        component={StudyStats}
        options={{
          tabBarIcon: ({ color }) => (
            <Ionicons name="stats-chart" color={color} size={28} />
          ),
          tabBarLabel: "",
        }}
      />

      <Tab.Screen
        name="Menu"
        component={MenuScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="menu" color={color} size={28} />
          ),
          tabBarLabel: "",
        }}
      />
    </Tab.Navigator>
  </Host>
);

/* -------------------------- APP COMPONENT -------------------------- */
const App = () => {
  // Font import loading using Expo-Font
  const [fontsLoaded] = useFonts({
    "Aspekta 400": require("./assets/fonts/Aspekta-400.ttf"),
    "Aspekta 450": require("./assets/fonts/Aspekta-450.ttf"),
    "Aspekta 500": require("./assets/fonts/Aspekta-500.ttf"),
    "Aspekta 550": require("./assets/fonts/Aspekta-550.ttf"),
    "Aspekta 600": require("./assets/fonts/Aspekta-600.ttf"),
  });

  if (!fontsLoaded) {
    return null;
  }

  // Wrap entire app in theme and fontsize providers
  return (
    <ThemeProvider>
      <FontSizeProvider>
        <AppContent />
      </FontSizeProvider>
    </ThemeProvider>
  );
};

// App content child component (used for theme context)
const AppContent = () => {
  const { theme } = useThemeContext();
  const [isAppReady, setIsAppReady] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAppReady(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <LinearGradient
        colors={[theme.gradient.start, theme.gradient.end]}
        style={{ position: "absolute", left: 0, right: 0, top: 0, bottom: 0 }}
      />
      <StatusBar
        barStyle={
          theme.background.backgroundColor === "#020202"
            ? "light-content"
            : "dark-content"
        }
      />
      {!isAppReady ? (
        <Loading theme={theme} />
      ) : (
        /* -------------------------- STACK NAVIGATION -------------------------- */
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Login">
            <Stack.Screen
              name="Login"
              component={LoginScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Register"
              component={RegistrationScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="MainTabNavigator"
              options={{ headerShown: false }}
            >
              {() => <MainTabNavigator theme={theme} />}
            </Stack.Screen>
            <Stack.Screen
              name="AccountDetails"
              component={AccountDetails}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="AppSettings"
              component={AppSettings}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="About"
              component={About}
              options={{ headerShown: false }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      )}
    </View>
  );
};
/* ------------------------------------------------------------------ */

export default App;
