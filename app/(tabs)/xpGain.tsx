import ExercisePage from '@/components/ui/ExercisePage';
import StreakSplashScreen from '@/components/ui/StreakSplashScreen';
import { useExerciseContext } from '@/contexts/ExerciseContext';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';

const XPGainScreen = () => {
  const { xpAmount, exerciseId, exerciseName } = useLocalSearchParams<{ 
    xpAmount: string; 
    exerciseId: string;
    exerciseName: string;
  }>();
  
  const { markExerciseComplete, updateDailyTasks, dailyTasks, getStreakCount, completedExercises } = useExerciseContext();
  const [showStreakSplash, setShowStreakSplash] = useState(false);
  const [streakCount, setStreakCount] = useState(0);

  const handleBackToHome = () => {
    console.log('Back to Home button pressed');
    
    // Mark exercise as complete
    if (exerciseId && exerciseName) {
      // Check if this is the first exercise completed today (before marking it complete)
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const todayTime = today.getTime();
      
      const hasExerciseToday = completedExercises.some(ex => {
        const date = new Date(ex.completedAt);
        date.setHours(0, 0, 0, 0);
        return date.getTime() === todayTime;
      });
      
      // This is the first exercise of the day if there are no exercises completed today yet
      const isFirstExerciseToday = !hasExerciseToday;
      
      markExerciseComplete(exerciseId, exerciseName, parseInt(xpAmount || '10'));
      
      // Update dailyTasks to mark this exercise as completed
      const updatedTasks = dailyTasks.map(task => 
        task.id === exerciseId 
          ? { ...task, isCompleted: true }
          : task
      );
      updateDailyTasks(updatedTasks);
      
      // Show splash screen if this is the first exercise of the day
      if (isFirstExerciseToday) {
        // Get the current streak count before marking complete
        const currentStreak = getStreakCount();
        // The new streak will be current + 1 (since we're completing the first exercise of the day)
        const newStreak = currentStreak + 1;
        console.log('Current streak:', currentStreak, 'New streak:', newStreak);
        setStreakCount(newStreak);
        setShowStreakSplash(true);
      } else {
        router.push('/(tabs)/homePage');
      }
    } else {
      router.push('/(tabs)/homePage');
    }
  };

  const handleCloseStreakSplash = () => {
    setShowStreakSplash(false);
    router.push('/(tabs)/homePage');
  };

  return (
    <>
    <ExercisePage
      title="Congrats!"
      characterImage={require('@/assets/SollyStates/SollyXPGain.png')}
      bottomText={`You've gained ${xpAmount || '10'} xp`}
      buttonLabel="Back to Home"
      onButtonPress={handleBackToHome}
      showBackButton={false}
    />
      <StreakSplashScreen
        visible={showStreakSplash}
        streakCount={streakCount}
        onClose={handleCloseStreakSplash}
      />
    </>
  );
};

export default XPGainScreen;
