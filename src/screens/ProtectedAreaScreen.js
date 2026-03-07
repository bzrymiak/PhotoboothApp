import { Button, StyleSheet, Text, View } from "react-native";
import { firebase_auth } from "../firebaseConfig";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";

//importing screens
import SignInScreen from "./SignInScreen";
import CameraScreen from "./CameraScreen";
import GalleryScreen from "./GalleryScreen";
import EditScreen from "./EditScreen";
import ShareScreen from "./ShareScreen";

//create navigators
const MainTab = createBottomTabNavigator();
const CameraEditStack = createNativeStackNavigator(); //from Camera to Editor
const EditShareStack = createNativeStackNavigator(); //from Editor to Share
const GalleryPhotoStack = createNativeStackNavigator(); //from Gallery to Individual Photostrip
const PhotoShareStack = createNativeStackNavigator(); //from Individual Photostrip to Share

export default function ProtectedAreaScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text>Protected Screen</Text>

      {/* the Sign Out Button.
        
        When pressed:
        1. It calls Firebase's signOut method.
        2. This triggers the 'onAuthStateChanged' listener in your App.js.
        3. App.js sets 'user' to null.
        4. The App component re-renders and automatically switches back to the SignInScreen.
        
        Note: We don't need to use 'navigation.navigate("SignIn")' here. 
        The state change handles it automatically!
      */}
      <Button onPress={() => firebase_auth.signOut()} title="Sign Out" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
});
