import { View, Text, StyleSheet } from "react-native";

export default function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.header}>Recent Photostrips</Text>
        <View style={styles.placeholderRow}>
          <View style={styles.placeholder}></View>
          <View style={styles.placeholder}></View>
          <View style={styles.placeholder}></View>
        </View>
      </View>

      <View>
        <Text style={styles.header}>Browse Themes</Text>
        <View style={styles.placeholderRow}>
          <View style={styles.placeholder}></View>
          <View style={styles.placeholder}></View>
          <View style={styles.placeholder}></View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    padding: 16,
    paddingTop: 30,
    display: "flex",
    gap: 32,
  },
  header: {
    fontSize: 18,
    fontWeight: 600,
    marginBottom: 16,
  },
  placeholder: {
    backgroundColor: "#ccc",
    width: 120,
    height: 255,
  },
  placeholderRow: {
    display: "flex",
    flexDirection: "row",
    gap: 16,
  },
});
