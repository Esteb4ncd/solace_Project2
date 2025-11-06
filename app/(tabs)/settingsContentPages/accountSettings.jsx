import { StyleSheet, Text, View } from "react-native";
import { Globals } from "../../../constants/globals";

export default function AccountSettingsContent() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Account Settings</Text>
      <Text style={styles.description}>
        Manage your account information and preferences.
      </Text>

      <View style={styles.infoSection}>
        <Text style={styles.infoLabel}>Username:</Text>
        <Text style={styles.infoValue}>User123</Text>
      </View>

      <View style={styles.infoSection}>
        <Text style={styles.infoLabel}>Email:</Text>
        <Text style={styles.infoValue}>user123@example.com</Text>
      </View>

      {/* Add more account settings content here */}
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
    fontFamily: Globals.fonts.weights.semiBold,
    color: "#333",
  },
  infoValue: {
    fontSize: 16,
    fontFamily: Globals.fonts.weights.regular,
    color: "#666",
  },
});
