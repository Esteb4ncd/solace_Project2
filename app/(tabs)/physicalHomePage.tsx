import BottomNavigation from '@/components/ui/BottomNavigation';
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

import ExerciseChip from "../..//components/ui/ExerciseChip";
import XPBar from "../..//components/ui/XPBar";
import ExerciseButton from "../../components/ui/ExerciseButton";
import StatusBar from "../../components/ui/StatusBar";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

const PhysicalHomePage = () => {
  const [userName] = useState("Sarah");
  const [selectedCategory, setSelectedCategory] = useState("For You");

  const handleNavPress = (itemId: string) => {
    switch (itemId) {
      case 'home':
        router.push('/(tabs)/homePage');
        break;
      case 'physical':
        // already here
        break;
      case 'mental':
        router.push('/(tabs)/mentalHomePage');
        break;
      case 'account':
        router.push('/(tabs)/accountSettingsPage');
        break;
      default:
        console.log(`Navigating to ${itemId}`);
    }
  };

  const handleExercisePress = (exerciseName: string) => {
    console.log(`Starting physical exercise: ${exerciseName}`);
    router.push({
      pathname: "/(tabs)/physicalExercisePage",
      params: { exerciseType: exerciseName },
    });
  };

  // Exercise data with mascot images
  const forYouExercises = [
    {
      name: "Back",
      mascot: require("../../assets/SollyStates/backpain.png"),
      xp: 10,
    },
    {
      name: "Shoulder",
      mascot: require("../../assets/SollyStates/shoulderpain.png"),
      xp: 10,
    },
    {
      name: "Chest",
      mascot: require("../../assets/SollyStates/chestpain.png"),
      xp: 10,
    },
  ];

  const allExercises = [
    {
      name: "Back",
      mascot: require("../../assets/SollyStates/backpain.png"),
      xp: 10,
    },
    {
      name: "Shoulder",
      mascot: require("../../assets/SollyStates/shoulderpain.png"),
      xp: 10,
    },
    {
      name: "Chest",
      mascot: require("../../assets/SollyStates/chestpain.png"),
      xp: 10,
    },
    {
      name: "Hand",
      mascot: require("../../assets/SollyStates/handpain.png"),
      xp: 10,
    },
    {
      name: "Hip",
      mascot: require("../../assets/SollyStates/hippain.png"),
      xp: 10,
    },
    {
      name: "Legs",
      mascot: require("../../assets/SollyStates/legpain.png"),
      xp: 10,
    },
  ];

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
            categories={["For You", "See All"]}
            onSelectionChange={(index: number, category: string) => {
              console.log(`Selected category: ${category}`);
              setSelectedCategory(category);
            }}
          />
        </View>

        {/* Exercise Cards Grid */}
        <View style={styles.exerciseCardsContainer}>
          {selectedCategory === "For You" && (
            <View style={styles.cardsGrid}>
              {forYouExercises.map((exercise) => (
                <ExerciseButton
                  key={exercise.name}
                  title={exercise.name}
                  image={
                    <Image
                      source={exercise.mascot}
                      style={styles.exerciseImage}
                      resizeMode="contain"
                    />
                  }
                  xp={exercise.xp}
                  onPress={() => handleExercisePress(exercise.name)}
                />
              ))}
            </View>
          )}

          {selectedCategory === "See All" && (
            <View style={styles.cardsGrid}>
              {allExercises.map((exercise) => (
                <ExerciseButton
                  key={exercise.name}
                  title={exercise.name}
                  image={
                    <Image
                      source={exercise.mascot}
                      style={styles.exerciseImage}
                      resizeMode="contain"
                    />
                  }
                  xp={exercise.xp}
                  onPress={() => handleExercisePress(exercise.name)}
                />
              ))}
            </View>
          )}
        </View>

        <View style={styles.bottomSpacing} />

      </ScrollView>

      <BottomNavigation onItemPress={handleNavPress} />
    </View>
  );
};

export default PhysicalHomePage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background, // EXACT SAME AS MENTAL PAGE
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: Globals.horizontalPadding,
    paddingTop: 10,
  },
  headerSection: {
    marginBottom: 20,
  },
  greeting: {
    fontSize: 28,
    fontWeight: "600",
    color: Colors.textPrimary,
    textAlign: "center",
    marginTop: screenHeight * 0.015,
  },
  progressContainer: {
    marginTop: 10,
  },
  exerciseChipContainer: {
    paddingHorizontal: Globals.horizontalPadding,
    marginBottom: 20,
    alignSelf: "center",
  },
  exerciseCardsContainer: {
    paddingHorizontal: Globals.horizontalPadding,
    paddingBottom: 20,
  },
  cardsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
    justifyContent: "flex-start",
    width: "100%",
  },
  bottomSpacing: {
    height: screenHeight * 0.12,
  },
  exerciseImage: {
    width: 73,
    height: 73,
  },
});

