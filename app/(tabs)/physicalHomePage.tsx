import BottomNavigation from '@/components/ui/BottomNavigation';
import { Globals } from "@/constants/globals";
import { Colors } from "@/constants/theme";
import { router } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { getUsername } from '@/services/userStorage';

import { useExerciseContext } from '@/contexts/ExerciseContext';
import ExerciseButton from "../../components/ui/ExerciseButton";
import ExerciseChip from "../../components/ui/ExerciseChip";
import StatusBar from "../../components/ui/StatusBar";
import XPBar from "../../components/ui/XPBar";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

// Map target areas to body part names and mascot images
const targetAreaToBodyPart: Record<string, { name: string; mascot: any; xp: number }> = {
  'back': { name: 'Back', mascot: require('../../assets/SollyStates/backpain.png'), xp: 10 },
  'lower back': { name: 'Back', mascot: require('../../assets/SollyStates/backpain.png'), xp: 10 },
  'upper back': { name: 'Back', mascot: require('../../assets/SollyStates/backpain.png'), xp: 10 },
  'spine': { name: 'Back', mascot: require('../../assets/SollyStates/backpain.png'), xp: 10 },
  'shoulder': { name: 'Shoulder', mascot: require('../../assets/SollyStates/shoulderpain.png'), xp: 10 },
  'chest': { name: 'Chest', mascot: require('../../assets/SollyStates/chestpain.png'), xp: 10 },
  'hand': { name: 'Hand', mascot: require('../../assets/SollyStates/handpain.png'), xp: 10 },
  'wrist': { name: 'Hand', mascot: require('../../assets/SollyStates/handpain.png'), xp: 10 },
  'forearm': { name: 'Hand', mascot: require('../../assets/SollyStates/handpain.png'), xp: 10 },
  'hip': { name: 'Hip', mascot: require('../../assets/SollyStates/hippain.png'), xp: 10 },
  'leg': { name: 'Legs', mascot: require('../../assets/SollyStates/legpain.png'), xp: 10 },
  'knee': { name: 'Legs', mascot: require('../../assets/SollyStates/legpain.png'), xp: 10 },
  'hamstring': { name: 'Legs', mascot: require('../../assets/SollyStates/legpain.png'), xp: 10 },
};

const PhysicalHomePage = () => {
  const [userName, setUserName] = useState<string>("David");
  const [selectedCategory, setSelectedCategory] = useState<string>("For You");
  const { recommendedExercises } = useExerciseContext();

  useEffect(() => {
    const loadUsername = async () => {
      const storedUsername = await getUsername();
      if (storedUsername) {
        setUserName(storedUsername);
      }
    };
    loadUsername();
  }, []);

  // Get unique body parts from recommended exercises
  const forYouExercises = useMemo(() => {
    if (!recommendedExercises || recommendedExercises.length === 0) {
      // Fallback to default exercises if no recommendations
      return [
        { name: "Back", mascot: require("../../assets/SollyStates/backpain.png"), xp: 10 },
        { name: "Shoulder", mascot: require("../../assets/SollyStates/shoulderpain.png"), xp: 10 },
        { name: "Chest", mascot: require("../../assets/SollyStates/chestpain.png"), xp: 10 },
      ];
    }

    // Extract unique body parts from recommended exercises
    const bodyPartsSet = new Set<string>();
    const bodyPartsMap = new Map<string, { name: string; mascot: any; xp: number }>();

    recommendedExercises.forEach((recEx) => {
      // Get the first target area from each recommended exercise
      const firstTargetArea = recEx.exercise.targetAreas[0]?.toLowerCase();
      if (firstTargetArea) {
        // Find matching body part
        const bodyPartKey = Object.keys(targetAreaToBodyPart).find(key => 
          firstTargetArea.includes(key.toLowerCase()) || key.toLowerCase().includes(firstTargetArea)
        );
        
        if (bodyPartKey) {
          const bodyPart = targetAreaToBodyPart[bodyPartKey];
          if (!bodyPartsSet.has(bodyPart.name)) {
            bodyPartsSet.add(bodyPart.name);
            bodyPartsMap.set(bodyPart.name, bodyPart);
          }
        }
      }
    });

    // Convert to array and limit to 3 for display
    return Array.from(bodyPartsMap.values()).slice(0, 3);
  }, [recommendedExercises]);

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
    console.log(`Navigating to exercises for: ${exerciseName}`);
    // Navigate to body part exercises page
    router.push({
      pathname: "/(tabs)/bodyPartExercises",
      params: { 
        bodyPart: exerciseName,
      },
    });
  };


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
          {selectedCategory === "For You" ? (
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
          ) : selectedCategory === "See All" ? (
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
          ) : null}
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
    backgroundColor: Colors.light.background,
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
    color: Colors.light.text,
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

