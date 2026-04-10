// HANDLES GALLERY --> SHARE STACK NAVIGATION

import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ShareScreen from "../screens/ShareScreen";
import HomeScreen from "../screens/HomeScreen";

const Stack = createNativeStackNavigator();

export default function HomeStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Share" component={ShareScreen} />
    </Stack.Navigator>
  );
}
