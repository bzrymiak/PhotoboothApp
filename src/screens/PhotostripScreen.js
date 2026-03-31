import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";
// import { usePhotos, addPhoto } from "../context/PhotoContext";
import { captureRef } from "react-native-view-shot";
import { useRef, useState } from "react";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import {
  firebase_auth,
  firebase_storage,
  firebase_db,
} from "../firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import { useFonts, AmaticSC_700Bold } from "@expo-google-fonts/amatic-sc"; //font for captions

const NUM_COLUMNS = 1;
const SCREEN_WIDTH = Dimensions.get("window").width;
const PHOTO_HEIGHT = SCREEN_WIDTH / 2.0; // match EditScreen
const PHOTO_WIDTH = PHOTO_HEIGHT / 1.4; // match EditScreen

export default function PhotostripScreen({ route, navigation }) {
  const { photos, caption } = route.params; //images and caption passed from CameraScreen
  const snapshotRef = useRef();
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [fontsLoaded] = useFonts({
    AmaticSC_700Bold,
  });

  const snapshot = async () => {
    if (saving || saved) return;
    setSaving(true);
    try {
      const result = await captureRef(snapshotRef, {
        result: "tmpfile",
        format: "png",
      });
      await saveToFirebase(result);
      setSaved(true);
      navigation.getParent().navigate("GalleryTab", { screen: "Gallery" }); //navigate to gallery after saved successfully
    } catch (error) {
      console.error("Snapshot failed: ", error);
    } finally {
      setSaving(false);
    }
  };

  async function saveToFirebase(photoPath) {
    // Wait for auth state to be ready
    const uid = await new Promise((resolve, reject) => {
      const unsubscribe = onAuthStateChanged(firebase_auth, (user) => {
        unsubscribe();
        if (user) resolve(user.uid);
        else reject(new Error("No user logged in"));
      });
    });

    console.log("uid:", uid);

    const filename = `photostrips/${uid}/${Date.now()}.png`;
    const reference = ref(firebase_storage, filename);

    const response = await fetch(photoPath);
    const blob = await response.blob();

    await uploadBytes(reference, blob);
    const downloadURL = await getDownloadURL(reference);

    const docRef = await addDoc(collection(firebase_db, "photostrips"), {
      uid,
      url: downloadURL,
      createdAt: serverTimestamp(),
    });

    console.log("Photostrip saved to Firebase with ID:", docRef.id);
  }

  const discard = () => {
    navigation.goBack(); // go back to camera
  };

  return (
    <View style={styles.container}>
      <View ref={snapshotRef} collapsable={false} style={styles.stripContainer}>
        <FlatList
          data={photos}
          style={styles.shadow}
          keyExtractor={(_, index) => index.toString()}
          numColumns={NUM_COLUMNS}
          scrollEnabled={false}
          contentContainerStyle={{ gap: 0, padding: 0 }}
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
        {caption ? <Text style={styles.captionText}>{caption}</Text> : null}
      </View>

      {/* Bottom action buttons */}
      <View style={styles.previewActions}>
        {/* <TouchableOpacity style={styles.actionButton} onPress={discard}>
          <Text style={styles.actionButtonText}>Delete</Text>
        </TouchableOpacity> */}

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
    alignItems: "center",
    paddingTop: 24,
  },

  stripContainer: {
    backgroundColor: "white",
    shadowColor: "grey",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 6,
    gap: 2,
    marginBottom: 100,
    padding: 8,
  },

  photoWrapper: {
    width: PHOTO_HEIGHT,
    height: PHOTO_WIDTH,
    alignSelf: "center",
    margin: 6,
  },

  photo: {
    width: "100%",
    height: "100%",
  },

  captionText: {
    fontFamily: "AmaticSC_700Bold",
    fontSize: 24,
    color: "black",
    textAlign: "center",
    paddingBottom: 20,
  },

  photo: {
    width: "100%",
    height: "100%",
  },

  actionButton: {
    backgroundColor: "black",
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 30,
    alignItems: "center",
  },

  actionButtonText: {
    color: "white",
    fontWeight: 600,
    fontSize: 16,
  },

  localButton: {
    backgroundColor: "black",
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
    bottom: 24,
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
