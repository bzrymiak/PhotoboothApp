// HANDLES GALLERY STACK NAVIGATION

import { createNativeStackNavigator } from "@react-navigation/native-stack";
import GalleryScreen from "../screens/GalleryScreen";
import ShareScreen from "../screens/ShareScreen";
import EditProfileScreen from "../screens/EditProfileScreen";

const Stack = createNativeStackNavigator();

export default function GalleryPhotoStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Gallery"
        component={GalleryScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen name="Share" component={ShareScreen} />
      <Stack.Screen
        name="EditProfileScreen"
        component={EditProfileScreen}
        options={{ title: "Edit Profile" }}
      />
    </Stack.Navigator>
  );
}
