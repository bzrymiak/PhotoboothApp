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
import { useRef, useState, useLayoutEffect } from "react";
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

//set strip colours
const STRIP_COLORS = [
  "#FFFFFF",
  "#FFE5D4",
  "#FBD5FF",
  "#DFEFFF",
  "#EBFFDF",
  "#FFDFE6",
];

export default function PhotostripScreen({ route, navigation }) {
  const { photos, caption } = route.params; //images and caption passed from CameraScreen
  const snapshotRef = useRef();
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [stripColor, setStripColor] = useState("#FFFFF"); //default strip is white
  const [fontsLoaded] = useFonts({
    AmaticSC_700Bold,
  });

  // make the back button named "back" instead of the previous screen's name
  useLayoutEffect(() => {
    navigation.setOptions({
      headerBackTitle: "Back",
    });
  }, [navigation]);

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
      navigation.reset({
        index: 0,
        routes: [{ name: "Camera" }],
      }); //reset camera stack back to cameraScreen
      navigation.getParent().navigate("GalleryTab", { screen: "Gallery" }); //navigate to gallery after saved successfully
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

    const filename = `photostrips/${uid}/${Date.now()}.png`;
    const reference = ref(firebase_storage, filename);
    const response = await fetch(photoPath);
    const blob = await response.blob();
    await uploadBytes(reference, blob);
    const downloadURL = await getDownloadURL(reference);

    const docRef = await addDoc(collection(firebase_db, "photostrips"), {
      uid,
      url: downloadURL,
      storagePath: filename,
      createdAt: serverTimestamp(),
    });

    console.log("Photostrip saved to Firebase with ID:", docRef.id);
  }

  return (
    <View style={styles.container}>
      {/* Photostrip - standalone, this is what gets snapshotted */}
      <View
        ref={snapshotRef}
        collapsable={false}
        style={[styles.stripContainer, { backgroundColor: stripColor }]}
      >
        <FlatList
          data={photos}
          keyExtractor={(_, index) => index.toString()}
          numColumns={NUM_COLUMNS}
          scrollEnabled={false}
          contentContainerStyle={{ gap: 0, padding: 0 }}
          renderItem={({ item }) => (
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

      {/* Colour picker dots - absolutely positioned to the left of the strip */}
      <View style={styles.colorPicker}>
        {STRIP_COLORS.map((color) => (
          <TouchableOpacity
            key={color}
            onPress={() => setStripColor(color)}
            style={[
              styles.colorDot,
              { backgroundColor: color },
              stripColor === color && styles.colorDotSelected,
            ]}
          />
        ))}
      </View>

      {/* Save button */}
      <View style={styles.previewActions}>
        <TouchableOpacity
          style={[styles.actionButton, styles.localButton]}
          onPress={snapshot}
          disabled={saving || saved}
        >
          <Text style={styles.actionButtonText}>
            {saved ? "Saved!" : "Save to Gallery"}
          </Text>
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

  stripWrapper: {
    position: "relative",
    alignItems: "center",
    marginBottom: 100,
  },

  //color picker styling
  colorPicker: {
    position: "absolute",
    left: 28,
    top: "25%",
    gap: 10,
    alignItems: "center",
  },

  colorDot: {
    width: 32,
    height: 32,
    borderRadius: 24,
    shadowColor: "#ccc",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 2,
    borderWidth: 0.5,
    borderColor: "#ccc",
  },

  colorDotSelected: {
    borderWidth: 1.5,
    borderColor: "#ccc",
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
