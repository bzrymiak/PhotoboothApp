import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";
import { usePhotos } from "../context/PhotoContext";

const NUM_COLUMNS = 3;
const SCREEN_WIDTH = Dimensions.get("window").width;
const PHOTO_SIZE = SCREEN_WIDTH / NUM_COLUMNS;

export default function GalleryScreen() {
  const { photos, deletePhoto } = usePhotos();

  if (photos.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No photos yet.</Text>
        <Text style={styles.emptySubText}>
          Take a photo and save it to the app!
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={photos}
        keyExtractor={(_, index) => index.toString()}
        numColumns={NUM_COLUMNS}
        renderItem={({ item, index }) => (
          <View style={styles.photoWrapper}>
            <Image
              source={{ uri: item }}
              style={styles.photo}
              resizeMode="cover"
            />
            {/* Delete button */}
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => deletePhoto(index)}
            >
              <Text style={styles.deleteText}>✕</Text>
            </TouchableOpacity>
          </View>
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

  emptyContainer: {
    flex: 1,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
  },

  emptyText: {
    color: "white",
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 8,
  },

  emptySubText: {
    color: "gray",
    fontSize: 14,
  },

  photoWrapper: {
    width: PHOTO_SIZE,
    height: PHOTO_SIZE,
    position: "relative",
  },

  photo: {
    width: "100%",
    height: "100%",
  },

  deleteButton: {
    position: "absolute",
    top: 4,
    right: 4,
    backgroundColor: "rgba(0,0,0,0.6)",
    width: 22,
    height: 22,
    borderRadius: 11,
    justifyContent: "center",
    alignItems: "center",
  },

  deleteText: {
    color: "white",
    fontSize: 10,
    fontWeight: "bold",
  },
});
