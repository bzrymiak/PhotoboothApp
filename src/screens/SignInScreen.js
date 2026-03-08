import {
  createUserWithEmailAndPassword,
  signInWithCredential,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { useState, useEffect } from "react";
import { Button, StyleSheet, Text, TextInput, View } from "react-native";
import { firebase_auth } from "../firebaseConfig";
// import { initializeApp } from "firebase/app";
// import { initializeAuth, getReactNativePersistence } from "firebase/auth";
// // import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

WebBrowser.maybeCompleteAuthSession();

export default function SignInScreen() {
  // track email and password inputs.
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // get the auth instance initialized in firebaseConfig.js
  const auth = firebase_auth;

  // connect to Google API
  const [request, response, promptAsync] = Google.useAuthRequest({
    iosClientId:
      "170069746600-fpjr73ati0489boiodpuio97iv25h4ap.apps.googleusercontent.com",
    // TODO: find a way to get the android fingerprint
    // androidClientId: " ",
    webClientId:
      "https://495405279023-t3c7fr82dqk3c6asaif6j52jtg0fro8u.apps.googleusercontent.com",

    // "YOUR_WEB_CLIENT_ID", // from Firebase project settings
  });

  // track response for google sign in
  useEffect(() => {
    handleGoogleResponse();
  }, [response]);

  // 1 .STANDARD EMAIL SIGN-IN
  // handle User Registration
  async function handleSignUp() {
    try {
      // send request to Firebase to create a user.
      // 'await' pauses execution here until Firebase responds.
      const response = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );

      console.log(response);
      alert("Sign up success. User: " + email + " signed up.");
      // note: After successful signup, Firebase automatically signs the user in.
      // the onAuthStateChanged listener in App.js will detect this and navigate.
    } catch (error) {
      console.log(error.message);
      alert(error.message);
    }
  }

  // handle User Login
  // checks credentials against existing users in Firebase
  async function handleSignIn() {
    try {
      // send request to Firebase to validate credentials.
      const response = await signInWithEmailAndPassword(auth, email, password);

      //console.log(response);
      alert("User: " + email + " signed in");
      // note: Similar to sign up, a success here triggers App.js to switch screens automatically.
    } catch (error) {
      console.log(error.message);
      alert(error.message);
    }
  }

  // 2. GOOGLE SIGN IN
  // funtion to sign in the user with their Google information
  async function handleGoogleResponse() {
    if (response?.type === "success") {
      const { id_token } = response.params;
      try {
        // create a credential with the user's ID token
        const googleCredentials = GoogleAuthProvider.credential(id_token);
        const userCredentials = await signInWithCredential(
          auth,
          googleCredentials,
        );
        console.log("Sign in with Google success: ", userCredentials.user);
      } catch (error) {
        console.log(error.message);
        alert(error.message);
      }
    }
  }

  // function to trigger the google sign in
  async function handleGoogleSignIn() {
    try {
      await promptAsync();
    } catch (error) {
      console.log(error.message);
      alert(error.message);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Welcome</Text>

      {/* Email Input */}
      <TextInput
        style={styles.input}
        placeholder="Email"
        keyboardType="email-address" // optimizes keyboard for email entry (@ symbol)
        value={email}
        onChangeText={setEmail} // updates state on every keystroke
        autoCapitalize="none" // important! Prevents auto-capitalizing the first letter of emails
      />

      {/* Password Input */}
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry={true} // hides text for security (dots/asterisks)
        value={password}
        onChangeText={setPassword}
      />

      {/* Action Buttons */}
      <View style={styles.buttonContainer}>
        <Button title="Sign Up" onPress={handleSignUp} />
      </View>

      <View style={styles.buttonContainer}>
        <Button title="Sign In" onPress={handleSignIn} />
      </View>

      <View style={styles.buttonContainer}>
        <Button
          title="Sign In with Google"
          onPress={() => handleGoogleSignIn()}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 16,
    backgroundColor: "#f2f2f2",
  },
  header: {
    fontSize: 24,
    marginBottom: 24,
    textAlign: "center",
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
    borderRadius: 8,
    backgroundColor: "white",
  },
  buttonContainer: {
    padding: 10,
    borderColor: "#c5c5c5",
    borderWidth: 1,
    margin: 10,
    width: 200,
    alignSelf: "center",
    borderRadius: 16,
  },
  footer: {
    marginTop: 20,
    textAlign: "center",
    color: "#888",
  },
});
