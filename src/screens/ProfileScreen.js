import { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import { doc, getDoc } from "firebase/firestore";
import { firebase_db, firebase_auth } from "../firebaseConfig";

export default function ProfileScreen({ navigation }) {
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const [coverImage, setCoverImage] = useState(null);
  const [bgColor, setBgColor] = useState("#ffffff");

  // reload profile data 
  useFocusEffect(
    useCallback(() => {
      const loadProfile = async () => {
        const uid = firebase_auth.currentUser?.uid;
        if (!uid) return;

        // fetch profile data from firestore
        const snap = await getDoc(doc(firebase_db, "users", uid));
        if (snap.exists()) {
          const data = snap.data();
          if (data.name) setName(data.name);
          if (data.bio) setBio(data.bio);
          if (data.profileImage) setProfileImage(data.profileImage);
          if (data.coverImage) setCoverImage(data.coverImage);
        }

        // load saved background colour from AsyncStorage
        const storedColor = await AsyncStorage.getItem("profileBgColor");
        if (storedColor) setBgColor(storedColor);
      };

      loadProfile();
    }, [])
  );

  return (
    <View style={[styles.container, { backgroundColor: bgColor }]}>

      <View style={styles.iconRow}>
        <TouchableOpacity
          style={styles.iconBtn}
          onPress={() =>
            navigation.navigate("EditProfileScreen", {
              name,
              bio,
              profileImage,
              coverImage,
            })
          }
        >
          <Image source={require("../../assets/edit.png")} style={styles.icon} />
        </TouchableOpacity>
      </View>

      <View style={styles.profileWrapper}>
        {profileImage ? (
          <Image source={{ uri: profileImage }} style={styles.profileImage} />
        ) : (
          <View style={styles.profilePlaceholder} />
        )}
      </View>

      <View style={styles.info}>
        <Text style={styles.name}>{name || "User Name"}</Text>
        <Text style={styles.bio}>{bio || "Bio"}</Text>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    paddingTop: 60,
  },
  iconRow: {
    position: "absolute",
    top: 50,
    right: 20,
    flexDirection: "row",
  },
  iconBtn: {
    padding: 8,
    marginLeft: 8,
  },
  icon: {
    width: 28,
    height: 28,
  },
  profileWrapper: {
    marginTop: 50,
    borderRadius: 100,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 100,
    color: "#fff",
  },
  profilePlaceholder: {
    width: 110,
    height: 110,
    borderRadius: 100,
    backgroundColor: "#ccc",
    borderWidth: 6,
    borderColor: "#fff",
    marginBottom: -20,
  },
  info: {
    alignItems: "center",
    marginTop: 24,
    paddingHorizontal: 20,
  },
  name: {
    fontSize: 32,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 8,
  },
  bio: {
    fontSize: 16,
    marginTop: 8,
    color: "#555",
    textAlign: "center",
  },
});