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

const NUM_COLUMNS = 2;
const SCREEN_WIDTH = Dimensions.get("window").width;
const STRIP_WIDTH = (SCREEN_WIDTH - 48) / NUM_COLUMNS;
const STRIP_HEIGHT = STRIP_WIDTH * 1.8;

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
        <Text style={styles.emptySubText}>
          Take 3 photos and save your first photostrip!
        </Text>
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
            onPress={() => navigation.navigate("StripDetail", { strip: item })}
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
    backgroundColor: "white",
  },

  grid: {
    padding: 12,
    paddingBottom: 40,
  },

  row: {
    gap: 12,
    marginBottom: 12,
  },

  emptyContainer: {
    flex: 1,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },

  emptyText: {
    fontSize: 20,
    fontWeight: "600",
    color: "black",
  },

  emptySubText: {
    color: "gray",
    fontSize: 14,
  },

  stripWrapper: {
    width: STRIP_WIDTH,
    height: STRIP_HEIGHT,
    borderRadius: 8,
    overflow: "hidden",
    backgroundColor: "#f0f0f0",
    shadowColor: "grey",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },

  stripImage: {
    width: "100%",
    height: "100%",
  },
});
