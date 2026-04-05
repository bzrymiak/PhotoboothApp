import { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useFocusEffect } from "@react-navigation/native";
import { doc, getDoc } from "firebase/firestore";
import { firebase_db, firebase_auth } from "../firebaseConfig";

export default function ProfileScreen({ navigation }) {
  const [name, setName] = useState("User Name");
  const [bio, setBio] = useState("Bio");
  const [profileImage, setProfileImage] = useState(null);
  const [coverImage, setCoverImage] = useState(null);

  useFocusEffect(
    useCallback(() => {
      const loadProfile = async () => {
        const uid = firebase_auth.currentUser?.uid;
        if (!uid) return;

        const snap = await getDoc(doc(firebase_db, "users", uid));
        if (snap.exists()) {
          const data = snap.data();
          if (data.name) setName(data.name);
          if (data.bio) setBio(data.bio);
          if (data.profileImage) setProfileImage(data.profileImage);
        }
      };

      loadProfile();
    }, [])
  );

  const pickImage = async (type) => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.Images,
      allowsEditing: true,
      aspect: type === "profile" ? [1, 1] : [16, 9],
      quality: 1,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      type === "profile" ? setProfileImage(uri) : setCoverImage(uri);
    }
  };

  return (
   <View style={styles.container}>
      <View style={styles.profileWrapper}>
        {profileImage ? (
          <Image source={{ uri: profileImage }} style={styles.profileImage} />
        ) : (
          <View style={styles.profilePlaceholder} />
        )}
      </View>

      <View style={styles.info}>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.bio}>{bio}</Text>

        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={styles.editBtn}
            onPress={() =>
              navigation.navigate("EditProfileScreen", {
                name,
                bio,
                profileImage,
                coverImage,
              })
            }
          >
            <Text>Edit Profile</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingsBtn}>
            <Text style={{ color: "#fff" }}>Settings</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  cover: { width: "100%", height: 220 },
  profileWrapper: {
    position: "absolute",
    top: 160,
    left: 20,
    borderWidth: 5,
    borderColor: "#fff",
    borderRadius: 100,
  },

  profileImage: { width: 120, height: 120, borderRadius: 60 },
  profilePlaceholder: { width: 120, height: 120, borderRadius: 60, backgroundColor: "#bbb" },
  info: { marginTop: 80, paddingHorizontal: 20 },
  name: { fontSize: 40, fontWeight: "bold" },
  bio: { fontSize: 18, marginTop: 10, color: "#555" },
  buttonRow: { flexDirection: "row", marginTop: 20 },
  editBtn: {
    backgroundColor: "#e5e5e5",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginRight: 10,
  },


  settingsBtn: {
    backgroundColor: "#000",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
  },
});