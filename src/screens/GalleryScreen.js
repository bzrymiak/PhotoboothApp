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
import { useEffect, useState } from "react";
import { collection, query, where, orderBy, getDocs } from "firebase/firestore";
import { firebase_db, firebase_auth } from "../firebaseConfig";

const NUM_COLUMNS = 3;
const SCREEN_WIDTH = Dimensions.get("window").width;
const STRIP_WIDTH = (SCREEN_WIDTH - 53) / NUM_COLUMNS;
const STRIP_HEIGHT = STRIP_WIDTH * 2.45; //height of strips calculated based on width

export default function GalleryScreen({ navigation }) {
  const [strips, setStrips] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch this user's photostrips from Firestore whenever screen is focused
  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      fetchStrips();
    });
    return unsubscribe;
  }, [navigation]);

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
    <View style={styles.container}>
      <FlatList
        data={strips}
        keyExtractor={(item) => item.id}
        numColumns={NUM_COLUMNS}
        contentContainerStyle={styles.grid}
        columnWrapperStyle={styles.row}
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
    backgroundColor: "#550d32",
  },

  grid: {
    padding: 16,
    paddingBottom: 12,
  },

  row: {
    gap: 10, //gap between photostrips
    marginBottom: 16, //space between rows photostrips
  },

  stripWrapper: {
    width: STRIP_WIDTH,
    height: STRIP_HEIGHT,
    overflow: "hidden",
  },

  stripImage: {
    width: "100%",
    height: "100%",
  },
});
