import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Globals } from "../../constants/globals";

const ExerciseChip = ({
  categories,
  defaultSelected = 0,
  onSelectionChange,
  containerStyle = null,
}) => {
  const [selectedIndex, setSelectedIndex] = useState(defaultSelected);

  const handleCategoryPress = (index) => {
    setSelectedIndex(index);
    if (onSelectionChange) {
      onSelectionChange(index, categories[index]);
    }
  };

  return (
    <View style={[styles.chipContainer, containerStyle]}>
      {categories.map((category, index) => (
        <TouchableOpacity
          key={index}
          style={[
            styles.categoryButton,
            selectedIndex === index && styles.selectedCategoryButton,
            index === 0 && styles.leftButton,
            index === categories.length - 1 && styles.rightButton,
          ]}
          onPress={() => handleCategoryPress(index)}
          activeOpacity={0.8}
        >
          <Text
            style={[
              styles.categoryText,
              selectedIndex === index && styles.selectedCategoryText,
            ]}
          >
            {category}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  chipContainer: {
    flexDirection: "row",
    width: 336,
    height: 45,
    backgroundColor: "#F5F5F5",
    borderRadius: 22.5,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  categoryButton: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
    paddingVertical: 8,
    paddingHorizontal: 16,
    minHeight: 45,
  },
  selectedCategoryButton: {
    backgroundColor: "#7267D9",
  },
  leftButton: {
    borderTopLeftRadius: 16,
    borderBottomLeftRadius: 16,
  },
  rightButton: {
    borderTopRightRadius: 16,
    borderBottomRightRadius: 16,
  },
  categoryText: {
    fontSize: 18,
    fontFamily: Globals.fonts.weights.bold,
    color: "#7267D9", // Purple color for unselected
    textAlign: "center",
    textAlignVertical: "center",
    lineHeight: 22,
  },
  selectedCategoryText: {
    color: "#FFFFFF", // White color for selected
    fontFamily: Globals.fonts.weights.bold,
    textAlign: "center",
    textAlignVertical: "center",
    lineHeight: 22,
  },
});

export default ExerciseChip;
