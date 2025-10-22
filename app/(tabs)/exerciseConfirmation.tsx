import LargeButton from '@/components/ui/LargeButton';
import { router, useLocalSearchParams } from 'expo-router';
import React from 'react';
import {
  Image,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

const ExerciseConfirmationScreen = () => {
  const { exerciseName, xpReward, duration } = useLocalSearchParams<{ 
    exerciseName: string; 
    xpReward: string; 
    duration: string; 
  }>();

  const handleStart = () => {
    console.log('Start button pressed for:', exerciseName);
    router.push('/videoPlayer');
  };

  const handleBack = () => {
    console.log('Back button pressed');
    router.back();
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="white" />
      
      {/* Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={handleBack}>
        <Text style={styles.backButtonText}>‹</Text>
      </TouchableOpacity>

      {/* Exercise Title */}
      <Text style={styles.exerciseTitle}>{exerciseName || 'Hand Warm Up'}</Text>
      
      {/* XP Reward */}
      <Text style={styles.xpReward}>+{xpReward || '10'} XP</Text>

      {/* Solly Character Illustration */}
      <View style={styles.characterContainer}>
        <Image 
          source={require('@/assets/hompageAssets/SollySitting.png')}
          style={styles.sollyImage}
          resizeMode="contain"
        />
      </View>

      {/* Duration */}
      <Text style={styles.duration}>{duration || '2 minutes'}</Text>

      {/* Start Button */}
      <View style={styles.startButtonContainer}>
        <LargeButton 
          label="Start" 
          onPress={handleStart}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingTop: 60, // Account for status bar
  },
  backButton: {
    position: "absolute",
    top: 60,
    left: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0, 0, 0, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  backButtonText: {
    color: "black",
    fontSize: 24,
    fontWeight: "bold",
  },
  exerciseTitle: {
    fontSize: 32,
    fontWeight: "bold",
    color: "black",
    textAlign: "center",
    marginTop: 80,
    marginBottom: 8,
  },
  xpReward: {
    fontSize: 24,
    fontWeight: "bold",
    color: "black",
    textAlign: "center",
    marginBottom: 40,
  },
  characterContainer: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    marginBottom: 20,
  },
  sollyImage: {
    width: 150,
    height: 150,
  },
  duration: {
    fontSize: 24,
    fontWeight: "bold",
    color: "black",
    textAlign: "center",
    marginBottom: 60,
  },
  startButtonContainer: {
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 80,
  },
});

export default ExerciseConfirmationScreen;
