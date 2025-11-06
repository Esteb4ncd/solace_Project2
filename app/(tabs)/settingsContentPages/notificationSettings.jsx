import { StyleSheet, Text, View } from "react-native";
import { Globals } from "../../../constants/globals";

export default function NotificationSettingsContent() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Notification Settings</Text>
      <Text style={styles.description}>
        Manage your notification preferences and settings.
      </Text>

      {/* Add more notification settings content here */}
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
