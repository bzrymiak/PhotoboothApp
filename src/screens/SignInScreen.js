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
      <View style={styles.title}>
        <Text style={styles.header}>Let's Get Started</Text>
        <Text style={styles.description}>Sign In or Sign Up!</Text>
      </View>
      <View style={styles.userInfo}>
        {/* Email Input */}
        <View style={styles.infoSection}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="Email"
            keyboardType="email-address" // optimizes keyboard for email entry (@ symbol)
            value={email}
            onChangeText={setEmail} // updates state on every keystroke
            autoCapitalize="none" // important! Prevents auto-capitalizing the first letter of emails
          />
        </View>
        {/* Password Input */}
        <View style={styles.infoSection}>
          <Text style={styles.label}>Password</Text>
          <TextInput
            style={styles.input}
            placeholder="Password"
            secureTextEntry={true} // hides text for security (dots/asterisks)
            value={password}
            onChangeText={setPassword}
          />
        </View>

        <View style={styles.buttonContainer}>
          //sign in button
          <Pressable
            onPress={handleSignIn}
            style={({ pressed }) => [
              { backgroundColor: pressed ? "black" : "#202020" },
              styles.signInContainer,
            ]}
          >
            <Text style={styles.signInText}>Sign In</Text>
          </Pressable>
          <Pressable
            onPress={handleSignUp}
            style={({ pressed }) => [
              { backgroundColor: pressed ? "#ccc" : "#ffffff" },
              styles.signUpContainer,
            ]}
          >
            <Text style={styles.signUpText}>Sign Up</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 32,
    paddingTop: 130, // all content appears above the keyboard
    backgroundColor: "white",
    gap: 48,
  },

  title: {
    gap: 4,
  },

  header: {
    fontSize: 24,
    textAlign: "center",
    fontWeight: 600,
  },

  description: {
    fontSize: 14,
    textAlign: "center",
    fontWeight: 400,
  },

  userInfo: {
    gap: 16,
  },

  infoSection: {
    gap: 8,
  },

  label: {
    fontSize: 14,
    fontWeight: 500,
  },

  input: {
    height: 40,
    backgroundColor: "white",
    borderRadius: 10,
    borderWidth: 1,
    marginBottom: 12,
    padding: 14,
    fontSize: 16,
    height: 48,
    borderColor: "#ccc",
  },
  signInContainer: {
    padding: 16,
    margin: 10,
    marginBottom: 0,
    width: "100%",
    alignSelf: "center",
    textAlign: "center",
    borderRadius: 30,
  },
  signInText: {
    textAlign: "center",
    fontWeight: 500,
    fontSize: 16,
    color: "white",
  },

  signUpContainer: {
    padding: 16,
    margin: 10,
    marginBottom: 0,
    width: "100%",
    alignSelf: "center",
    textAlign: "center",
    borderRadius: 30,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  signUpText: {
    textAlign: "center",
    fontWeight: 500,
    fontSize: 16,
    color: "black",
  },

  buttonContainer: {
    gap: 0,
  },

  // footer: {
  //   marginTop: 20,
  //   textAlign: "center",
  //   color: "#888",
  // },
  // line: {
  //   borderBottomWidth: StyleSheet.hairlineWidth,
  //   marginTop: 50,
  //   marginBottom: 10,
  //   color: "#9A9A9A",
  // },
  // smallText: {
  //   textAlign: "center",
  //   alignSelf: "center",
  //   marginBottom: -8,
  //   color: "#9A9A9A",
  //   backgroundColor: "white",
  //   width: 40,
  // },
  // googleIcon: {
  //   width: 28,
  //   height: 28,
  // },
  // inlineButton: {
  //   display: "flex",
  //   flexDirection: "row",
  //   alignItems: "center",
  //   gap: 16,
  // },
});
