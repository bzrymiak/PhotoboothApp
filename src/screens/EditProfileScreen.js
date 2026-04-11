import { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { doc, setDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { signOut } from "firebase/auth";
import {
  firebase_db,
  firebase_storage,
  firebase_auth,
} from "../firebaseConfig";

// background colour options
const BG_COLORS = [
  "#FFFFFF",
  "#FFE5D4",
  "#FBD5FF",
  "#DFEFFF",
  "#EBFFDF",
  "#FFDFE6",
];

// uploads a local image URI to Firebase Storage and returns the download URL
async function uploadImage(uri, path) {
  const response = await fetch(uri);
  const blob = await response.blob();
  const storageRef = ref(firebase_storage, path);
  await uploadBytes(storageRef, blob);
  return await getDownloadURL(storageRef);
}

export default function EditProfileScreen({ route, navigation }) {
  const {
    name: initialName,
    bio: initialBio,
    profileImage: initialProfile,
  } = route.params;

  const clearChanges = async () => {
    const uid = firebase_auth.currentUser?.uid;
    if (!uid) return;
    try {
      setName("");
      setBio("");
      setProfileImage(null);
      setBgColor("#FFFFFF");
      await AsyncStorage.removeItem("profileBgColor");
      setCleared(true);
    } catch (e) {
      alert("Something went wrong clearing your profile.");
    }
  };

  const [name, setName] = useState(initialName ?? "");
  const [bio, setBio] = useState(initialBio ?? "");
  const [profileImage, setProfileImage] = useState(initialProfile);
  const [saving, setSaving] = useState(false);
  const [bgColor, setBgColor] = useState("#ffffff");
  const [cleared, setCleared] = useState(false);

  const handleLogout = async () => {
    try {
      await signOut(firebase_auth);
    } catch (error) {
      console.error("Logout error:", error);
      alert("Failed to log out.");
    }
  };

  // request photo permissions
  useEffect(() => {
    (async () => {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") alert("Permission required to access photos");

      const storedColor = await AsyncStorage.getItem("profileBgColor");
      if (storedColor) setBgColor(storedColor);
    })();
  }, []);

  // open the image picker and update profile img
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
    }
  };

  const saveProfile = async () => {
    const uid = firebase_auth.currentUser?.uid;
    if (!uid) return;

    setSaving(true);
    try {
      let profileImageUrl = profileImage;

      if (profileImage && !profileImage.startsWith("https://")) {
        profileImageUrl = await uploadImage(
          profileImage,
          `users/${uid}/profile.jpg`,
        );
      }

      await setDoc(doc(firebase_db, "users", uid), {
        name,
        bio,
        profileImage: profileImageUrl ?? null,
      });

      // save background colour locally
      await AsyncStorage.setItem("profileBgColor", bgColor);

      navigation.goBack();
    } catch (e) {
      console.error("Failed to save profile:", e);
      alert("Something went wrong saving your profile.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: bgColor }]}>
      <View style={styles.avatarSection}>
        <View style={styles.avatarWrapper}>
          {profileImage ? (
            <Image source={{ uri: profileImage }} style={styles.profileImage} />
          ) : (
            <View style={styles.profilePlaceholder} />
          )}
        </View>
        <TouchableOpacity style={styles.editBtn} onPress={pickImage}>
          <Text style={styles.editBtnText}>Edit</Text>
        </TouchableOpacity>
      </View>

      {/* Name input */}
      <View style={styles.fieldSection}>
        <View>
          <Text style={styles.label}>Nickname</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="give yourself a nickname!"
          />
        </View>
        <View>
          <Text style={styles.label}>Bio</Text>
          <TextInput
            style={styles.input}
            value={bio}
            onChangeText={setBio}
            placeholder="write a short bio"
          />
        </View>
      </View>

      {/* Background colour picker */}
      <View style={styles.fieldSection}>
        <Text style={styles.label}>Background colour</Text>
        <View style={styles.colorRow}>
          {BG_COLORS.map((color) => (
            <TouchableOpacity
              key={color}
              onPress={() => setBgColor(color)}
              style={[
                styles.colorCircle,
                { backgroundColor: color },
                bgColor === color && styles.colorCircleSelected,
              ]}
            />
          ))}
        </View>
      </View>

      {/* Done and Clear buttons */}
      <View style={styles.buttonColumn}>
        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.clearBtn} onPress={clearChanges}>
            <Text style={styles.clearBtnText}>Clear</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.doneBtn}
            onPress={saveProfile}
            disabled={saving}
          >
            {saving ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.doneBtnText}>Save Changes</Text>
            )}
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.logBtn} onPress={handleLogout}>
          <Text style={styles.logBtnText}>Log Out</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 28,
  },
  avatarSection: {
    alignItems: "center",
    marginBottom: 20,
  },
  avatarWrapper: {
    marginBottom: 12,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  profilePlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#ccc",
  },
  editBtn: {
    backgroundColor: "#000",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  editBtnText: {
    color: "#fff",
    fontWeight: "600",
  },
  fieldSection: {
    marginBottom: 20,
    gap: 8,
  },

  label: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 8,
    marginTop: 12,
  },
  input: {
    backgroundColor: "#ffffff",
    borderRadius: 10,
    padding: 14,
    fontSize: 16,
    height: 48,
    borderWidth: 0.5,
    borderColor: "grey",
  },
  colorRow: {
    flexDirection: "row",
    gap: 12,
  },
  colorCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 0.5,
    borderColor: "#grey",
  },
  colorCircleSelected: {
    borderWidth: 1.5,
    borderColor: "grey",
  },
  buttonColumn: {
    gap: 8,
    marginTop: 24,
    alignItems: "center",
  },

  buttonRow: {
    flexDirection: "row",
    gap: 8,
  },

  doneBtn: {
    backgroundColor: "#000",
    width: 144,
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: "center",
  },
  doneBtnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
  },
  clearBtn: {
    backgroundColor: "white",
    width: 144,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 30,
    borderWidth: 0.5,
    borderColor: "grey",
    shadowColor: "#ccc",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 6,
    alignItems: "center",
  },
  clearBtnText: {
    color: "black",
    fontSize: 16,
    fontWeight: "500",
  },

  logBtn: {
    backgroundColor: "#e5e5e5",
    width: 296,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 30,
    borderWidth: 0.5,
    borderColor: "grey",
    shadowColor: "#ccc",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 6,
    alignItems: "center",
  },
  logBtnText: {
    color: "black",
    fontSize: 16,
    fontWeight: "500",
  },
});
