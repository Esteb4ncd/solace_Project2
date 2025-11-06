import { StyleSheet, Text, View } from "react-native";

export default function AccessibilitySettings() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Accessibility Settings</Text>
      <Text style={styles.description}>
        Customize accessibility features to improve your app experience.
      </Text>

      {/* Add more accessibility settings content here */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    color: "#666",
    lineHeight: 24,
  },
});
