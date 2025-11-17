import ExercisePage from '@/components/ui/ExercisePage';
import { getExerciseById } from '@/constants/exercises';
import { router, useLocalSearchParams } from 'expo-router';
import { useMemo } from 'react';

const ExerciseConfirmationScreen = () => {
  const { exerciseId, exerciseName, xpReward, duration } = useLocalSearchParams<{ 
    exerciseId?: string;
    exerciseName: string; 
    xpReward: string; 
    duration: string; 
  }>();

  // Get exercise data from exercises.json to ensure we have correct information
  const exercise = useMemo(() => {
    if (exerciseId) {
      return getExerciseById(exerciseId);
    }
    return null;
  }, [exerciseId]);

  // Use exercise data from database if available, otherwise use params
  const displayName = exercise?.name || exerciseName || 'Exercise';
  const displayXpReward = exercise ? String(exercise.recommendedXpReward) : xpReward || '10';
  const displayDuration = exercise?.duration || duration || '2 minutes';

  const handleStart = () => {
    console.log('Start button pressed for:', displayName);
    
    // Navigate to different pages based on exercise type
    if (displayName === 'Stress Relief' || displayName === 'Breathing Exercise') {
      router.push('/(tabs)/breathingExercisePage');
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
    router.back();
  };

  return (
    <ExercisePage
      title={displayName}
      subtitle={`+${displayXpReward} XP`}
      characterImage={require('@/assets/hompageAssets/SollySitting.png')}
      bottomText={displayDuration}
      buttonLabel="Start"
      onButtonPress={handleStart}
      onBack={handleBack}
      showBackButton={true}
    />
  );
};

export default ExerciseConfirmationScreen;
