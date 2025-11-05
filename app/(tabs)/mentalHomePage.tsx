import BottomNavigation from "@/components/ui/BottomNavigation";
import ExerciseButton from "@/components/ui/ExerciseButton";
import ExerciseChip from "@/components/ui/ExerciseChip";
import StatusBar from "@/components/ui/StatusBar";
import XPBar from "@/components/ui/XPBar";
import { Globals } from "@/constants/globals";
import { Colors } from "@/constants/theme";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

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
    if (
      exerciseName === "Breathing Exercise" ||
      exerciseName === "4-7-8 Breathing" ||
      exerciseName === "Box Breathing" ||
      exerciseName === "Deep Breathing"
    ) {
      router.push({
        pathname: "/(tabs)/breathingExercisePage",
        params: { exerciseType: exerciseName },
      });
    }
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
        </View>
        {/* Categories Section */}
        <View style={styles.exerciseChipContainer}>
          <ExerciseChip
            categories={["Breathing", "White Noise"]}
            onSelectionChange={(index: number, category: string) => {
              console.log(`Selected category: ${category} (index: ${index})`);
              // Update the selected category state based on the category name
              const normalizedCategory = category
                .toLowerCase()
                .replace(" ", "");
              if (normalizedCategory === "breathing") {
                setSelectedCategory("breathing");
              } else if (normalizedCategory === "whitenoise") {
                setSelectedCategory("noise");
              }
            }}
          />
        </View>
        {/* Show 3 ExerciseButtons when breathing category is selected */}
        {selectedCategory === "breathing" && (
          <View style={styles.multipleButtonsContainer}>
            <View style={styles.buttonRow}>
              <View style={styles.buttonColumn}>
                <ExerciseButton
                  title="4-7-8 Breathing"
                  image={
                    <Image
                      source={require("../../assets/images/Breathing01.png")}
                      style={styles.exerciseImage}
                      resizeMode="contain"
                    />
                  }
                  xp={5}
                  onPress={() => handleExercisePress("4-7-8 Breathing")}
                />
              </View>
              <View style={styles.buttonColumn}>
                <ExerciseButton
                  title="Box Breathing"
                  image={
                    <Image
                      source={require("../../assets/images/Breathing02.png")}
                      style={styles.exerciseImage}
                      resizeMode="contain"
                    />
                  }
                  xp={4}
                  onPress={() => handleExercisePress("Box Breathing")}
                />
              </View>
            </View>
            <View style={styles.buttonRow}>
              <View style={styles.buttonColumn}>
                <ExerciseButton
                  title="Deep Breathing"
                  image={
                    <Image
                      source={require("../../assets/images/Breathing03.png")}
                      style={styles.exerciseImage}
                      resizeMode="contain"
                    />
                  }
                  xp={3}
                  onPress={() => handleExercisePress("Deep Breathing")}
                />
              </View>
              <View style={styles.buttonColumn}>
                {/* Empty column for symmetry */}
              </View>
            </View>
          </View>
        )}
        {/* Show 3 ExerciseButtons when white noise category is selected */}
        {selectedCategory === "noise" && (
          <View style={styles.multipleButtonsContainer}>
            <View style={styles.buttonRow}>
              <View style={styles.buttonColumn}>
                <ExerciseButton
                  title="Rain Sounds"
                  image={
                    <Image
                      source={require("../../assets/images/Breathing01.png")}
                      style={styles.exerciseImage}
                      resizeMode="contain"
                    />
                  }
                  xp={3}
                  onPress={() => handleExercisePress("Rain Sounds")}
                />
              </View>
              <View style={styles.buttonColumn}>
                <ExerciseButton
                  title="Ocean Waves"
                  image={
                    <Image
                      source={require("../../assets/images/Breathing02.png")}
                      style={styles.exerciseImage}
                      resizeMode="contain"
                    />
                  }
                  xp={3}
                  onPress={() => handleExercisePress("Ocean Waves")}
                />
              </View>
            </View>
            <View style={styles.buttonRow}>
              <View style={styles.buttonColumn}>
                <ExerciseButton
                  title="Forest Sounds"
                  image={
                    <Image
                      source={require("../../assets/images/Breathing03.png")}
                      style={styles.exerciseImage}
                      resizeMode="contain"
                    />
                  }
                  xp={3}
                  onPress={() => handleExercisePress("Forest Sounds")}
                />
              </View>
              <View style={styles.buttonColumn}>
                {/* Empty column for symmetry */}
              </View>
            </View>
          </View>
        )}
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
  exerciseButtonContainer: {
    alignItems: "center",
    marginTop: screenHeight * 0.02, // 2% of screen height
    marginBottom: screenHeight * 0.03, // 3% of screen height
    paddingHorizontal: screenWidth * 0.04, // 4% of screen width
  },
  multipleButtonsContainer: {
    paddingHorizontal: screenWidth * 0.04, // 4% of screen width
    gap: screenHeight * 0.02, // 2% gap between rows
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: screenHeight * 0.015, // 1.5% margin between rows
  },
  buttonColumn: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: screenWidth * 0.02, // 2% padding on each side
  },
  exerciseImage: {
    width: 75,
    height: 75,
  },
  bottomSpacing: {
    height: screenHeight * 0.12, // 12% of screen height
  },
});

export default MentalHomePage;
