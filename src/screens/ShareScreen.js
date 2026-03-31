import {
  View,
  Image,
  TouchableOpacity,
  Text,
  StyleSheet,
  Dimensions,
  Share,
} from "react-native";
import * as FileSystem from "expo-file-system/legacy";

const SCREEN_WIDTH = Dimensions.get("window").width;
const STRIP_WIDTH = SCREEN_WIDTH * 0.75;
const STRIP_HEIGHT = STRIP_WIDTH * 1.8;

export default function ShareScreen({ route }) {
  const { strip } = route.params;

  const handleShare = async () => {
    try {
      const localPath = await FileSystem.downloadAsync(
        //download img from firebase onto local cache so we can share to certain apps like Instagram
        strip.url, //the firebase url
        FileSystem.cacheDirectory + "photostrip.png", //temporary local file
      );
      // share.share() opens native share on iOS
      await Share.share({
        url: localPath.uri, //shares the local file, not the remote firebase URL
      });
    } catch (error) {
      console.error("Share failed:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: strip.url }}
        style={styles.stripImage}
        resizeMode="contain"
      />
      <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
        <Text style={styles.shareButtonText}>Share</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#550d32",
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 0,
    gap: 24,
  },

  stripImage: {
    width: STRIP_WIDTH,
    height: STRIP_HEIGHT,
  },

  shareButton: {
    backgroundColor: "black",
    paddingVertical: 16,
    paddingHorizontal: 48,
    borderRadius: 30,
  },

  shareButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});
