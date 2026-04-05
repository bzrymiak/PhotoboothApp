// HANDLES GALLERY STACK NAVIGATION

import { createNativeStackNavigator } from "@react-navigation/native-stack";
import GalleryScreen from "../screens/GalleryScreen";
import PhotostripScreen from "../screens/PhotostripScreen"; // your custom screen
import ShareScreen from "../screens/ShareScreen";

const Stack = createNativeStackNavigator();

export default function GalleryPhotoStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Gallery" component={GalleryScreen} />
      {/* <Stack.Screen name="Photostrip" component={PhotostripScreen} /> */}
      <Stack.Screen name="Share" component={ShareScreen} />
    </Stack.Navigator>
  );
}
