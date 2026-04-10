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
  Keyboard,
} from "react-native";
import {
  useState,
  useLayoutEffect,
  useEffect,
  useRef,
  useCallback,
} from "react";
import * as Font from "expo-font";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";

const NUM_COLUMNS = 1;
const SCREEN_WIDTH = Dimensions.get("window").width;
const PHOTO_HEIGHT = SCREEN_WIDTH / 2.0;
const PHOTO_WIDTH = PHOTO_HEIGHT / 1.4;

const API_KEY = process.env.EXPO_PUBLIC_GOOGLE_FONTS_API_KEY;

const FONT_NAMES = [
  "Instrument Serif",
  "Bitcount Single",
  "Chewy",
  "JetBrains Mono",
  "Anton",
  "Lobster",
  "Amatic SC",
  "Shadows Into Light Two",
  "Playpen Sans",
  "DynaPuff",
];

export default function EditScreen({ route, navigation }) {
  const { photos } = route.params;
  const [caption, setCaption] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [fonts, setFonts] = useState([]);
  const [loadedFonts, setLoadedFonts] = useState({});
  const [selectedFont, setSelectedFont] = useState(null);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [bgColor, setBgColor] = useState("#ffffff");
  const MAX_WIDTH = SCREEN_WIDTH - 40;
  const [textWidth, setTextWidth] = useState(0);
  const hiddenTextRef = useRef(null);

  useLayoutEffect(() => {
    navigation.setOptions({ headerBackTitle: "Back" });
  }, [navigation]);

  useFocusEffect(
    useCallback(() => {
      const loadColor = async () => {
        const storedColor = await AsyncStorage.getItem("profileBgColor");
        if (storedColor) setBgColor(storedColor);
      };

      loadColor();
    }, []),
  );

  useEffect(() => {
    fetchFonts();
  }, []);

  useEffect(() => {
    const show = Keyboard.addListener("keyboardWillShow", (e) => {
      setKeyboardHeight(e.endCoordinates.height);
    });
    const hide = Keyboard.addListener("keyboardWillHide", () => {
      setKeyboardHeight(0);
    });
    return () => {
      show.remove();
      hide.remove();
    };
  }, []);

  //grab fonts from google fonts api
  async function fetchFonts() {
    try {
      const response = await fetch(
        `https://www.googleapis.com/webfonts/v1/webfonts?key=${API_KEY}&sort=popularity`,
      );
      const data = await response.json();

      const filtered = data.items.filter((f) => FONT_NAMES.includes(f.family));
      const sorted = FONT_NAMES.map((name) =>
        filtered.find((f) => f.family === name),
      ).filter(Boolean);

      setFonts(sorted);

      if (sorted.length > 0) {
        await loadFont(sorted[0]);
        setSelectedFont(sorted[0].family);
      }
    } catch (error) {
      console.error("Failed to fetch fonts:", error);
    }
  }

  //load the fonts we chose
  async function loadFont(fontData) {
    const fontFamily = fontData.family;
    if (loadedFonts[fontFamily]) return;

    try {
      const url =
        fontData.files?.regular ||
        fontData.files?.["400"] ||
        Object.values(fontData.files)[0];

      const secureUrl = url.replace("http://", "https://"); //convert to https
      await Font.loadAsync({ [fontFamily]: { uri: secureUrl } });
      setLoadedFonts((prev) => ({ ...prev, [fontFamily]: true }));
    } catch (error) {
      console.error(`Failed to load font ${fontFamily}:`, error);
    }
  }

  async function handleSelectFont(fontData) {
    const fontFamily = fontData.family;
    console.log("tapped:", fontFamily);

    if (!loadedFonts[fontFamily]) {
      await loadFont(fontData);
    }

    setSelectedFont(fontFamily);
    setLoadedFonts((prev) => ({ ...prev, [fontFamily]: true }));
  }

  const handleNext = () => {
    navigation.navigate("Pick a Colour", { photos, caption, selectedFont });
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: bgColor }]}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={90}
    >
      <View style={styles.stripContainer}>
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
          style={[
            styles.captionInput,
            selectedFont && loadedFonts[selectedFont]
              ? { fontFamily: selectedFont }
              : null,
          ]}
          placeholder="add a caption..."
          placeholderTextColor="#aaa"
          value={caption}
          onChangeText={setCaption}
          maxLength={20}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
      </View>

      {isFocused && fonts.length > 0 && (
        <View style={[styles.fontPicker, { bottom: keyboardHeight - 60 }]}>
          <FlatList
            data={fonts}
            keyExtractor={(item) => item.family}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{ paddingHorizontal: 16, gap: 8 }}
            onViewableItemsChanged={({ viewableItems }) => {
              viewableItems.forEach(({ item }) => loadFont(item));
            }}
            viewabilityConfig={{ itemVisiblePercentThreshold: 50 }}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => handleSelectFont(item)}
                style={[
                  styles.fontOption,
                  selectedFont === item.family && styles.fontOptionSelected,
                ]}
              >
                <Text
                  style={[
                    styles.fontOptionText,
                    loadedFonts[item.family]
                      ? { fontFamily: item.family }
                      : null,
                  ]}
                >
                  {item.family}
                </Text>
              </TouchableOpacity>
            )}
          />
        </View>
      )}

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
    paddingBottom: 24,
  },

  stripContainer: {
    backgroundColor: "white",
    shadowColor: "grey",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 6,
    padding: 8,
    marginBottom: 100,
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

  captionInput: {
    fontSize: 20,
    color: "black",
    textAlign: "center",
    paddingBottom: 28,
    width: 212,
  },

  fontPicker: {
    position: "absolute",
    width: SCREEN_WIDTH,
    height: 44,
    justifyContent: "center",
    shadowColor: "#ccc",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 6,
    zIndex: 999,
  },

  fontOption: {
    paddingHorizontal: 16,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },

  fontOptionSelected: {
    backgroundColor: "#e5e5e5",
  },

  fontOptionText: {
    fontSize: 18,
    color: "black",
  },

  actions: {
    position: "absolute",
    bottom: 24,
    width: SCREEN_WIDTH,
    flexDirection: "row",
    justifyContent: "center",
    gap: 12,
    paddingHorizontal: 90,
  },

  actionButton: {
    flex: 1,
    backgroundColor: "white",
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: "center",
    borderWidth: 0.5,
    borderColor: "#grey",
    shadowColor: "#ccc",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 6,
  },

  nextButton: {
    backgroundColor: "black",
  },

  actionButtonText: {
    fontSize: 16,
    fontWeight: "500",
    color: "black",
  },

  nextButtonText: {
    color: "white",
  },
});
