// RENDER TABS AND PROTECTEDSCREEN CONTENT

import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

// import the stacks
import CameraEditStack from "../navigation/CameraStack";
import GalleryPhotoStack from "../navigation/GalleryStack";

// import profile screens directly
import ProfileScreen from "../screens/ProfileScreen";
import EditProfileScreen from "../screens/EditProfileScreen";

// import icons
import { Ionicons } from "@expo/vector-icons";

const Tab = createBottomTabNavigator();
const ProfileStack = createNativeStackNavigator();

function ProfileStackScreen() {
  return (
    <ProfileStack.Navigator>
      <ProfileStack.Screen
        name="ProfileScreen"
        component={ProfileScreen}
        options={{ headerShown: false }}
      />
      <ProfileStack.Screen
        name="EditProfileScreen"
        component={EditProfileScreen}
        options={{ title: "Edit Profile" }}
      />
    </ProfileStack.Navigator>
  );
}

export default function ProtectedAreaScreen() {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="ProfileTab"
        component={ProfileStackScreen}
        options={{
          headerShown: false,
          title: "Profile",
          tabBarIcon: ({ focused }) => (
            <Ionicons
              size={18}
              name="person"
              color={focused ? "#007AFF" : "#A7ABB1"}
            />
          ),
        }}
      />
      <Tab.Screen
        name="CameraTab"
        component={CameraEditStack}
        options={{
          headerShown: false,
          title: "Camera",
          tabBarIcon: ({ focused }) => (
            <Ionicons
              size={20}
              name="camera"
              color={focused ? "#007AFF" : "#A7ABB1"}
            />
          ),
        }}
      />
      <Tab.Screen
        name="GalleryTab"
        component={GalleryPhotoStack}
        options={{
          headerShown: false,
          title: "Gallery",
          tabBarIcon: ({ focused }) => (
            <Ionicons
              size={20}
              name="image"
              color={focused ? "#007AFF" : "#A7ABB1"}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
