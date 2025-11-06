import * as Linking from "expo-linking";
import { StyleSheet, Text, View } from "react-native";
import LargeButton from "../../../components/ui/LargeButton.jsx";
import { Globals } from "../../../constants/globals";

export default function AboutSettingsContent() {
  return (
    <View style={styles.container}>
      <Text style={styles.description}>
        Solace is a gamified wellness app that helps iron workers, who face a
        lot of physical strain, recover their well-being.
      </Text>
      <Text style={styles.description}>
        Iron workers face intense strain and long hours that lead to pain,
        stress, and unhealthy coping habits, while most wellness apps ignore
        their realities. Solace gamifies recovery with exercises, mindfulness
        tools, and an AI mascot that makes self-care simple, engaging, and
        stigma-free, helping workers build lasting, healthy habits.
      </Text>

      <View style={styles.infoSection}>
        <Text style={styles.infoLabel}>Version:</Text>
        <Text style={styles.infoValue}>1.0.0</Text>
      </View>

      <View style={styles.infoSection}>
        <Text style={styles.infoLabel}>Developer:</Text>
        <Text style={styles.infoValue}>Solace Development Team</Text>
      </View>

      <View style={styles.infoSection}>
        <Text style={styles.infoLabel}>Release Date:</Text>
        <Text style={styles.infoValue}>December 2025</Text>
      </View>

      {/* Add more about content here */}
      <View style={styles.bottomSection}>
        <LargeButton
          label="Visit Our Website"
          onPress={() => {
            Linking.openURL("https://solace-promo.vercel.app/");
          }}
        />
      </View>
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
  bottomSection: {
    flex: 1,
    justifyContent: "flex-end",
    marginTop: 80,
  },
});
