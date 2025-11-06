import { StyleSheet, Text, View } from "react-native";
import { Globals } from "../../../constants/globals";
import SettingsToggle from "../../../components/ui/settingsToggle.jsx";

export default function GeneralSettingsContent() {
return (
    <View style={styles.container}>
        {/* Add more general settings content here */}
        <SettingsToggle icon="trash" label="Delete All Process & Data" onToggle={() => {}} />
        <SettingsToggle icon="sync-circle" label="Sync to other health app" onToggle={() => {}} />
    </View>
);
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
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
