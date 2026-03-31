// RENDER TABS AND PROTECTEDSCREEN CONTENT

import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

// import the stacks
import CameraEditStack from "../navigation/CameraStack";
import GalleryPhotoStack from "../navigation/GalleryStack";

// import profile screens directly
import ProfileScreen from "../screens/ProfileScreen";
import EditProfileScreen from "../screens/EditProfileScreen";

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
        options={{ headerShown: false, title: "Profile" }}
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
