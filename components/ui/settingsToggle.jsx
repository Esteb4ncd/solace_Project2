import { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import IonIcon from "react-native-vector-icons/Ionicons";

function SettingsToggle({ icon, label, onToggle, initialValue, containerStyle }) {
  const [isEnabled, setIsEnabled] = useState(initialValue);

  const handleToggle = () => {
    const newValue = !isEnabled;
    setIsEnabled(newValue);
    if (onToggle) {
      onToggle(newValue);
    }
  };

  return (
    <View style={[styles.container, containerStyle]}>
      <IonIcon
        name={icon}
        size={24}
        color="#443E82"
        style={{ marginRight: 12 }}
      />
      <Text style={styles.label}>{label}</Text>
      <TouchableOpacity
        onPress={handleToggle}
        style={[
          styles.toggleButton,
          isEnabled ? styles.toggleActive : styles.toggleInactive,
        ]}
      >
        <View
          style={[
            styles.toggleCircle,
            isEnabled ? styles.circleActive : styles.circleInactive,
          ]}
        />
      </TouchableOpacity>
    </View>
  );
}

export default SettingsToggle;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 20,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: "#7267D9",
    marginBottom: 10,
    borderRadius: 24,
  },
  label: {
    flex: 1,
    fontSize: 16,

    color: "#333",
  },
  toggleButton: {
    width: 32,
    height: 18,
    borderRadius: 9,
    padding: 1,
    justifyContent: "center",
  },
  toggleActive: {
    backgroundColor: "#7267D9",
    alignItems: "flex-end",
  },
  toggleInactive: {
    backgroundColor: "#565656",
    alignItems: "flex-start",
  },
  toggleCircle: {
    width: 16,
    height: 16,
    borderRadius: 8,
  },
  circleActive: {
    backgroundColor: "white",
  },
  circleInactive: {
    backgroundColor: "white",
  },
});
