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

const CROP_HEIGHT = 300;

export default function CameraScreen({ navigation }) {
  const [facing, setFacing] = useState("back"); // handle camera orientation
  const [permission, requestPermission] = useCameraPermissions();
  const [mediaPermission, requestMediaPermission] =
    MediaLibrary.usePermissions();
  const [isCameraReady, setIsCameraReady] = useState(false);
  // const [previewPhoto, setPreviewPhoto] = useState(null); // Holds the taken photo
  const [photos, setPhotos] = useState([]); // holds up to 3 base64 images locally
  // const [counter, setCounter] = useState(3);

  const cameraRef = useRef(null);
  const isFocused = useIsFocused(); // check if user is on the page

  // navigate away when all 3 photos have been taken
  useEffect(() => {
    if (photos.length === 3) {
      const snapshot = [...photos];
      setPhotos([]); // reset for next strip
      navigation.navigate("Add a Caption", { photos: snapshot });
    }
  }, [photos]);

  //timer function for the photo preview
  // function timer() {
  //   setCounter(3);
  //   const id = setInterval(() => {
  //     setCounter((prev) => {
  //       if (prev <= 1) {
  //         clearInterval(id);
  //         return 0;
  //       }
  //       return prev - 1;
  //     });
  //   }, 1000);
  // }

  // ask for camera permission
  if (!permission || !permission.granted) {
    return (
      <View style={styles.screenContainer}>
        <Text style={{ textAlign: "center", marginBottom: 20 }}>
          We need your permission to show the camera.
        </Text>
        <Button onPress={requestPermission} title="Grant Permission" />
      </View>
    );
  }

  //toggle camera
  const toggleCamera = () =>
    setFacing((current) => (current === "back" ? "front" : "back"));

  //take photo
  async function takePicture() {
    if (cameraRef.current && isCameraReady) {
      try {
        const photo = await cameraRef.current.takePictureAsync({
          base64: true,
          quality: 0.5,
        });
        const base64Image = `data:image/jpg;base64,${photo.base64}`;
        setPhotos((prev) => [...prev, base64Image]);
      } catch (error) {
        console.log("Capture error: ", error);
      }
    }
  }

  // function saveToApp() {
  //   const base64Image = `data:image/jpg;base64,${previewPhoto.base64}`;
  //   const updatedPhotos = [...photos, base64Image];
  //   setPhotos(updatedPhotos);
  // }

  // Save to device camera roll
  // async function saveLocally() {
  //   if (!mediaPermission?.granted) {
  //     const { granted } = await requestMediaPermission();
  //     if (!granted) {
  //       console.log("Media library permission not granted");
  //       return;
  //     }
  //   }
  //   await MediaLibrary.saveToLibraryAsync(previewPhoto.uri);
  //   setPreviewPhoto(null);
  // }

  // MAIN CAMERA RENDERING
  return (
    // only render the camera when the user is actively on this page
    isFocused ? (
      <View style={{ flex: 1, backgroundColor: "black" }}>
        <CameraView
          style={StyleSheet.absoluteFill}
          facing={facing}
          ref={cameraRef}
          onCameraReady={() => setIsCameraReady(true)}
        />
        {/* thumbnail photo preview */}
        {photos.length > 0 && (
          <TouchableOpacity
            style={styles.thumbnailContainer}
            onPress={() => {
              console.log("last photo taken");
            }}
          >
            <Image
              source={{ uri: photos[photos.length - 1] }}
              style={styles.thumbnail}
            />
          </TouchableOpacity>
        )}
        <View style={styles.photoButton}>
          <Text style={styles.photoCounterText}>{photos.length + 1} / 3</Text>
        </View>
        <View style={styles.cropOverlay} pointerEvents="none">
          <View style={styles.cropDimTop} />
          <View style={styles.cropWindow} />
          <View style={styles.cropDimBottom} />
        </View>
        {/* Bottom controls */}
        <View style={styles.cameraOverlay}>
          <View style={styles.sideControl} />

          <TouchableOpacity
            style={[styles.snapButton, !isCameraReady && { opacity: 0.5 }]}
            onPress={() => {
              takePicture();
              // timer(); // trigger the timer so the photo preview only shows for a few seconds
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
    ) : null
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

  thumbnailContainer: {
    position: "absolute",
    bottom: 62, // sits above the camera controls
    left: 30,
    zIndex: 20,
  },

  thumbnail: {
    width: 80,
    height: 60,
    borderRadius: 10,
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
    position: "absolute",
    top: 16,
    alignSelf: "center",
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 30,
    zIndex: 20,
  },

  photoCounterText: {
    fontSize: 15,
    fontWeight: "500",
    color: "white",
  },

  // counterContainer: {
  //   position: "absolute",
  //   top: 16, // ← adjust to sit below the status bar
  //   right: 180,
  //   width: "100%",
  //   alignItems: "center",
  //   zIndex: 20,
  // },

  // counterText: {
  //   color: "white",
  //   fontSize: 20,
  //   fontWeight: 400,
  // },

  // ── Camera styles ──
  cameraOverlay: {
    position: "absolute",
    bottom: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    paddingHorizontal: 30,
    paddingBottom: 60,
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
    borderWidth: 3,
    borderColor: "white",
  },

  flipButton: {
    backgroundColor: "rgba(255,255,255,0.25)",
    paddingVertical: "20%",
    paddingHorizontal: "20%",
    borderRadius: 35,
  },

  flipButtonImg: {
    tintColor: "white",
    width: 28,
    height: 28,
  },

  cropOverlay: {
    ...StyleSheet.absoluteFillObject,
    flexDirection: "column",
    overflow: "hidden",
  },
  cropDimTop: {
    width: "100%",
    flex: 1,
    backgroundColor: "rgba(0,0,0)",
  },
  cropDimBottom: {
    width: "100%",
    flex: 1,
    backgroundColor: "rgba(0,0,0)",
  },

  cropWindow: {
    height: CROP_HEIGHT,
  },
});
