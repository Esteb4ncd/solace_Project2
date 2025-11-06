import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { router } from 'expo-router';
import React from 'react';
import { Image, Platform, StyleSheet, View } from 'react-native';
import BackButton from '../../components/ui/BackButton';
import LargeButton from '../../components/ui/LargeButton';
import { Globals } from '../../constants/globals';

export default function StartAIOnboardingScreen() {
  const handleStartPress = () => {
    router.push('/(tabs)/aiQuestion1');
  };

  const handleBackPress = () => {
    router.push('/(tabs)/onboardingPreference');
  };

  return (
    <ThemedView style={styles.container}>
      {/* Back Button */}
      <BackButton style={styles.backButton} onPress={handleBackPress} />

      {/* Welcome Message */}
      <View style={styles.welcomeContainer}>
        <ThemedText style={styles.welcomeText}>
          Hello, I'm Solly,
        </ThemedText>
        <ThemedText style={styles.welcomeText}>
          your AI assistant.
        </ThemedText>
      </View>

      {/* Mascot Image */}
      <Image
        source={require('../../assets/onboarding/aiOnboarding01.png')}
        style={styles.mascotImage}
        resizeMode="contain"
      />

      {/* Introductory Text */}
      <View style={styles.introContainer}>
        <ThemedText style={styles.introText}>
          Let's get started!
        </ThemedText>
        <ThemedText style={styles.introText}>
          I'll help you with any tasks
        </ThemedText>
      </View>
      
      {/* Start Button */}
      <View style={styles.buttonContainer}>
        <LargeButton label="Start" onPress={handleStartPress} style={{}} />
      </View>
      
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
  backButton: {
    position: 'absolute',
    top: Platform.OS === 'web' ? 30 : 60,
    left: 20,
    zIndex: 10,
  },
  welcomeContainer: {
    alignItems: 'center',
    marginTop: Platform.OS === 'web' ? 100 : 120,
    marginBottom: 20,
    paddingHorizontal: 20,
    zIndex: 2,
  },
  welcomeText: {
    ...Globals.fonts.styles.header2Bold,
    textAlign: 'center',
    color: '#000',
  },
  mascotImage: {
    width: 250,
    height: 300,
    marginBottom: 30,
    zIndex: 1,
    position: 'relative',
  },
  introContainer: {
    alignItems: 'center',
    marginBottom: 40,
    paddingHorizontal: 20,
    zIndex: 2,
  },
  introText: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 16,
    color: '#000',
    textAlign: 'center',
    marginBottom: 4,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 54,
    width: '100%',
    alignItems: 'center',
    zIndex: 2,
  },
});

