import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { router } from 'expo-router';
import React from 'react';
import { Alert, Platform, Pressable, StyleSheet, View } from 'react-native';
import LargeButton from '../../components/ui/LargeButton';
import OnboardingMascot from '../../components/ui/OnboardingMascot';
import { Globals } from '../../constants/globals';

export default function StartQuestionsScreen() {
  const handleStartPress = () => {
    router.push('/(tabs)/onboardingQuestions');
  };

  const handleSkipPress = () => {
    router.push('/(tabs)/homePage');
  };

  return (
    <ThemedView style={styles.container}>
      {/* Character Placeholder */}
      <OnboardingMascot />
      
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
    width: 393,
    height: 852,
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