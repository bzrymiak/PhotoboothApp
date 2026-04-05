import {
  createUserWithEmailAndPassword,
  signInWithCredential,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  Pressable,
  Image,
} from "react-native";
import { firebase_auth } from "../firebaseConfig";
import * as WebBrowser from "expo-web-browser";

WebBrowser.maybeCompleteAuthSession(); // this might be from the old google sign in stuff?

export default function SignInScreen() {
  // track email and password inputs.
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // get the auth instance initialized in firebaseConfig.js
  const auth = firebase_auth;

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

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Sign Up or Log In</Text>

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

      <Pressable
        onPress={handleSignIn}
        style={({ pressed }) => [
          { backgroundColor: pressed ? "#292929" : "#3B3B3B" },
          styles.buttonContainer,
        ]}
      >
        <Text style={styles.buttonText}>Sign In</Text>
      </Pressable>

      <View style={styles.line}>
        <Text style={styles.smallText}>or</Text>
      </View>

      <Pressable
        onPress={handleSignUp}
        style={({ pressed }) => [
          { backgroundColor: pressed ? "#292929" : "#3B3B3B" },
          styles.buttonContainer,
        ]}
      >
        <Text style={styles.buttonText}>Sign Up</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    paddingTop: 140, // all content appears above the keyboard
    backgroundColor: "white",
  },
  header: {
    fontSize: 24,
    marginBottom: 24,
    textAlign: "left",
    fontWeight: "bold",
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    marginBottom: 12,
    paddingLeft: 16,
    borderRadius: 8,
  },
  buttonContainer: {
    padding: 16,
    margin: 10,
    marginBottom: 0,
    width: "100%",
    alignSelf: "center",
    textAlign: "center",
    borderRadius: 8,
  },
  buttonText: {
    textAlign: "center",
    fontWeight: 700,
    fontSize: 16,
    color: "white",
  },
  googleText: {
    textAlign: "center",
    justifyContent: "center",
    fontWeight: 500,
  },
  footer: {
    marginTop: 20,
    textAlign: "center",
    color: "#888",
  },
  line: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    marginTop: 50,
    marginBottom: 10,
    color: "#9A9A9A",
  },
  smallText: {
    textAlign: "center",
    alignSelf: "center",
    marginBottom: -8,
    color: "#9A9A9A",
    backgroundColor: "white",
    width: 40,
  },
  googleIcon: {
    width: 28,
    height: 28,
  },
  inlineButton: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
});
