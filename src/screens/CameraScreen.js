import { CameraView, useCameraPermissions } from "expo-camera";
import * as MediaLibrary from "expo-media-library";
import { useRef, useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  Image,
  Button,
  TouchableOpacity,
  View,
} from "react-native";
import { useIsFocused } from "@react-navigation/native";
// import { usePhotos } from "../context/PhotoContext";

export default function CameraScreen({ navigation }) {
  const [facing, setFacing] = useState("back"); // handle camera orientation
  const [permission, requestPermission] = useCameraPermissions();
  const [mediaPermission, requestMediaPermission] =
    MediaLibrary.usePermissions();
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [previewPhoto, setPreviewPhoto] = useState(null); // Holds the taken photo
  const [photos, setPhotos] = useState([]); // holds up to 3 base64 images locally
  const [counter, setCounter] = useState(3); // photo preview timer

  const cameraRef = useRef(null);
  // const { addPhoto } = usePhotos();
  // const { photos } = usePhotos();

  // check if user is on the page
  const isFocused = useIsFocused();

  // timer function for the photo preview
  function timer() {
    setCounter(3);
    const id = setInterval(() => {
      setCounter((prev) => {
        if (prev <= 1) {
          clearInterval(id);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }

  // make sure camera permission is granted
  if (!permission) return <View />;
  if (!permission.granted) {
    return (
      <View style={styles.screenContainer}>
        <Text style={{ textAlign: "center", marginBottom: 20 }}>
          We need your permission to show the camera.
        </Text>
        <Button onPress={requestPermission} title="Grant Permission" />
      </View>
    );
  }

  const toggleCamera = () =>
    setFacing((current) => (current === "back" ? "front" : "back"));

  // Take a picture and show preview
  async function takePicture() {
    if (cameraRef.current && isCameraReady) {
      try {
        const photo = await cameraRef.current.takePictureAsync({
          base64: true,
          quality: 0.5,
        });
        setPreviewPhoto(photo); // Show preview screen
      } catch (error) {
        console.log("Capture error: ", error);
      }
    }
  }

  // const takePhoto = async () => {
  //   if (cameraRef.current) {
  //     const result = await cameraRef.current.takePictureAsync({ quality: 0.7 });
  //     setPhoto(result.uri);
  //   }
  // };

  // function saveToApp() {
  //   const base64Image = `data:image/jpg;base64,${previewPhoto.base64}`;
  //   addPhoto(base64Image);
  //   setPreviewPhoto(null);
  //   if (photos.length + 1 === 3) navigation.navigate("Photostrip");
  // }

  function saveToApp() {
    const base64Image = `data:image/jpg;base64,${previewPhoto.base64}`;
    const updatedPhotos = [...photos, base64Image];
    setPhotos(updatedPhotos);

    // Once we have 3 photos, pass them to PhotostripScreen via nav params
    if (updatedPhotos.length === 3) {
      navigation.navigate("Photostrip", { photos: updatedPhotos });
      setPhotos([]); // reset for next strip
    }
  }

  // Save to device camera roll
  async function saveLocally() {
    if (!mediaPermission?.granted) {
      const { granted } = await requestMediaPermission();
      if (!granted) {
        console.log("Media library permission not granted");
        return;
      }
    }
    await MediaLibrary.saveToLibraryAsync(previewPhoto.uri);
    setPreviewPhoto(null);
  }

  // Discard photo and go back to camera
  function discardPhoto() {
    setPreviewPhoto(null);
  }

  // preview screen --> only triggers after a photo is taken
  if (previewPhoto) {
    if (counter == 0) {
      setPreviewPhoto(null);
      saveToApp();
    }

    return (
      <View style={styles.previewContainer}>
        <Image
          source={{ uri: previewPhoto.uri }}
          style={StyleSheet.absoluteFill}
          resizeMode="cover"
        />

        {/* Discard button top left */}
        <TouchableOpacity style={styles.discardButton} onPress={discardPhoto}>
          <Text style={styles.discardText}>✕</Text>
        </TouchableOpacity>

        {/* Bottom action buttons */}
        <View style={styles.counterContainer}>
          <Text style={styles.counterText}>Preview ends in {counter}...</Text>
        </View>

        <View style={styles.previewActions}>
          <View style={styles.photoButton}>
            <Text style={styles.photoCounterText}>
              Photos: {photos.length + 1} / 3
            </Text>
          </View>

          {/* <TouchableOpacity style={styles.actionButton} onPress={saveToApp}>
            <Text style={styles.actionButtonText}>Save to App</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.localButton]}
            onPress={saveLocally}
          >
            <Text style={styles.actionButtonText}>Save to Phone</Text>
          </TouchableOpacity> */}
        </View>
      </View>
    );
  }

  // MAIN CAMERA RENDERING
  return (
    // only render the camera when the user is actively on this page
    isFocused && (
      <View style={{ flex: 1, backgroundColor: "black" }}>
        <CameraView
          style={StyleSheet.absoluteFill}
          facing={facing}
          ref={cameraRef}
          onCameraReady={() => setIsCameraReady(true)}
        />

        {/* Bottom controls */}
        <View style={styles.cameraOverlay}>
          <View style={styles.sideControl} />

          <TouchableOpacity
            style={[styles.snapButton, !isCameraReady && { opacity: 0.5 }]}
            onPress={() => {
              takePicture();
              timer(); // trigger the timer so the photo preview only shows for a few seconds
            }}
            disabled={!isCameraReady}
          />

          <View style={styles.sideControl}>
            <TouchableOpacity style={styles.flipButton} onPress={toggleCamera}>
              <Image
                style={styles.flipButtonImg}
                source={require("../../assets/flipButtonIcon.png")}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    )
  );
}

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },

  previewContainer: {
    flex: 1,
    backgroundColor: "black",
  },

  discardButton: {
    position: "absolute",
    top: 30,
    left: 20,
    backgroundColor: "rgba(0,0,0,0.6)",
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },

  discardText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },

  previewActions: {
    position: "absolute",
    bottom: 40,
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
    gap: 16,
    paddingHorizontal: 20,
  },

  actionButton: {
    flex: 1,
    backgroundColor: "rgba(255,255,255,0.9)",
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: "center",
  },

  localButton: {
    backgroundColor: "rgba(255,255,255,0.5)",
  },

  actionButtonText: {
    fontSize: 15,
    fontWeight: "600",
    color: "black",
  },

  photoButton: {
    backgroundColor: "rgba(255,255,255,0.9)",
    paddingVertical: 14,
    borderRadius: 30,
    width: 120,
    alignItems: "center",
  },

  photoCounterText: {
    fontSize: 15,
    fontWeight: "600",
    color: "black",
  },

  counterContainer: {
    position: "absolute",
    bottom: 100,
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
    gap: 16,
    paddingHorizontal: 20,
  },

  counterText: {
    color: "white",
    fontWeight: 600,
  },

  // ── Camera styles ──
  cameraOverlay: {
    position: "absolute",
    bottom: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    paddingHorizontal: 30,
    paddingBottom: 30,
    zIndex: 10,
  },

  sideControl: {
    width: 60,
    alignItems: "center",
  },

  snapButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 4,
    borderColor: "white",
  },

  flipButton: {
    backgroundColor: "rgba(255,255,255,0.5)",
    paddingVertical: "20%",
    paddingHorizontal: "20%",
    borderRadius: 35,
  },

  flipButtonImg: {
    tintColor: "white",
    width: 28,
    height: 28,
  },
});
