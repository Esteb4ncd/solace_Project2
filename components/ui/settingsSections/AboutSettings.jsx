import { StyleSheet, Text, View } from "react-native";

export default function AboutSettings() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>About</Text>
      <Text style={styles.description}>
        Learn more about the Solace Project app.
      </Text>

      <View style={styles.infoSection}>
        <Text style={styles.infoLabel}>Version:</Text>
        <Text style={styles.infoValue}>1.0.0</Text>
      </View>

      <View style={styles.infoSection}>
        <Text style={styles.infoLabel}>Developer:</Text>
        <Text style={styles.infoValue}>Solace Team</Text>
      </View>

      {/* Add more about content here */}
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
    marginBottom: 20,
  },
  infoSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  infoLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  infoValue: {
    fontSize: 16,
    color: "#666",
  },
});
