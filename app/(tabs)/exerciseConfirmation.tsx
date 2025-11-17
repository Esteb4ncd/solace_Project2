import ExercisePage from '@/components/ui/ExercisePage';
<<<<<<< HEAD
import { router, useLocalSearchParams } from 'expo-router';

const ExerciseConfirmationScreen = () => {
  const { exerciseName, xpReward, duration } = useLocalSearchParams<{ 
=======
import { getExerciseById } from '@/constants/exercises';
import { router, useLocalSearchParams } from 'expo-router';
import { useMemo } from 'react';

const ExerciseConfirmationScreen = () => {
  const { exerciseId, exerciseName, xpReward, duration } = useLocalSearchParams<{ 
    exerciseId?: string;
>>>>>>> origin/VideosAPI
    exerciseName: string; 
    xpReward: string; 
    duration: string; 
  }>();

<<<<<<< HEAD
  const handleStart = () => {
    console.log('Start button pressed for:', exerciseName);
    
    // Navigate to different pages based on exercise type
    if (exerciseName === 'Stress Relief' || exerciseName === 'Breathing Exercise') {
      router.push('/(tabs)/breathingExercisePage');
    } else {
      router.push('/videoPlayer');
=======
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
>>>>>>> origin/VideosAPI
    }
  };

  const handleBack = () => {
    console.log('Back button pressed');
    router.back();
  };

  return (
    <ExercisePage
<<<<<<< HEAD
      title={exerciseName || 'Hand Warm Up'}
      subtitle={`+${xpReward || '10'} XP`}
      characterImage={require('@/assets/hompageAssets/SollySitting.png')}
      bottomText={duration || '2 minutes'}
=======
      title={displayName}
      subtitle={`+${displayXpReward} XP`}
      characterImage={require('@/assets/hompageAssets/SollySitting.png')}
      bottomText={displayDuration}
>>>>>>> origin/VideosAPI
      buttonLabel="Start"
      onButtonPress={handleStart}
      onBack={handleBack}
      showBackButton={true}
    />
  );
};

export default ExerciseConfirmationScreen;
