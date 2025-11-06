import { StyleSheet, Text, View } from "react-native";
import { Globals } from "../../../constants/globals";

export default function AccessibilitySettingsContent() {
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
    fontFamily: Globals.fonts.weights.bold,
    color: "#000",
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    fontFamily: Globals.fonts.weights.regular,
    color: "#666",
    lineHeight: 24,
  },
});
