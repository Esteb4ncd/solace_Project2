import ExercisePage from '@/components/ui/ExercisePage';
import { getExerciseById } from '@/constants/exercises';
import { router, useLocalSearchParams } from 'expo-router';
import { useMemo } from 'react';

const ExerciseConfirmationScreen = () => {
  const { exerciseId, exerciseName, xpReward, duration, isMentalExercise } = useLocalSearchParams<{ 
    exerciseId?: string;
    exerciseName: string; 
    xpReward: string; 
    duration: string;
    isMentalExercise?: string;
  }>();

  // Get exercise data from exercises.json to ensure we have correct information
  const exercise = useMemo(() => {
    if (exerciseId) {
      return getExerciseById(exerciseId);
    }
    return null;
  }, [exerciseId]);

  // Always use exercise data from database (exercises.json) as source of truth
  const displayName = exercise?.name || exerciseName || 'Exercise';
  const displayXpReward = exercise ? String(exercise.recommendedXpReward) : xpReward || '10';
  // Always prioritize duration from exercises.json - it's the source of truth
  // Only use params duration if exercise is not found in JSON
  const displayDuration = exercise?.duration || duration || '2 minutes';
  
  // For mental exercises (breathing exercises), use the breathing exercise format
  const isMental = isMentalExercise === 'true' || displayName === 'Stress Relief' || displayName === 'Breathing Exercise';
  const breathingCycles = 5; // Deep Breathing has 5 cycles
  
  // Log to verify we're using the correct duration from JSON
  if (exercise) {
    console.log(`📋 Exercise confirmation: ${exercise.name} - Duration from JSON: ${exercise.duration}`);
  } else if (duration) {
    console.log(`⚠️  Exercise not found in JSON, using duration from params: ${duration}`);
  }

  const handleStart = () => {
    console.log('Start button pressed for:', displayName);
    
    // Navigate to different pages based on exercise type
    // If this is a mental exercise from the relax tab, route to deep breathing exercise
    if (isMentalExercise === 'true' || displayName === 'Stress Relief' || displayName === 'Breathing Exercise') {
      router.push({
        pathname: '/(tabs)/breathingExercisePage',
        params: {
          exerciseType: 'Deep Breathing' // Use Deep Breathing for all mental exercises
        }
      });
    } else {
      router.push({
        pathname: '/videoPlayer',
        params: {
          exerciseId: exerciseId || exercise?.id || '1',
          exerciseName: displayName,
          xpReward: displayXpReward
        }
      });
    }
  };

  const handleBack = () => {
    console.log('Back button pressed');
    // Never allow navigation back to sign in page
    if (router.canGoBack()) {
      router.back();
    } else {
      router.push('/(tabs)/homePage');
    }
  };

  return (
    <ExercisePage
      title={displayName}
      subtitle={isMental ? `+${displayXpReward} XP • ${breathingCycles} cycles` : `+${displayXpReward} XP`}
      characterImage={require('@/assets/hompageAssets/SollySitting.png')}
      bottomText={isMental ? "Ready to begin your breathing exercise?" : displayDuration}
      buttonLabel={isMental ? "Start Exercise" : "Start"}
      onButtonPress={handleStart}
      onBack={handleBack}
      showBackButton={true}
    />
  );
};

export default ExerciseConfirmationScreen;
