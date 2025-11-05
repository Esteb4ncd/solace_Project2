import BottomNavigation from "@/components/ui/BottomNavigation";
import ExerciseChip from "@/components/ui/ExerciseChip";
import StatusBar from "@/components/ui/StatusBar";
import XPBar from "@/components/ui/XPBar";
import { Globals } from "@/constants/globals";
import { Colors } from "@/constants/theme";
import { router } from "expo-router";
import React, { useState } from "react";
import { Dimensions, ScrollView, StyleSheet, Text, View } from "react-native";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

const MentalHomePage = () => {
  const [userName] = useState("Sarah");
  const [selectedCategory, setSelectedCategory] = useState("breathing");

  const handleNavPress = (itemId: string) => {
    switch (itemId) {
      case "home":
        router.push("/(tabs)/homePage");
        break;
      case "physical":
        router.push("/(tabs)/physicalHomePage");
        break;
      case "mental":
        // Already on mental page
        break;
      case "account":
        router.push("/(tabs)/signInPage");
        break;
      default:
        console.log(`Navigating to ${itemId}`);
    }
  };

  const handleExercisePress = (exerciseName: string) => {
    console.log(`Starting exercise: ${exerciseName}`);
  };

  return (
    <View style={styles.container}>
      <StatusBar />

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.contentContainer}>
          {/* Header with Progress Bar and Greeting */}
          <View style={styles.headerSection}>
            <Text style={styles.greeting}>Hey, {userName}</Text>
            <View style={styles.progressContainer}>
              <XPBar totalProgress={50} level={1} />
            </View>
          </View>
        </View>{" "}
        {/* Categories Section */}
        <View style={styles.exerciseChipContainer}>
          <ExerciseChip
            categories={["Breathing", "White Noise"]}
            onSelectionChange={(index: number, category: string) => {
              const displayText =
                category === "Breathing" ? "breathing" : "noise";
              setSelectedCategory(displayText);
              console.log(`Selected category: ${category} (index: ${index})`);
            }}
          />
        </View>
        {/* Display Selected Category Text */}
        <View style={styles.categoryTextContainer}>
          <Text style={styles.categoryDisplayText}>{selectedCategory}</Text>
        </View>
      </ScrollView>

      <BottomNavigation onItemPress={handleNavPress} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
    width: screenWidth,
    height: screenHeight,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: screenWidth * 0.04, // 4% of screen width
  },
  headerSection: {
    paddingTop: screenHeight * 0.025, // 2.5% of screen height
    paddingBottom: screenHeight * 0.03, // 3% of screen height
  },
  progressContainer: {
    marginBottom: screenHeight * 0.02, // 2% of screen height
  },
  greeting: {
    textAlign: "center",
    ...Globals.fonts.styles.header1,
    marginTop: screenHeight * 0.015, // 1.5% of screen height
  },
  section: {
    marginBottom: screenHeight * 0.04, // 4% of screen height
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: screenHeight * 0.015, // 1.5% of screen height
  },
  sectionTitle: {
    ...Globals.fonts.styles.header2Bold,
  },
  xpText: {
    ...Globals.fonts.styles.header2Bold,
    color: "#7267D9",
  },
  exerciseChipContainer: {
    marginBottom: screenHeight * 0.03, // 3% of screen height
    alignSelf: "center",
  },
  categoryTextContainer: {
    alignItems: "center",
    marginBottom: screenHeight * 0.02, // 2% of screen height
  },
  categoryDisplayText: {
    ...Globals.fonts.styles.header2Bold,
    color: "#7267D9",
    textAlign: "center",
  },
  bottomSpacing: {
    height: screenHeight * 0.12, // 12% of screen height
  },
});

export default MentalHomePage;
