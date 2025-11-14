import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect } from 'react';
import { Image, Platform, StyleSheet, Text, View } from 'react-native';
import LargeButton from '../../components/ui/LargeButton';
import { Globals } from '../../constants/globals';
import { useExerciseContext } from '@/contexts/ExerciseContext';
import { recommendExercises, getExerciseXpReward } from '@/constants/exercises';

export default function OnboardingCompleteScreen() {
  const { selectedWorkTasks, selectedPainAreas } = useLocalSearchParams();
  const { setRecommendedExercises, updateDailyTasks } = useExerciseContext();

  useEffect(() => {
    // Generate recommendations when component mounts
    if (selectedWorkTasks && selectedPainAreas) {
      try {
        const workTasks = JSON.parse(selectedWorkTasks as string);
        const painAreas = JSON.parse(selectedPainAreas as string);
        
        console.log('Generating recommendations from manual selection:', { workTasks, painAreas });
        
        if (workTasks.length > 0 && painAreas.length > 0) {
          const recommendedExercises = recommendExercises(
            painAreas,
            workTasks,
            [],
            3 // Get top 3 recommendations
          );
          
          if (recommendedExercises.length > 0) {
            setRecommendedExercises(recommendedExercises);
            
            // Convert to daily tasks format
            const dailyTasks = recommendedExercises.map((recEx) => ({
              id: recEx.exercise.id,
              title: recEx.exercise.name,
              xpAmount: getExerciseXpReward(recEx.exercise, recEx.isRecommended),
              xpColor: '#7267D9',
              isCompleted: false,
            }));
            
            updateDailyTasks(dailyTasks);
            console.log('✅ Generated recommendations from manual selection:', dailyTasks);
          }
        }
      } catch (error) {
        console.error('Error generating recommendations from manual selection:', error);
      }
    }
  }, [selectedWorkTasks, selectedPainAreas, setRecommendedExercises, updateDailyTasks]);

  const handleNext = () => {
    router.push('/(tabs)/exerciseChangeInfo');
  };

  return (
    <View style={styles.container}>
      {/* Status Bar Space */}
      <View style={styles.statusBarSpace} />

      {/* Content */}
      <View style={styles.content}>
        {/* Character Image */}
        <View style={styles.characterContainer}>
          <Image
            source={require('../../assets/SollyStates/happysolly.png')}
            style={styles.character}
            resizeMode="contain"
          />
        </View>

        {/* Title */}
        <Text style={styles.title}>You are all set!</Text>

        {/* Subtitle */}
        <Text style={styles.subtitle}>
          We've set your stretch plan based on your answer.
        </Text>
      </View>

      {/* Next Button - Fixed at bottom */}
      <View style={styles.buttonContainer}>
        <LargeButton label="Next" onPress={handleNext} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Globals.colors.white,
  },
  statusBarSpace: {
    height: Platform.OS === 'ios' ? 44 : 0,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: Globals.spacing.medium,
  },
  characterContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 185, // Adjusted: reduced by 40px to account for larger character while maintaining visual balance
  },
  character: {
    width: 280,
    height: 280,
  },
  title: {
    ...Globals.fonts.styles.header2Bold,
    textAlign: 'center',
    marginTop: 24, // From bottom of character to top of title
    marginBottom: 24, // From bottom of title to top of subtitle
  },
  subtitle: {
    ...Globals.fonts.styles.body,
    textAlign: 'center',
    color: Globals.colors.black,
    paddingHorizontal: Globals.spacing.medium,
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
    position: 'absolute',
    bottom: 32, // 32px from bottom edge
    paddingHorizontal: Globals.spacing.medium,
  },
});

