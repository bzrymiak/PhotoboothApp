import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { useEffect, useState, useCallback } from "react";
import {
  collection,
  query,
  where,
  orderBy,
  doc,
  getDocs, //fetches photostrips
  getDoc, //fetches user data
} from "firebase/firestore";
import { firebase_db, firebase_auth } from "../firebaseConfig";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";

const NUM_COLUMNS = 3;
const SCREEN_WIDTH = Dimensions.get("window").width;
const STRIP_WIDTH = (SCREEN_WIDTH - 53) / NUM_COLUMNS;
const STRIP_HEIGHT = STRIP_WIDTH * 2.45; //height of strips calculated based on width

export default function GalleryScreen({ navigation }) {
  const [strips, setStrips] = useState([]);
  const [loading, setLoading] = useState(true);

  // Profile states
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const [coverImage, setCoverImage] = useState(null);
  const [bgColor, setBgColor] = useState("#ffffff");

  useFocusEffect(
    useCallback(() => {
      fetchStrips();
      loadProfile();
    }, []),
  );

  async function loadProfile() {
    const uid = firebase_auth.currentUser?.uid;
    if (!uid) return;

    const snap = await getDoc(doc(firebase_db, "users", uid));
    if (snap.exists()) {
      const data = snap.data();
      if (data.name) setName(data.name);
      if (data.bio) setBio(data.bio);
      if (data.profileImage) setProfileImage(data.profileImage);
      if (data.coverImage) setCoverImage(data.coverImage);
    }

    const storedColor = await AsyncStorage.getItem("profileBgColor");
    if (storedColor) setBgColor(storedColor);
  }

  async function fetchStrips() {
    setLoading(true);
    try {
      const uid = firebase_auth.currentUser?.uid;
      if (!uid) return;

      const q = query(
        collection(firebase_db, "photostrips"),
        where("uid", "==", uid),
        orderBy("createdAt", "desc"),
      );

      const snapshot = await getDocs(q);
      const results = snapshot.docs.map((doc) => ({
        id: doc.id, // Firestore document ID
        ...doc.data(), // uid, url, createdAt
      }));

      setStrips(results);
    } catch (error) {
      console.error("Failed to fetch strips:", error);
    } finally {
      setLoading(false);
    }
  }

  const ProfileHeader = () => (
    <View style={[styles.profileContainer, { backgroundColor: bgColor }]}>
      <TouchableOpacity
        style={styles.profileWrapper}
        onPress={() =>
          navigation.navigate("EditProfileScreen", {
            name,
            bio,
            profileImage,
            coverImage,
          })
        }
      >
        {profileImage ? (
          <Image source={{ uri: profileImage }} style={styles.profileImage} />
        ) : (
          <View style={styles.profilePlaceholder} />
        )}
      </TouchableOpacity>

      <View style={styles.info}>
        <Text style={styles.name}>{name || "User Name"}</Text>
        <Text style={styles.bioText}>{bio || "Bio"}</Text>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.emptyContainer}>
        <ActivityIndicator size="large" color="gray" />
        <Text style={styles.emptySubText}>Loading your strips...</Text>
      </View>
    );
  }

  if (strips.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No strips yet.</Text>
        <Text style={styles.emptySubText}>Save your first photostrip!</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: bgColor }]}>
      <FlatList
        data={strips}
        keyExtractor={(item) => item.id}
        numColumns={NUM_COLUMNS}
        ListHeaderComponent={<ProfileHeader />}
        contentContainerStyle={styles.grid}
        columnWrapperStyle={styles.row}
        ListEmptyComponent={
          <View style={styles.emptyInline}>
            <Text style={styles.emptyText}>No strips yet.</Text>
            <Text style={styles.emptySubText}>Save your first photostrip!</Text>
          </View>
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.stripWrapper}
            onPress={() => navigation.navigate("Share", { strip: item })} //navigate to share screen when photostrip is pressed on
            activeOpacity={0.85}
          >
            <Image
              source={{ uri: item.url }}
              style={styles.stripImage}
              resizeMode="cover"
            />
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  profileContainer: {
    alignItems: "center",
    paddingTop: 32,
    paddingBottom: 24,
    marginBottom: 16,
    backgroundColor: "white",
    shadowColor: "grey",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 3,
  },
  editBtn: {
    position: "absolute",
    top: 70,
    right: 10,
    padding: 8,
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
  },
  profilePlaceholder: {
    width: 110,
    height: 110,
    borderRadius: 100,
    backgroundColor: "#e5e5e5",
  },
  info: {
    alignItems: "center",
    marginTop: 12,
    paddingHorizontal: 20,
  },
  name: {
    fontSize: 24,
    fontWeight: "500",
    textAlign: "center",
    marginTop: 8,
  },
  bioText: {
    fontSize: 14,
    marginTop: 4,
    color: "#555",
    textAlign: "center",
  },
  sectionLabel: {
    alignSelf: "flex-start",
    marginTop: 28,
    marginLeft: 16,
    fontSize: 18,
    fontWeight: "700",
  },

  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "white",
  },

  emptySubText: {
    fontWeight: 600,
  },

  grid: {
    paddingBottom: 16,
  },

  row: {
    gap: 10, //gap between photostrips
    marginBottom: 16, //space between rows photostrips
    paddingHorizontal: 16,
  },

  stripWrapper: {
    width: STRIP_WIDTH,
    height: STRIP_HEIGHT,
    shadowColor: "grey",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 3,
  },

  stripImage: {
    width: "100%",
    height: "100%",
  },
});
