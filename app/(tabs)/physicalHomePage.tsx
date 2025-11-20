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
import GeneralTaskCard from "../../components/taskCards/generalTaskCard";
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

  const allExercises = [
    "Back",
    "Shoulder",
    "Chest",
    "Hand",
    "Hip",
    "Legs",
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

        {/* Exercise Buttons */}
        <View style={styles.exerciseButtonsContainer}>
          {selectedCategory === "For You" && (
            <>
              <GeneralTaskCard
                title="Recommended Stretch"
                description="Try this routine to reduce muscle stiffness."
              />
            </>
          )}

          {selectedCategory === "See All" && (
            <>
              {allExercises.map((exercise) => (
                <ExerciseButton
                  key={exercise}
                  label={exercise}
                  onPress={() => handleExercisePress(exercise)}
                />
              ))}
            </>
          )}
        </View>

      </ScrollView>

      <BottomNavigation onPress={handleNavPress} activeTab="physical" />
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
  },
  progressContainer: {
    marginTop: 10,
  },
  exerciseChipContainer: {
    paddingHorizontal: Globals.horizontalPadding,
    marginBottom: 20,
  },
  exerciseButtonsContainer: {
    gap: 15,
    paddingHorizontal: Globals.horizontalPadding,
    paddingBottom: 100,
  },
});
