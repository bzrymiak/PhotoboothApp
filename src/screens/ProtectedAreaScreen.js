// RENDER TABS AND PROTECTEDSCREEN CONTENT

import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { StyleSheet } from "react-native";

// import the stacks
import CameraEditStack from "../navigation/CameraStack";
import GalleryPhotoStack from "../navigation/GalleryStack";
import HomeStack from "../navigation/HomeStack";

const Tab = createBottomTabNavigator();

export default function ProtectedAreaScreen() {
  return (
    //render bottom tab bar
    <Tab.Navigator>
      <Tab.Screen
        name="HomeTab"
        component={HomeStack}
        options={{ headerShown: false, title: "Home" }}
      />
      <Tab.Screen
        name="CameraTab"
        component={CameraEditStack}
        options={{ headerShown: false, title: "Camera" }}
      />
      <Tab.Screen
        name="GalleryTab"
        component={GalleryPhotoStack}
        options={{ headerShown: false, title: "Gallery" }}
      />
    </Tab.Navigator>
  );
}
