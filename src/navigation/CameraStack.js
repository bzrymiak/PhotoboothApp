// HANDLES CAMERA STACK NAGIVATION

import { createNativeStackNavigator } from "@react-navigation/native-stack";
import CameraScreen from "../screens/CameraScreen";
import EditScreen from "../screens/EditScreen";
import PhotostripScreen from "../screens/PhotostripScreen";

const Stack = createNativeStackNavigator();

export default function CameraEditStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Take 3 Photos!" component={CameraScreen} />
      <Stack.Screen name="Add a Caption" component={EditScreen} />
      <Stack.Screen name="Pick a Colour" component={PhotostripScreen} />
    </Stack.Navigator>
  );
}
