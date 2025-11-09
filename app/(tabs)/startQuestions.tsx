import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { router } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import LargeButton from '../../components/ui/LargeButton';
import OnboardingMascot from '../../components/ui/OnboardingMascot';
import { Globals } from '../../constants/globals';

export default function StartQuestionsScreen() {
  const handleStartPress = () => {
    router.push('/(tabs)/onboardingPreference');
  };

  const handleSkipPress = () => {
    router.push('/(tabs)/homePage');
  };

  return (
    <ThemedView style={styles.container}>
      {/* Character Placeholder */}
      <View style={styles.characterContainer}>
        <OnboardingMascot />
      </View>
      
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
      </View>
      
      {/* Skip Link */}
      <View style={styles.skipWrapper}>
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
    width: 393,
    height: 852,
  },
  characterContainer: {
    marginTop: 174, // From top of content area to top of character
    alignItems: 'center',
    justifyContent: 'center',
  },
  mainHeading: {
    ...Globals.fonts.styles.header1,
    marginTop: 32.75, // From bottom of character to top of heading
    marginBottom: 16, // From bottom of heading to top of subheading
    textAlign: 'center',
  },
  subHeading: {
    ...Globals.fonts.styles.header4,
    textAlign: 'center',
    marginBottom: 0,
  },
  description: {
    ...Globals.fonts.styles.body,
    textAlign: 'center',
    marginBottom: 101, // From bottom of description to top of Start button
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 16, // From bottom of button to top of Skip link
  },
  skipWrapper: {
    position: 'absolute',
    bottom: 66, // From bottom of Skip link to bottom edge
    width: '100%',
    alignItems: 'center',
  },
  skipContainer: {
    paddingVertical: 10,
  },
  skipText: {
    ...Globals.fonts.styles.label,
    textAlign: 'center',
  },
});