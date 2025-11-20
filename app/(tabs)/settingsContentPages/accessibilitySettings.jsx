import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import IonIcons from "react-native-vector-icons/Ionicons";
import SettingsToggle from "../../../components/ui/settingsToggle.jsx";
import { Globals } from "../../../constants/globals";
const HIGH_CONTRAST_STORAGE_KEY = "accessibility_high_contrast";

export default function AccessibilitySettingsContent({
  onHighContrastChange,
}) {
  const [fontSizeIndex, setFontSizeIndex] = useState(1); // 0: Small, 1: Medium, 2: Large
  const [highContrast, setHighContrast] = useState(false);
  const fontSizes = ["Small", "Medium", "Large"];
  const fontValues = [14, 16, 20];

  useEffect(() => {
    const loadHighContrastPreference = async () => {
      try {
        const storedValue = await AsyncStorage.getItem(
          HIGH_CONTRAST_STORAGE_KEY
        );
        if (storedValue !== null) {
          setHighContrast(storedValue === "true");
        }
      } catch (error) {
        console.warn("Failed to load high contrast preference", error);
      }
    };

    loadHighContrastPreference();
  }, []);

  useEffect(() => {
    if (onHighContrastChange) {
      onHighContrastChange(highContrast);
    }
  }, [highContrast, onHighContrastChange]);

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

  const handleHighContrastToggle = async (value) => {
    setHighContrast(value);
    try {
      await AsyncStorage.setItem(
        HIGH_CONTRAST_STORAGE_KEY,
        value ? "true" : "false"
      );
    } catch (error) {
      console.warn("Failed to save high contrast preference", error);
    }
  };

  const containerStyle = [
    styles.container,
    highContrast && styles.highContrastContainer,
  ];
  const descriptionStyle = [
    styles.description,
    highContrast && styles.highContrastDescription,
  ];
  const fontSizeContainerStyle = [
    styles.fontSizeContainer,
    highContrast && styles.highContrastFontSizeContainer,
  ];
  const fontSizeLabelStyle = [
    styles.fontSizeLabel,
    highContrast && styles.highContrastFontSizeLabel,
  ];
  const fontSizeValueStyle = [
    styles.fontSizeValue,
    highContrast && styles.highContrastFontSizeValue,
  ];
  const fontPreviewStyle = [
    styles.fontPreview,
    highContrast && styles.highContrastFontPreview,
  ];
  const fontButtonStyle = [
    styles.fontButton,
    highContrast && styles.highContrastFontButton,
  ];
  const disabledFontButtonStyle = [
    styles.fontButton,
    styles.disabledButton,
    highContrast && styles.highContrastDisabledButton,
  ];
  const fontButtonTextStyle = [
    styles.fontButtonText,
    highContrast && styles.highContrastFontButtonText,
  ];
  const disabledFontButtonTextStyle = [
    styles.fontButtonText,
    highContrast ? styles.highContrastFontButtonTextDisabled : styles.fontButtonText,
  ];
  const iconColor = highContrast ? "#000000" : "#443E82";

  return (
    <View style={containerStyle} accessibilityRole="main">
      <Text style={descriptionStyle}>
        Customize accessibility features to improve your app experience.
      </Text>

      {/* Add more accessibility settings content here */}
      <SettingsToggle
        icon="moon"
        label="Dark Mode"
        onToggle={() => {}}
        initialValue={false}
        highContrast={highContrast}
      />
      <SettingsToggle
        icon="half-circle"
        label="High Contrast"
        onToggle={handleHighContrastToggle}
        initialValue={highContrast}
        value={highContrast}
        highContrast={highContrast}
        accessibilityLabel="High contrast toggle"
      />
      <SettingsToggle
        icon="moon"
        label="Colourblind"
        onToggle={() => {}}
        initialValue={true}
        highContrast={highContrast}
      />

      <View style={fontSizeContainerStyle}>
        <View style={styles.fontHeader}>
          <IonIcons name="text" size={24} color={iconColor} />
          <Text style={fontSizeLabelStyle}>Font Size</Text>
        </View>
        <View style={styles.fontControls}>
          <TouchableOpacity
            style={[
              fontSizeIndex === 0 ? disabledFontButtonStyle : fontButtonStyle,
            ]}
            onPress={decreaseFontSize}
            disabled={fontSizeIndex === 0}
            accessibilityRole="button"
            accessibilityLabel="Decrease font size"
          >
            <Text
              style={[
                fontSizeIndex === 0
                  ? disabledFontButtonTextStyle
                  : fontButtonTextStyle,
                styles.smallA,
              ]}
            >
              A-
            </Text>
          </TouchableOpacity>

          <View style={styles.fontSizeDisplay}>
            <Text style={fontSizeValueStyle}>{fontSizes[fontSizeIndex]}</Text>
            <Text
              style={[
                fontPreviewStyle,
                { fontSize: fontValues[fontSizeIndex] },
              ]}
            >
              Sample text
            </Text>
          </View>

          <TouchableOpacity
            style={[
              fontSizeIndex === fontSizes.length - 1
                ? disabledFontButtonStyle
                : fontButtonStyle,
            ]}
            onPress={increaseFontSize}
            disabled={fontSizeIndex === fontSizes.length - 1}
            accessibilityRole="button"
            accessibilityLabel="Increase font size"
          >
            <Text
              style={[
                fontSizeIndex === fontSizes.length - 1
                  ? disabledFontButtonTextStyle
                  : fontButtonTextStyle,
                styles.largeA,
              ]}
            >
              A+
            </Text>
          </TouchableOpacity>
        </View>
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
    backgroundColor: "#7267D9",
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
  highContrastContainer: {
    backgroundColor: "#FFFFFF",
  },
  highContrastDescription: {
    color: "#000000",
    fontWeight: "600",
  },
  highContrastFontSizeContainer: {
    borderWidth: 2,
    borderColor: "#000000",
    backgroundColor: "#FFFFFF",
  },
  highContrastFontSizeLabel: {
    fontFamily: Globals.fonts.weights.semiBold,
    color: "#000000",
  },
  highContrastFontButton: {
    backgroundColor: "#000000",
    borderWidth: 2,
    borderColor: "#000000",
  },
  highContrastDisabledButton: {
    backgroundColor: "#FFFFFF",
    borderWidth: 2,
    borderColor: "#000000",
  },
  highContrastFontButtonText: {
    color: "#FFFFFF",
  },
  highContrastFontButtonTextDisabled: {
    color: "#000000",
  },
  highContrastFontSizeValue: {
    color: "#000000",
    fontFamily: Globals.fonts.weights.semiBold,
  },
  highContrastFontPreview: {
    color: "#000000",
    fontWeight: "600",
  },
});
