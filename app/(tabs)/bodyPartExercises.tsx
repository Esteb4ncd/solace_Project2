import BottomNavigation from '@/components/ui/BottomNavigation';
import BackButton from '@/components/ui/BackButton';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useMemo } from 'react';
import { Dimensions, ScrollView, StyleSheet, Text, View, TouchableOpacity, Platform } from 'react-native';
import { EXERCISES_DATABASE, Exercise } from '@/constants/exercises';
import { Globals } from '@/constants/globals';
import { Colors } from '@/constants/theme';
import StatusBar from '@/components/ui/StatusBar';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// Map body part names to target areas
const bodyPartToTargetAreas: Record<string, string[]> = {
  'Back': ['back', 'lower back', 'upper back', 'spine'],
  'Shoulder': ['shoulder'],
  'Chest': ['chest'],
  'Hand': ['hand', 'wrist', 'forearm'],
  'Hip': ['hip'],
  'Legs': ['leg', 'knee', 'hamstring'],
};

const BodyPartExercisesPage = () => {
  const { bodyPart } = useLocalSearchParams<{ bodyPart: string }>();

  // Filter exercises that match the body part
  const exercises = useMemo(() => {
    if (!bodyPart) return [];
    
    const targetAreas = bodyPartToTargetAreas[bodyPart] || [];
    return EXERCISES_DATABASE.filter(exercise => 
      exercise.category === 'physical' &&
      exercise.targetAreas.some(area => 
        targetAreas.some(target => 
          area.toLowerCase().includes(target.toLowerCase()) || 
          target.toLowerCase().includes(area.toLowerCase())
        )
      )
    );
  }, [bodyPart]);

  const handleNavPress = (itemId: string) => {
    switch (itemId) {
      case 'home':
        router.push('/(tabs)/homePage');
        break;
      case 'physical':
        router.push('/(tabs)/physicalHomePage');
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

  const handleBackPress = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.push('/(tabs)/physicalHomePage');
    }
  };

  const handleExercisePress = (exercise: Exercise) => {
    router.push({
      pathname: '/(tabs)/exerciseConfirmation',
      params: {
        exerciseId: exercise.id,
        exerciseName: exercise.name,
        xpReward: String(exercise.baseXpReward),
        duration: exercise.duration,
      },
    });
  };

  return (
    <View style={styles.container}>
      <StatusBar />
      
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <BackButton style={styles.backButton} onPress={handleBackPress} />
          <Text style={styles.title}>{bodyPart || 'Exercises'}</Text>
        </View>

        {/* Exercise List */}
        <View style={styles.contentContainer}>
          {exercises.length === 0 ? (
            <Text style={styles.noExercisesText}>No exercises found for {bodyPart}</Text>
          ) : (
            exercises.map((exercise) => (
              <TouchableOpacity
                key={exercise.id}
                style={styles.exerciseCard}
                onPress={() => handleExercisePress(exercise)}
                activeOpacity={0.7}
              >
                <Text style={styles.exerciseName}>{exercise.name}</Text>
                <Text style={styles.xpText}>{exercise.baseXpReward}xp</Text>
              </TouchableOpacity>
            ))
          )}
        </View>

        <View style={styles.bottomSpacing} />
      </ScrollView>

      <BottomNavigation onItemPress={handleNavPress} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: Platform.OS === 'ios' ? 60 : 30,
    paddingBottom: 20,
    paddingHorizontal: 20,
    position: 'relative',
  },
  backButton: {
    position: 'absolute',
    left: 20,
    zIndex: 10,
  },
  title: {
    ...Globals.fonts.styles.header1,
    textAlign: 'center',
    flex: 1,
    marginRight: 48, // Compensate for back button width
  },
  contentContainer: {
    paddingHorizontal: 15,
    paddingTop: 10,
  },
  exerciseCard: {
    backgroundColor: '#fff',
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginTop: 16,
    marginBottom: 0,
    marginLeft: 15,
    marginRight: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: screenWidth - 60, // Full width minus margins
    minHeight: 72,
    borderWidth: 1,
    borderColor: '#7267D9',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  exerciseName: {
    ...Globals.fonts.styles.header2Bold,
    color: '#443E82',
    flex: 1,
  },
  xpText: {
    ...Globals.fonts.styles.header2Bold,
    color: '#7267D9',
  },
  noExercisesText: {
    ...Globals.fonts.styles.body,
    textAlign: 'center',
    paddingTop: 40,
    color: Colors.light.text,
  },
  bottomSpacing: {
    height: screenHeight * 0.12,
  },
});

export default BodyPartExercisesPage;

