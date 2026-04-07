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
  // receive current profile data form the profile screen
  const {
    name: initialName,
    bio: initialBio,
    profileImage: initialProfile,
    coverImage: initialCover,
  } = route.params;

  const [name, setName] = useState(initialName ?? "");
  const [bio, setBio] = useState(initialBio ?? "");
  const [profileImage, setProfileImage] = useState(initialProfile);
  const [coverImage, setCoverImage] = useState(initialCover);
  const [saving, setSaving] = useState(false);
  const [bgColor, setBgColor] = useState("#ffffff");

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
        coverImage: coverImage ?? null,
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

  // clear profile images from Firestore and reset local state
  // const clearProfile = async () => {
  //   const uid = firebase_auth.currentUser?.uid;
  //   if (!uid) return;

  //   await setDoc(doc(firebase_db, "users", uid), {
  //     profileImage: null,
  //     coverImage: null,
  //   });

  //   // clear background colour from AsyncStorage
  //   await AsyncStorage.removeItem("profileBgColor");

  //   setName("");
  //   setBio("");
  //   setProfileImage(null);
  //   setCoverImage(null);
  //   setBgColor("#ffffff");
  // };

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
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Enter your user name"
        />
      </View>

      {/* Bio input */}
      <View style={styles.fieldSection}>
        <TextInput
          style={styles.input}
          value={bio}
          onChangeText={setBio}
          placeholder="Enter your bio"
        />
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
      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={styles.doneBtn}
          onPress={saveProfile}
          disabled={saving}
        >
          {saving ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.doneBtnText}>Done</Text>
          )}
        </TouchableOpacity>

        {/* <TouchableOpacity style={styles.clearBtn} onPress={clearProfile}>
          <Text style={styles.clearBtnText}>Clear history</Text>
        </TouchableOpacity> */}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 60,
  },
  avatarSection: {
    alignItems: "center",
    marginBottom: 30,
  },
  avatarWrapper: {
    marginBottom: 12,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: "#fff",
  },
  profilePlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#ccc",
    borderWidth: 4,
    borderColor: "#fff",
  },
  editBtn: {
    backgroundColor: "#000",
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  editBtnText: {
    color: "#fff",
    fontWeight: "600",
  },
  fieldSection: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 12,
    marginTop: 24,
  },
  input: {
    backgroundColor: "#e8e8e8",
    borderRadius: 10,
    padding: 14,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#ccc",
    height: 56,
  },
  colorRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 8,
  },
  colorCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1.5,
    borderColor: "#999",
  },
  colorCircleSelected: {
    borderWidth: 2,
    borderColor: "#999",
  },
  buttonRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 50,
  },
  doneBtn: {
    flex: 1,
    backgroundColor: "#000",
    padding: 16,
    borderRadius: 10,
    alignItems: "center",
  },
  doneBtnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
  },
  clearBtn: {
    flex: 1,
    backgroundColor: "#cc0000",
    padding: 16,
    borderRadius: 10,
    alignItems: "center",
  },
  clearBtnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
  },
});
