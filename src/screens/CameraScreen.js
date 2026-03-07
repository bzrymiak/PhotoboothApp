import { CameraView, useCameraPermissions } from "expo-camera";
import { useRef, useState } from "react";
import { StyleSheet, Text, Button, TouchableOpacity, View } from "react-native";
import { usePhotos } from "../context/PhotoContext";

export default function CameraScreen() {
  const [facing, setFacing] = useState("back");
  const [permission, requestPermission] = useCameraPermissions();
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [showSuccessText, setShowSuccessText] = useState(false);

  const cameraRef = useRef(null);

  // pull addPhoto from context instead of props
  const { addPhoto } = usePhotos();

  if (!permission) return <View />; //render blank screen while asking for perms
  if (!permission.granted) {
    return (
      <View style={styles.screenContainer}>
        <Text style={{ textAlign: "center", marginBottom: 20 }}>
          We need your permission to show the camera.
        </Text>
        <Button onPress={requestPermission} title="Grant Permission" />
        <View style={{ marginTop: 20 }}>
          <Button
            title="Back to Home"
            onPress={() => NavigationActivation.goBack()}
            color="red"
          />
        </View>
      </View>
    );
  }

  //change camera to front or back
  const toggleCamera = () =>
    setFacing((current) => (current === "back" ? "front" : "back"));

  //function to take picture
  async function takePicture() {
    if (cameraRef.current && isCameraReady) {
      try {
        const photo = await cameraRef.current.takePictureAsync({
          base64: true,
          quality: 0.5,
        });
        const base64Image = `data:image/jpg;base64,${photo.base64}`;

        addPhoto(base64Image);

        //show success message, hide after 1 second
        setShowSuccessText(true);
        setTimeout(() => {
          setShowSuccessText(false);
        }, 1000);
      } catch (error) {
        console.log("Capture error: ", error);
      }
    }
  }

  return (
    <View style={{ flex: 1, backgroundColor: "black" }}>
      <CameraView
        style={StyleSheet.absoluteFill}
        facing={facing}
        ref={cameraRef}
        onCameraReady={() => setIsCameraReady(true)}
      />

      {/* Success toast */}
      {showSuccessText && (
        <View style={styles.toastContainer}>
          <Text style={styles.toastText}>Photo Saved!</Text>
        </View>
      )}

      {/* Bottom controls */}
      <View style={styles.cameraOverlay}>
        <View style={styles.sideControl} />
        <TouchableOpacity
          style={[styles.snapButton, !isCameraReady && { opacity: 0.5 }]}
          onPress={takePicture}
          disabled={!isCameraReady}
        >
          <Text style={styles.camButtonText}>Snap</Text>
        </TouchableOpacity>
        <View style={styles.sideControl}>
          <TouchableOpacity style={styles.camButton} onPress={toggleCamera}>
            <Text style={styles.camButtonText}>Flip</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({});
