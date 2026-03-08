// HANDLES CAMERA STACK NAGIVATION

import { createNativeStackNavigator } from "@react-navigation/native-stack";
import CameraScreen from "../screens/CameraScreen";
import EditScreen from "../screens/EditScreen";
import ShareScreen from "../screens/ShareScreen";

const Stack = createNativeStackNavigator();

export default function CameraEditStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Camera" component={CameraScreen} />
      <Stack.Screen name="Edit" component={EditScreen} />
      <Stack.Screen name="Share" component={ShareScreen} />
    </Stack.Navigator>
  );
}
