import { CameraView, useCameraPermissions } from "expo-camera";
import * as MediaLibrary from "expo-media-library";
import { useRef, useState } from "react";
import {
  StyleSheet,
  Text,
  Image,
  Button,
  TouchableOpacity,
  View,
} from "react-native";
import { usePhotos } from "../context/PhotoContext";

export default function CameraScreen({ navigation }) {
  const [facing, setFacing] = useState("back");
  const [permission, requestPermission] = useCameraPermissions();
  const [mediaPermission, requestMediaPermission] = MediaLibrary.usePermissions();
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [previewPhoto, setPreviewPhoto] = useState(null); // Holds the taken photo

  const cameraRef = useRef(null);
  const { addPhoto } = usePhotos();

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

  function saveToApp() {
    const base64Image = `data:image/jpg;base64,${previewPhoto.base64}`;
    addPhoto(base64Image);
    setPreviewPhoto(null); // go back to camera after saving to app
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

  if (previewPhoto) {
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
        <View style={styles.previewActions}>
          <TouchableOpacity style={styles.actionButton} onPress={saveToApp}>
            <Text style={styles.actionButtonText}>Save to App</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.actionButton, styles.localButton]} onPress={saveLocally}>
            <Text style={styles.actionButtonText}>Save to Phone</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
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
          onPress={takePicture}
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