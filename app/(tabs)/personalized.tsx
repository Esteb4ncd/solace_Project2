import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import React from 'react';
import { Alert, Pressable, StyleSheet, View } from 'react-native';
import LargeButton from '../../components/ui/LargeButton';
import { Globals } from '../../constants/globals';

// Character placeholder for future SVG
const CharacterPlaceholder = () => (
  <View style={styles.characterPlaceholder}>
    {/* SVG character will be added here later */}
  </View>
);

export default function PersonalizedScreen() {
  const handleStartPress = () => {
    Alert.alert('Getting Started!', 'Let\'s create your personalized plan!');
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
    paddingHorizontal: 20,
  },
  characterPlaceholder: {
    width: 120,
    height: 120,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    marginBottom: 60,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#ddd',
    borderStyle: 'dashed',
  },
  mainHeading: {
    fontFamily: Globals.fonts.weights.bold,
    fontSize: Globals.fonts.sizes.header1,
    textAlign: 'center',
    marginBottom: 16,
    color: Globals.colors.textDark,
  },
  subHeading: {
    fontFamily: Globals.fonts.weights.medium,
    fontSize: Globals.fonts.sizes.header2,
    textAlign: 'center',
    marginBottom: 12,
    color: Globals.colors.textDark,
  },
  description: {
    fontFamily: Globals.fonts.weights.regular,
    fontSize: Globals.fonts.sizes.body,
    textAlign: 'center',
    marginBottom: 80,
    color: Globals.colors.textDark,
    paddingHorizontal: 20,
    lineHeight: 22,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 20,

  },
  skipContainer: {
    paddingVertical: 10,
  },
  skipText: {
    fontFamily: Globals.fonts.weights.regular,
    fontSize: Globals.fonts.sizes.body,
    color: Globals.colors.textDark,
    textAlign: 'center',
  },
});