import {
  View,
  Image,
  TouchableOpacity,
  Text,
  StyleSheet,
  Dimensions,
  Share,
  Alert,
} from "react-native";
import * as FileSystem from "expo-file-system/legacy";
import { doc, deleteDoc } from "firebase/firestore";
import { ref, deleteObject } from "firebase/storage";
import { firebase_db, firebase_storage } from "../firebaseConfig";

const SCREEN_WIDTH = Dimensions.get("window").width;
const STRIP_WIDTH = SCREEN_WIDTH * 0.75;
const STRIP_HEIGHT = STRIP_WIDTH * 1.8;

export default function ShareScreen({ route, navigation }) {
  const { strip } = route.params;

  const handleShare = async () => {
    try {
      const localPath = await FileSystem.downloadAsync(
        //download img from firebase onto local cache so we can share to certain apps like Instagram
        strip.url, //the firebase url
        FileSystem.cacheDirectory + "photostrip.png", //temporary local file
      );
      // share.share() opens native share on iOS
      await Share.share({
        url: localPath.uri, //shares the local file, not the remote firebase URL
      });
    } catch (error) {
      console.error("Share failed:", error);
    }
  };

  const handleDelete = () => {
    Alert.alert(
      "Delete Photostrip",
      "Are you sure you want to delete this photostrip? This cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              // Delete from Firestore
              await deleteDoc(doc(firebase_db, "photostrips", strip.id));

              // Delete from Firebase Storage
              const storageRef = strip.storagePath
                ? ref(firebase_storage, strip.storagePath)
                : ref(
                    firebase_storage,
                    decodeURIComponent(strip.url.split("/o/")[1].split("?")[0]),
                  );
              await deleteObject(storageRef);

              // Go back to gallery
              navigation.goBack();
            } catch (error) {
              console.error("Delete failed:", error);
              Alert.alert(
                "Error",
                "Failed to delete photostrip. Please try again.",
              );
            }
          },
        },
      ],
    );
  };

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: strip.url }}
        style={styles.stripImage}
        resizeMode="contain"
      />
      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
          <Text style={styles.deleteButtonText}>Delete</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
          <Text style={styles.shareButtonText}>Share</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#550d32",
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 0,
    gap: 24,
  },

  stripImage: {
    width: STRIP_WIDTH,
    height: STRIP_HEIGHT,
  },

  buttonRow: {
    flexDirection: "row",
    gap: 8,
  },

  shareButton: {
    backgroundColor: "black",
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 30,
  },

  shareButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },

  deleteButton: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: "rgb(255, 255, 255)",
  },

  deleteButtonText: {
    color: "rgb(255, 255, 255)",
    fontSize: 16,
    fontWeight: "600",
  },
});
