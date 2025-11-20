import { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import IonIcon from "react-native-vector-icons/Ionicons";

function SettingsToggle({
  icon,
  label,
  onToggle,
  initialValue = false,
  value,
  highContrast = false,
  accessibilityLabel: customA11yLabel,
}) {
  const isControlled = typeof value === "boolean";
  const [internalValue, setInternalValue] = useState(
    isControlled ? value : initialValue
  );
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    if (isControlled) {
      setInternalValue(value);
    }
  }, [isControlled, value]);

  useEffect(() => {
    if (!isControlled) {
      setInternalValue(initialValue);
    }
  }, [initialValue, isControlled]);

  const handleToggle = () => {
    const newValue = !internalValue;
    if (!isControlled) {
      setInternalValue(newValue);
    }
    if (onToggle) {
      onToggle(newValue);
    }
  };

  const handleKeyPress = (event) => {
    const key = event?.nativeEvent?.key;
    if (key === " " || key === "Enter") {
      event.preventDefault?.();
      handleToggle();
    }
  };

  const iconColor = highContrast ? "#000000" : "#443E82";
  const containerStyle = [
    styles.container,
    highContrast && styles.highContrastContainer,
  ];
  const labelStyle = [styles.label, highContrast && styles.highContrastLabel];
  const toggleStyle = [
    styles.toggleButton,
    internalValue ? styles.toggleActive : styles.toggleInactive,
    highContrast &&
      (internalValue
        ? styles.highContrastToggleActive
        : styles.highContrastToggleInactive),
    isFocused && styles.toggleFocused,
  ];
  const circleStyle = [
    styles.toggleCircle,
    internalValue ? styles.circleActive : styles.circleInactive,
    highContrast &&
      (internalValue
        ? styles.highContrastCircleActive
        : styles.highContrastCircleInactive),
  ];
  const accessibilityLabel = customA11yLabel || label;

  return (
    <View style={containerStyle}>
      <IonIcon
        name={icon}
        size={24}
        color={iconColor}
        style={{ marginRight: 12 }}
      />
      <Text style={labelStyle}>{label}</Text>
      <TouchableOpacity
        accessible
        accessibilityRole="switch"
        accessibilityLabel={accessibilityLabel}
        accessibilityState={{ checked: internalValue }}
        focusable
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        onKeyPress={handleKeyPress}
        onPress={handleToggle}
        style={toggleStyle}
      >
        <View style={circleStyle} />
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
  toggleFocused: {
    shadowColor: "#000000",
    shadowOpacity: 0.3,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 1 },
    elevation: 4,
  },
  highContrastContainer: {
    borderWidth: 2,
    borderColor: "#000000",
    backgroundColor: "#FFFFFF",
  },
  highContrastLabel: {
    color: "#000000",
    fontWeight: "600",
  },
  highContrastToggleActive: {
    backgroundColor: "#000000",
    borderWidth: 2,
    borderColor: "#000000",
  },
  highContrastToggleInactive: {
    backgroundColor: "#000000",
    borderWidth: 2,
    borderColor: "#000000",
    alignItems: "flex-start",
  },
  highContrastCircleActive: {
    backgroundColor: "#FFFFFF",
  },
  highContrastCircleInactive: {
    backgroundColor: "#FFFFFF",
  },
});
