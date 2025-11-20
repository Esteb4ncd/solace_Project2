import LocalVideoPlayer from '@/components/videoComponents/LocalVideoPlayer';
import { getExerciseById, getExerciseVideoSource } from '@/constants/exercises';
import { useExerciseContext } from '@/contexts/ExerciseContext';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';

const VideoPlayerScreen = () => {
  const { exerciseId, exerciseName, xpReward } = useLocalSearchParams<{ 
    exerciseId: string; 
    exerciseName: string;
    xpReward: string;
  }>();
  const { videoResetTrigger } = useExerciseContext();

  console.log('VideoPlayerScreen loaded with:', { exerciseId, exerciseName, xpReward });

  // Get exercise data and video source
  const exercise = useMemo(() => {
    if (exerciseId) {
      return getExerciseById(exerciseId);
    }
    // Fallback to first exercise if no ID provided
    return getExerciseById('1');
  }, [exerciseId]);

  const videoSource = useMemo(() => {
    if (exercise) {
      const source = getExerciseVideoSource(exercise);
      console.log('📹 Video source for exercise:', {
        exerciseId: exercise.id,
        exerciseName: exercise.name,
        videoFileName: exercise.videoFileName,
        videoSource: source
      });
      return source;
    }
    // Fallback
    const fallbackExercise = getExerciseById('1');
    const fallbackSource = fallbackExercise ? getExerciseVideoSource(fallbackExercise) : { uri: '' };
    console.log('📹 Using fallback video source:', fallbackSource);
    return fallbackSource;
  }, [exercise]);

  // Always use exercise data from database if available (source of truth)
  const displayName = exercise?.name || exerciseName || 'Hand Warm Up';
  const xpAmount = exercise 
    ? String(exercise.recommendedXpReward) 
    : (xpReward || '10');

  const handleBack = () => {
    console.log('Back button pressed');
    // Never allow navigation back to sign in page
    if (router.canGoBack()) {
      router.back();
    } else {
      router.push('/(tabs)/homePage');
    }
  };

  const handleVideoEnd = () => {
    console.log('Video ended');
  };

  const handleVideoError = (error: any) => {
    console.log('Video error:', error);
  };

  const handleDone = () => {
    console.log('Done button pressed');
    router.push({
      pathname: '/xpGain',
      params: { 
        xpAmount: xpAmount,
        exerciseId: exerciseId || exercise?.id || '1',
        exerciseName: displayName
      }
    });
  };

  // Get instructions from exercise if available
  const instructions = exercise?.instructions || '';

  return (
    <View style={styles.container}>
      <LocalVideoPlayer 
        videoSource={videoSource}
        videoTitle={displayName}
        instructions={instructions}
        onBack={handleBack}
        onEnd={handleVideoEnd}
        onError={handleVideoError}
        onDone={handleDone}
        resetTrigger={videoResetTrigger}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
});

export default VideoPlayerScreen;
