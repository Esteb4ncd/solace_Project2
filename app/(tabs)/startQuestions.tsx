import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { router } from 'expo-router';
import React from 'react';
import { Alert, Platform, Pressable, StyleSheet, View } from 'react-native';
import LargeButton from '../../components/ui/LargeButton';
import { Globals } from '../../constants/globals';

// Character placeholder for future SVG
const CharacterPlaceholder = () => (
  <View style={styles.characterPlaceholder}>
    {/* SVG character will be added here later */}
  </View>
);

export default function StartQuestionsScreen() {
  const handleStartPress = () => {
    router.push('/(tabs)/onboardingQuestions');
  };

  const handleSkipPress = () => {
    Alert.alert('Skipped', 'You can always set up your personalized plan later.');
  };

  return (
    <ThemedView style={styles.container}>
      {/* Character Placeholder */}
      <CharacterPlaceholder />
      
      {/* Main heading */}
      <ThemedText type="title" style={styles.mainHeading}>
        Tailored for YOU
      </ThemedText>
      
      {/* Subheading */}
      <ThemedText style={styles.subHeading}>
        Create a Personalized plan
      </ThemedText>
      
      {/* Description */}
      <ThemedText style={styles.description}>
        To get you set up with, we need to know a few things about you.
      </ThemedText>
      
      {/* Start Button */}
      <View style={styles.buttonContainer}>
        <LargeButton label="Start" onPress={handleStartPress} />
      {/* Skip Link */}
      <Pressable onPress={handleSkipPress} style={styles.skipContainer}>
        <ThemedText style={styles.skipText}>Skip for now</ThemedText>
      </Pressable>
      </View>
      
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    // Force mobile-like appearance on web
    ...(Platform.OS === 'web' && {
      maxWidth: 393, // iPhone 16 width
      width: 393, // Fixed width
      height: 852, // iPhone 16 height
      marginHorizontal: 'auto',

    }),
  },
  characterPlaceholder: {
    width: 190,
    height: 250,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#ddd',
    borderStyle: 'dashed',
  },
  mainHeading: {
    ...Globals.fonts.styles.header1,
    marginBottom: 24,
    marginTop: 24,
  },
  subHeading: {
    ...Globals.fonts.styles.header4,
    textAlign: 'center',
    marginBottom: 10,
  },
  description: {
    ...Globals.fonts.styles.body,
    textAlign: 'center',
    marginBottom: 10,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 54,
    width: '100%',
    alignItems: 'center',
    // Ensure proper positioning on web
    ...(Platform.OS === 'web' && {
      maxWidth: 393,
      left: '50%',
      transform: [{ translateX: -196.5 }], // Half of iPhone 16 width
    }),
  },
  skipContainer: {
    marginTop:10,
    paddingVertical: 10,
  },
  skipText: {
    ...Globals.fonts.styles.label,
    textAlign: 'center',
  },
});