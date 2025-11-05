import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Globals } from "../../constants/globals";

const ExerciseButton = ({ title, onPress, disabled = false, image, xp }) => {
  return (
    <TouchableOpacity
      style={[styles.button, disabled && styles.disabledButton]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.8}
    >
      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>
      </View>
      {image && <View style={styles.imageContainer}>{image}</View>}
      {xp !== undefined && (
        <View style={styles.xpContainer}>
          <Text style={styles.xpText}>{xp} XP</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: "white",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 24,
    borderColor: "#7267D9",
    borderWidth: 1,
    width: 159,
    height: 150,
    position: "relative",
  },
  disabledButton: {
    backgroundColor: "#CCCCCC",
  },
  content: {
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "flex-start",
    flex: 1,
  },
  imageContainer: {
    position: "absolute",
    bottom: 12,
    left: 20,
    width: 73,
    height: 73,
  },
  title: {
    color: "black",
    fontSize: 16,
    fontFamily: Globals.fonts.weights.bold,
    textAlign: "left",
  },
  xpContainer: {
    position: "absolute",
    bottom: 12,
    right: 20,
  },
  xpText: {
    color: "#7267D9",
    fontSize: 18,
    fontFamily: Globals.fonts.weights.bold,
  },
});

export default ExerciseButton;
