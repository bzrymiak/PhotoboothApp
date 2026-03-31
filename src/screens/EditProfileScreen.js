import { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function EditProfileScreen({ route, navigation }) {
  const {
    name: initialName,
    bio: initialBio,
    profileImage: initialProfile,
    coverImage: initialCover,
  } = route.params;

  const [name, setName] = useState(initialName);
  const [bio, setBio] = useState(initialBio);
  const [profileImage, setProfileImage] = useState(initialProfile);
  const [coverImage, setCoverImage] = useState(initialCover);

  useEffect(() => {
    (async () => {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        alert("Permission required to access photos");
      }
    })();
  }, []);

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

  const saveProfile = async () => {
    await AsyncStorage.setItem("profileName", name);
    await AsyncStorage.setItem("profileBio", bio);
    if (profileImage) await AsyncStorage.setItem("profileImage", profileImage);
    if (coverImage) await AsyncStorage.setItem("coverImage", coverImage);

    navigation.navigate("ProfileScreen", {
      updatedName: name,
      updatedBio: bio,
      updatedProfileImage: profileImage,
      updatedCoverImage: coverImage,
    });
  };

  const clearProfile = async () => {
    await AsyncStorage.removeItem("profileName");
    await AsyncStorage.removeItem("profileBio");
    await AsyncStorage.removeItem("profileImage");
    await AsyncStorage.removeItem("coverImage");

    setName("");
    setBio("");
    setProfileImage(null);
    setCoverImage(null);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => pickImage("cover")}>
        {coverImage ? (
          <Image source={{ uri: coverImage }} style={styles.cover} />
        ) : (
          <View style={styles.coverPlaceholder} />
        )}
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.profileWrapper}
        onPress={() => pickImage("profile")}
      >
        {profileImage ? (
          <Image source={{ uri: profileImage }} style={styles.profileImage} />
        ) : (
          <View style={styles.profilePlaceholder} />
        )}
      </TouchableOpacity>

      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder="Name"
      />

      <TextInput
        style={styles.input}
        value={bio}
        onChangeText={setBio}
        placeholder="Bio"
      />

      <TouchableOpacity style={styles.saveBtn} onPress={saveProfile}>
        <Text style={{ color: "#fff" }}>Save</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.clearBtn} onPress={clearProfile}>
        <Text style={{ color: "#fff" }}>Clear Profile</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  cover: { width: "100%", height: 180 },
  coverPlaceholder: { width: "100%", height: 180, backgroundColor: "#ddd" },
  profileWrapper: {
    position: "absolute",
    top: 140,
    left: 30,
    borderWidth: 4,
    borderColor: "#fff",
    borderRadius: 100,
  },
  profileImage: { width: 100, height: 100, borderRadius: 50 },
  profilePlaceholder: { width: 100, height: 100, borderRadius: 50, backgroundColor: "#bbb" },
  input: {
    marginTop: 80,
    borderBottomWidth: 1,
    padding: 10,
    fontSize: 16,
  },
  saveBtn: {
    marginTop: 30,
    backgroundColor: "#000",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  clearBtn: {
    marginTop: 15,
    backgroundColor: "#ff3b30",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
});
