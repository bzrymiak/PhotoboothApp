// APP.JS COVERS AUTHENTICATION

import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import { firebase_auth } from "./src/firebaseConfig";
import { PhotoProvider } from "./src/context/PhotoContext";

// screens
import SignInScreen from "./src/screens/SignInScreen";
import ProtectedAreaScreen from "./src/screens/ProtectedAreaScreen";

const Stack = createNativeStackNavigator();

export default function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    onAuthStateChanged(firebase_auth, (user) => {
      console.log("user", user);
      setUser(user);
    });
  }, []);

  return (
    <PhotoProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="SignIn">
          {user ? (
            <Stack.Screen
              name="ProtectedAreaScreen"
              component={ProtectedAreaScreen}
              options={{ headerShown: false }}
            />
          ) : (
            <Stack.Screen
              name="SignIn"
              component={SignInScreen}
              options={{ headerShown: false }}
            />
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </PhotoProvider>
  );
}
