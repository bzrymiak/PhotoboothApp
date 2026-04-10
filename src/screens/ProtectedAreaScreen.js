// RENDER TABS AND PROTECTEDSCREEN CONTENT

import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

// import the stacks
import CameraEditStack from "../navigation/CameraStack";
import GalleryPhotoStack from "../navigation/GalleryStack";

import EditProfileScreen from "../screens/EditProfileScreen";

// import icons
import { Ionicons } from "@expo/vector-icons";

const Tab = createBottomTabNavigator();
const ProfileStack = createNativeStackNavigator();

export default function ProtectedAreaScreen() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: {
          paddingBottom: 8, // ← adjust bottom padding
          paddingTop: 4, // ← adjust top padding
          height: 70, // ← adjust overall height
        },
      }}
    >
      <Tab.Screen
        name="CameraTab"
        component={CameraEditStack}
        options={{
          headerShown: false,
          title: "",
          tabBarIcon: ({ focused }) => (
            <Ionicons
              size={32}
              name="camera"
              color={focused ? "black" : "#A7ABB1"}
            />
          ),
        }}
      />
      <Tab.Screen
        name="GalleryTab"
        component={GalleryPhotoStack}
        options={{
          headerShown: false,
          title: "",
          tabBarIcon: ({ focused }) => (
            <Ionicons
              size={32}
              name="image"
              color={focused ? "black" : "#A7ABB1"}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
