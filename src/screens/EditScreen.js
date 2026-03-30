import {
  View,
  Text,
  FlatList,
  Image,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useState } from "react";

const NUM_COLUMNS = 1;
const SCREEN_WIDTH = Dimensions.get("window").width;
const PHOTO_HEIGHT = SCREEN_WIDTH / 2.0;
const PHOTO_WIDTH = PHOTO_HEIGHT / 1.4;

export default function EditScreen({ route, navigation }) {
  const { photos } = route.params;
  const [caption, setCaption] = useState("");

  const handleNext = () => {
    // Pass both photos and caption to PhotostripScreen
    navigation.navigate("Photostrip", { photos, caption });
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.stripContainer}>
        {/* Photos */}
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

        <TextInput
          style={styles.captionInput}
          placeholder="add a caption..."
          placeholderTextColor="#aaa"
          value={caption}
          onChangeText={setCaption}
          maxLength={24}
        />
      </View>

      {/* Bottom action buttons */}
      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.actionButtonText}>Retake</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.nextButton]}
          onPress={handleNext}
        >
          <Text style={[styles.actionButtonText, styles.nextButtonText]}>
            Next
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
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
    padding: 0,
  },

  photoWrapper: {
    width: PHOTO_HEIGHT,
    height: PHOTO_WIDTH,
    alignSelf: "center",
    margin: 12,
    marginBottom: 2,
  },

  photo: {
    width: "100%",
    height: "100%",
  },

  // Extra space at the bottom of the strip for the caption
  captionArea: {
    width: PHOTO_HEIGHT,
    height: 60,
    alignSelf: "center",
    justifyContent: "center",
    paddingHorizontal: 10,
    paddingBottom: 40,
  },

  captionInput: {
    fontSize: 14,
    color: "black",
    textAlign: "center",
    paddingBottom: 32,
  },

  actions: {
    position: "absolute",
    bottom: 20,
    width: SCREEN_WIDTH,
    flexDirection: "row",
    justifyContent: "center",
    gap: 16,
    paddingHorizontal: 30,
  },

  actionButton: {
    flex: 1,
    backgroundColor: "white",
    paddingVertical: 12,
    borderRadius: 30,
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "black",
  },

  nextButton: {
    backgroundColor: "black",
  },

  actionButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "black",
  },

  nextButtonText: {
    color: "white",
  },
});
