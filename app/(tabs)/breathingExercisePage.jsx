import { StyleSheet, Text, View } from "react-native";
import { useState } from "react";
import BackButton from "../../components/ui/BackButton";

function BreathingExercisePage() {
  const [isBreathing, setIsBreathing] = useState(false);

  const startBreathing = () => {
    setIsBreathing(true);
  };

  const stopBreathing = () => {
    setIsBreathing(false);
  };

  return (
    <View style={styles.page}>
        <BackButton style={styles.backButton} onPress={() => {/* Handle back navigation */}} />
        <View style={styles.container}>
          <Text style={styles.title}>Breathing Exercise</Text>
        </View>
    </View>
  );
}

const styles = StyleSheet.create({
    page: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    color: "#333",
  },
  backButton: {
    marginTop: 32,
    marginLeft: 25.5,
  },
});

export default BreathingExercisePage;
