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

const NUM_COLUMNS = 1;
const SCREEN_WIDTH = Dimensions.get("window").width;
const PHOTO_HEIGHT = SCREEN_WIDTH / 2.1;
const PHOTO_WIDTH = PHOTO_HEIGHT / 1.1;

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
        style={styles.shadow}
        keyExtractor={(_, index) => index.toString()}
        numColumns={NUM_COLUMNS}
        renderItem={({ item, index }) => (
          <View style={styles.photoWrapper}>
            <Image
              source={{ uri: item }}
              style={styles.photo}
              resizeMode="cover"
            />
          </View>
        )}
      />

      {/* Bottom action buttons */}
      <View style={styles.previewActions}>
        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionButtonText}>Discard</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.actionButton, styles.localButton]}>
          <Text style={styles.actionButtonText}>Save Photostrip</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    paddingTop: 20,
    paddingInline: 40,
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
    width: PHOTO_HEIGHT,
    height: PHOTO_WIDTH,
    position: "relative",
    alignSelf: "center",
    margin: 5,
    outlineWidth: 15,
    outlineColor: "white",
  },

  photo: {
    width: "100%",
    height: "100%",
  },

  shadow: {
    paddingTop: 10,
    paddingBottom: 20,
    shadowColor: "grey",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 6,
  },

  actionButton: {
    flex: 1,
    backgroundColor: "rgba(186, 186, 186, 0.4)",
    paddingVertical: 14,
    borderRadius: 30,
    width: 10,
    alignItems: "center",
  },

  localButton: {
    backgroundColor: "rgba(186, 186, 186, 0.9)",
  },

  cameraOverlay: {
    position: "absolute",
    bottom: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: SCREEN_WIDTH,
    paddingHorizontal: 30,
    paddingBottom: 30,
    zIndex: 10,
  },

  previewActions: {
    position: "absolute",
    bottom: 20,
    width: SCREEN_WIDTH,
    flexDirection: "row",
    justifyContent: "center",
    gap: 24,
    paddingHorizontal: 30,
  },
});
