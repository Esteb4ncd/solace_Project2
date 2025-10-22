import ExercisePage from '@/components/ui/ExercisePage';
import { router, useLocalSearchParams } from 'expo-router';
import React from 'react';

const XPGainScreen = () => {
  const { xpAmount } = useLocalSearchParams<{ 
    xpAmount: string; 
  }>();

  const handleBackToHome = () => {
    console.log('Back to Home button pressed');
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
