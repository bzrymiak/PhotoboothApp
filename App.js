// APP.JS COVERS ROOT NAVIGATION AND AUTHENTICATION

import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import { firebase_auth } from "./src/firebaseConfig";

// public screen
import SignInScreen from "./src/SignInScreen";

// protected screens
import CameraScreen from "./src/CameraScreen";
import GalleryScreen from "./src/GalleryScreen";
import EditScreen from "./src/EditScreen";
import ShareScreen from "./src/ShareScreen";

// root navigator handles authentication flow
const Stack = createNativeStackNavigator();

//bottom tab bar shown after logging in
const MainTab = createBottomTabNavigator();

// nested stacks inside MainTab
const CameraEditStack = createNativeStackNavigator(); //camera flow
const GalleryPhotoStack = createNativeStackNavigator(); //gallery flow

export default function App() {
  // initially 'null' (assumes no user is logged in).
  const [user, setUser] = useState(null);

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

  // camera tab stack - camera, edit, share
  function CameraStackScreen() {
    return (
      <CameraEditStack.Navigator>
        <CameraEditStack.Screen name="Camera" component={CameraScreen} />{" "}
        //setting camera screen
        <CameraEditStack.Screen name="Edit" component={EditScreen} /> //setting
        edit screen
        <CameraEditStack.Screen name="Share" component={ShareScreen} />{" "}
        //setting share screen
      </CameraEditStack.Navigator>
    );
  }

  // gallery tab stack - gallery, photo, share
  function GalleryStackScreen() {
    return (
      <GalleryPhotoStack.Navigator>
        <GalleryPhotoStack.Screen name="Gallery" component={GalleryScreen} />{" "}
        //setting gallery screen
        <GalleryPhotoStack.Screen
          name="Photostrip"
          component={PhotostripScreen}
        />{" "}
        //setting photostrip screen
        <GalleryPhotoStack.Screen name="Share" component={ShareScreen} />{" "}
        //setting share screen
      </GalleryPhotoStack.Navigator>
    );
  }

  // main tab navigation (visible after login), each tab has it's own stack listed above!
  function MainTabs() {
    return (
      <MainTab.Navigator>
        <MainTab.Screen name="CameraTab" component={CameraStackScreen} />{" "}
        //camera stack from above
        <MainTab.Screen name="CameraTab" component={GalleryStackScreen} />{" "}
        //gallery stack from above
      </MainTab.Navigator>
    );
  }

  // layout component for authenticated users. this groups all screens that should only be visible after logging in.
  function ProtectedLayout() {
    return <MainTabs />;

    // <ProtectedStack.Navigator>
    //   <ProtectedStack.Screen
    //     name="ProtectedAreaScreen"
    //     component={ProtectedAreaScreen}
    //   />
    //   {/* you can add more private screens here (e.g., Profile, Settings) */}
    // </ProtectedStack.Navigator>
  }

  // ROOT NAVIGATION CONTAINER
  return (
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
            component={ProtectedLayout}
            options={{ headerShown: false }}
          />
        ) : (
          // IF NOT LOGGED IN: show the Sign In Screen.
          <Stack.Screen name="SignIn" component={SignInScreen} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
