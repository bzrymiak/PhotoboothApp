import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";
import { usePhotos, addPhoto } from "../context/PhotoContext";
import { captureRef } from "react-native-view-shot";
import { useRef, useState } from "react";
import * as MediaLibrary from "expo-media-library";

const NUM_COLUMNS = 1;
const SCREEN_WIDTH = Dimensions.get("window").width;
const PHOTO_HEIGHT = SCREEN_WIDTH / 2.1;
const PHOTO_WIDTH = PHOTO_HEIGHT / 1.1;

export default function PhotostripScreen() {
  const { photos, deletePhoto } = usePhotos();
  const snapshotRef = useRef();
  const [snapshotImg, setSnapshotImg] = useState();
  const [mediaPermission, requestMediaPermission] =
    MediaLibrary.usePermissions();

  const snapshot = async () => {
    try {
      // save as a jpg to easily save it to user's camera roll
      const result = await captureRef(snapshotRef, {
        result: "tmpfile",
        format: "png",
      });
      setSnapshotImg(result);
      await saveLocally(result);
    } catch (error) {
      console.error("Snapshot failed: ", error);
    }
  };

  // Save to device camera roll
  async function saveLocally(photo) {
    if (!mediaPermission?.granted) {
      const { granted } = await requestMediaPermission();
      if (!granted) {
        console.log("Media library permission not granted");
        return;
      }
    }
    await MediaLibrary.saveToLibraryAsync(photo); // takes the photo path straight from captureRef
  }

  const discard = () => {
    setSnapshotImg(null);
  };

  if (photos.length < 3) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No photos yet.</Text>
        <Text style={styles.emptySubText}>
          Take more photos to create a photostrip!
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* debugging snapshot code */}
      {/* {snapshotImg ? <Text>Snapshot taken</Text> : <Text>No snapshot</Text>}
      {snapshotImg ? (
        <View style={styles.snapshotContainer}>
          <Image
            resizeMode="contain"
            style={styles.snapshotImg}
            source={{ uri: snapshotImg }}
          />
        </View>
      ) : (
        <View />
      )} */}

      <View ref={snapshotRef} collapsable={false}>
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
      </View>

      {/* Bottom action buttons */}
      <View style={styles.previewActions}>
        <TouchableOpacity style={styles.actionButton} onPress={discard}>
          <Text style={styles.actionButtonText}>Discard</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.localButton]}
          onPress={snapshot}
        >
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

  snapshotImg: {
    width: PHOTO_WIDTH,
    height: PHOTO_HEIGHT * 3,
    position: "absolute",
    zIndex: 1,
  },
});
