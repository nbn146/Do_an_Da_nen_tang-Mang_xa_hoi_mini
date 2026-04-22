import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Pressable, Text } from "react-native";
import { AuthProvider, useAuth } from "./src/context/AuthContext";
import FeedScreen from "./src/screens/FeedScreen";
import LoginScreen from "./src/screens/LoginScreen";
import ProfileScreen from "./src/screens/ProfileScreen";
import RegisterScreen from "./src/screens/RegisterScreen";
import SearchScreen from "./src/screens/SearchScreen";
import { palette } from "./src/theme";

const Stack = createNativeStackNavigator();

function AppNavigator() {
  const { isAuthenticated, logout } = useAuth();

  const sharedOptions = {
    headerStyle: { backgroundColor: "#ffffff" },
    headerTintColor: palette.ink,
    headerShadowVisible: false,
    contentStyle: { backgroundColor: palette.bg },
  };

  if (!isAuthenticated) {
    return (
      <Stack.Navigator screenOptions={sharedOptions}>
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ title: "Welcome" }}
        />
        <Stack.Screen name="Register" component={RegisterScreen} />
      </Stack.Navigator>
    );
  }

  return (
    <Stack.Navigator screenOptions={sharedOptions}>
      <Stack.Screen
        name="Feed"
        component={FeedScreen}
        options={{
          title: "Mini Social",
          headerRight: () => (
            <Pressable onPress={logout}>
              <Text style={{ color: palette.primary, fontWeight: "700" }}>
                Logout
              </Text>
            </Pressable>
          ),
        }}
      />
      <Stack.Screen name="Search" component={SearchScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </AuthProvider>
  );
}
