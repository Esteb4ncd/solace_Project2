import { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import IonIcons from "react-native-vector-icons/Ionicons";
import SettingsToggle from "../../../components/ui/settingsToggle.jsx";
import { Globals } from "../../../constants/globals";

export default function AccessibilitySettingsContent({
  darkMode: parentDarkMode,
  onDarkModeChange,
}) {
  const [darkMode, setDarkMode] = useState(
    parentDarkMode ?? Globals.userSettings?.darkMode ?? false
  );

  useEffect(() => {
    if (typeof parentDarkMode !== "undefined") {
      setDarkMode(parentDarkMode);
    }
  }, [parentDarkMode]);
  const [fontSizeIndex, setFontSizeIndex] = useState(1); // 0: Small, 1: Medium, 2: Large
  const fontSizes = ["Small", "Medium", "Large"];
  const fontValues = [14, 16, 20];

  const decreaseFontSize = () => {
    if (fontSizeIndex > 0) {
      setFontSizeIndex(fontSizeIndex - 1);
    }
  };

  const increaseFontSize = () => {
    if (fontSizeIndex < fontSizes.length - 1) {
      setFontSizeIndex(fontSizeIndex + 1);
    }
  };

  return (
    <View style={[styles.container, darkMode && styles.containerDark]}>
      <Text style={styles.description}>
        Customize accessibility features to improve your app experience.
      </Text>

      {/* Add more accessibility settings content here */}
      <SettingsToggle
        icon="moon"
        label="Dark Mode"
        onToggle={(val) => {
          setDarkMode(val);
          if (onDarkModeChange) onDarkModeChange(val);
          Globals.userSettings = {
            ...(Globals.userSettings || {}),
            darkMode: val,
          };
        }}
        initialValue={darkMode}
        containerStyle={darkMode ? { backgroundColor: "#EAE8F9" } : undefined}
      />
      <SettingsToggle
        icon="half-circle"
        label="High Contrast"
        onToggle={() => {}}
        initialValue={true}
        containerStyle={darkMode ? { backgroundColor: "#EAE8F9" } : undefined}
      />
      <SettingsToggle
        icon="moon"
        label="Colourblind"
        onToggle={() => {}}
        initialValue={true}
        containerStyle={darkMode ? { backgroundColor: "#EAE8F9" } : undefined}
      />

      <View
        style={[
          styles.fontSizeContainer,
          darkMode && { backgroundColor: "#EAE8F9" },
        ]}
      >
        <View style={styles.fontHeader}>
          <IonIcons name="text" size={24} color="#443E82" />
          <Text style={styles.fontSizeLabel}>Font Size</Text>
        </View>
        <View style={styles.fontControls}>
          <TouchableOpacity
            style={[
              styles.fontButton,
              fontSizeIndex === 0 && styles.disabledButton,
              { backgroundColor: darkMode ? "#7267D9" : "#EAE8F9" },
            ]}
            onPress={decreaseFontSize}
            disabled={fontSizeIndex === 0}
          >
            <Text style={[styles.fontButtonText, styles.smallA]}>A-</Text>
          </TouchableOpacity>

          <View style={styles.fontSizeDisplay}>
            <Text style={styles.fontSizeValue}>{fontSizes[fontSizeIndex]}</Text>
            <Text
              style={[
                styles.fontPreview,
                { fontSize: fontValues[fontSizeIndex] },
              ]}
            >
              Sample text
            </Text>
          </View>

          <TouchableOpacity
            style={[
              styles.fontButton,
              fontSizeIndex === fontSizes.length - 1 && styles.disabledButton,
              { backgroundColor: darkMode ? "#7267D9" : "#EAE8F9" },
            ]}
            onPress={increaseFontSize}
            disabled={fontSizeIndex === fontSizes.length - 1}
          >
            <Text style={[styles.fontButtonText, styles.largeA]}>A+</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  containerDark: {
    backgroundColor: "#1D1E1D",
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
  fontSizeContainer: {
    paddingVertical: 20,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: "#7267D9",
    marginTop: 10,
    borderRadius: 24,
  },
  fontHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  fontSizeLabel: {
    fontSize: 16,
    fontFamily: Globals.fonts.weights.regular,
    color: "#000000",
    marginLeft: 12,
  },
  fontControls: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  fontButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#EAE8F9",
    alignItems: "center",
    justifyContent: "center",
  },
  disabledButton: {
    backgroundColor: "#E0E0E0",
  },
  fontButtonText: {
    fontSize: 16,
    fontFamily: Globals.fonts.weights.bold,
    color: "white",
  },
  smallA: {
    fontSize: 14,
  },
  largeA: {
    fontSize: 18,
  },
  fontSizeDisplay: {
    flex: 1,
    alignItems: "center",
    marginHorizontal: 20,
  },
  fontSizeValue: {
    fontSize: 16,
    fontFamily: Globals.fonts.weights.semiBold,
    color: "#443E82",
    marginBottom: 8,
  },
  fontPreview: {
    fontFamily: Globals.fonts.weights.regular,
    color: "#666",
    textAlign: "center",
  },
});
