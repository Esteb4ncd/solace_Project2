import { StyleSheet, Text, View } from "react-native";

export default function GeneralSettingsContent() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>General Settings</Text>
      <Text style={styles.description}>
        Configure your general app preferences and settings.
      </Text>

      {/* Add more general settings content here */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
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
