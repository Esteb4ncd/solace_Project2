import { StyleSheet, Text, View } from "react-native";
import { Globals } from "../../../constants/globals";
import SettingsToggle from "../../../components/ui/settingsToggle.jsx";

export default function NotificationSettingsContent() {
  return (
    <View style={styles.container}>
      <SettingsToggle
        icon="notifications"
        label="Enable Notifications"
        onToggle={() => {}}
        initialValue={true}
      />

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
