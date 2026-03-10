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
  // should turn these into variables
  const [request, response, promptAsync] = Google.useAuthRequest({
    iosClientId:
      "170069746600-fpjr73ati0489boiodpuio97iv25h4ap.apps.googleusercontent.com",
    // TODO: find a way to get the android fingerprint
    // androidClientId: " ",
    webClientId:
      "https://495405279023-t3c7fr82dqk3c6asaif6j52jtg0fro8u.apps.googleusercontent.com",
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
        onPress={handleSignUp}
        style={({ pressed }) => [
          { backgroundColor: pressed ? "#292929" : "#3B3B3B" },
          styles.buttonContainer,
        ]}
      >
        <Text style={styles.buttonText}>Sign Up</Text>
      </Pressable>

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
        onPress={() => handleGoogleSignIn()}
        style={({ pressed }) => [
          { backgroundColor: pressed ? "#9A9A9A" : "#D9D9D9" },
          styles.buttonContainer,
        ]}
      >
        <View style={styles.inlineButton}>
          <Image
            style={styles.googleIcon}
            source={require("../../assets/googleIcon.png")}
          />
          <Text style={styles.googleText}>Continue with Google</Text>
        </View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 16,
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
