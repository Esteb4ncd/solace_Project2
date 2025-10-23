import ExercisePage from '@/components/ui/ExercisePage';
import { router, useLocalSearchParams } from 'expo-router';

const ExerciseConfirmationScreen = () => {
  const { exerciseName, xpReward, duration } = useLocalSearchParams<{ 
    exerciseName: string; 
    xpReward: string; 
    duration: string; 
  }>();

  const handleStart = () => {
    console.log('Start button pressed for:', exerciseName);
    
    // Navigate to different pages based on exercise type
    if (exerciseName === 'Stress Relief' || exerciseName === 'Breathing Exercise') {
      router.push('/(tabs)/breathingExercisePage');
    } else {
      router.push('/videoPlayer');
    }
  };

  const handleBack = () => {
    console.log('Back button pressed');
    router.back();
  };

  return (
    <ExercisePage
      title={exerciseName || 'Hand Warm Up'}
      subtitle={`+${xpReward || '10'} XP`}
      characterImage={require('@/assets/hompageAssets/SollySitting.png')}
      bottomText={duration || '2 minutes'}
      buttonLabel="Start"
      onButtonPress={handleStart}
      onBack={handleBack}
      showBackButton={true}
    />
  );
};

export default ExerciseConfirmationScreen;
