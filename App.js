// APP.JS COVERS AUTHENTICATION

import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import { firebase_auth } from "./src/firebaseConfig";
import { PhotoProvider } from "./src/context/PhotoContext";

// screens
import SignInScreen from "./src/screens/SignInScreen";
import ProtectedAreaScreen from "./src/screens/ProtectedAreaScreen";

// root navigator handles authentication flow
const Stack = createNativeStackNavigator();

export default function App() {
  // initially 'null' (assumes no user is logged in).
  const [user, setUser] = useState(null);

  // initialize the Stack Navigators.
  // 'Stack' handles the root switching between SignIn and Protected areas.
  const Stack = createNativeStackNavigator();

  // 'ProtectedStack' handles navigation strictly *within* the authenticated area.
  const ProtectedStack = createNativeStackNavigator();

  // layout component for authenticated users.
  // this groups all screens that should only be visible after logging in.
  function ProtectedLayout() {
    return (
      <ProtectedStack.Navigator>
        <ProtectedStack.Screen
          name="ProtectedAreaScreen"
          component={ProtectedAreaScreen}
        />
        {/* you can add more private screens here (e.g., Profile, Settings) */}
      </ProtectedStack.Navigator>
    );
  }

  // useEffect hook to listen for Firebase authentication state changes.
  useEffect(() => {
    // onAuthStateChanged sets up a listener.
    // it triggers whenever the user logs in, logs out, or the token refreshes.
    onAuthStateChanged(firebase_auth, (user) => {
      console.log("user", user);

      // if user is found, 'user' is an object. If logged out, 'user' is null.
      // we update the local state to trigger a re-render of the navigation.
      setUser(user);
    });
  }, []);

  // ROOT NAVIGATION CONTAINER
  return (
    <PhotoProvider>
      {/* wraps all screens so they can all access photos */}
      <NavigationContainer>
        <Stack.Navigator initialRouteName="SignIn">
          {/* conditional rendering (The Auth Flow):
            Check if the 'user' state exists.
          */}
          {user ? (
            // IF LOGGED IN: show the entire app.
            // we hide the header here because the ProtectedLayout has its own headers.
            <Stack.Screen
              name="ProtectedArea"
              component={ProtectedAreaScreen}
              options={{ headerShown: false }}
            />
          ) : (
            // IF NOT LOGGED IN: show the Sign In Screen.
            <Stack.Screen
              name="SignIn"
              component={SignInScreen}
              options={{ headerShown: false }}
            />
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </PhotoProvider>
  );
}
