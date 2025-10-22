import ExercisePage from '@/components/ui/ExercisePage';
import { useExerciseContext } from '@/contexts/ExerciseContext';
import { router, useLocalSearchParams } from 'expo-router';
import React from 'react';

const XPGainScreen = () => {
  const { xpAmount, exerciseId, exerciseName } = useLocalSearchParams<{ 
    xpAmount: string; 
    exerciseId: string;
    exerciseName: string;
  }>();
  
  const { markExerciseComplete } = useExerciseContext();

  const handleBackToHome = () => {
    console.log('Back to Home button pressed');
    
    // Mark exercise as complete
    if (exerciseId && exerciseName) {
      markExerciseComplete(exerciseId, exerciseName, parseInt(xpAmount || '10'));
    }
    
    router.push('/(tabs)/homePage');
  };

  return (
    <ExercisePage
      title="Congrats!"
      characterImage={require('@/assets/SollyStates/SollyXPGain.png')}
      bottomText={`You've gained ${xpAmount || '10'} xp`}
      buttonLabel="Back to Home"
      onButtonPress={handleBackToHome}
      showBackButton={false}
    />
  );
};

export default XPGainScreen;
