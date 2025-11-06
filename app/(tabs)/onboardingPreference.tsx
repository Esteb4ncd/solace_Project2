import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { router } from 'expo-router';
import React from 'react';
import { Image, Platform, StyleSheet, View } from 'react-native';
import BackButton from '../../components/ui/BackButton';
import PreferenceButton from '../../components/ui/PreferenceButton';
import { Globals } from '../../constants/globals';

export default function OnboardingPreferenceScreen() {
  const handleAIAssistantPress = () => {
    // Navigate to AI Assistant flow
    router.push('/(tabs)/ai_onboarding');
  };

  const handleManuallySelectPress = () => {
    // Navigate to manual selection flow - start with work task selection
    router.push('/(tabs)/workTaskSelection');
  };

  const handleBackPress = () => {
    router.push('/(tabs)/startQuestions');
  };

  return (
    <ThemedView style={styles.container}>
      {/* Back Button */}
      <BackButton style={styles.backButton} onPress={handleBackPress} />

      {/* Mascot Image */}
      <Image
        source={require('../../assets/onboarding/preferencesPageMascot.png')}
        style={styles.mascotImage}
        resizeMode="contain"
      />
      
      {/* Main question */}
      <ThemedText type="title" style={styles.mainHeading}>
        Which one do you prefer?
      </ThemedText>
      
      {/* Buttons Container */}
      <View style={styles.buttonContainer}>
        <PreferenceButton
          label="AI Assistant"
          onPress={handleAIAssistantPress}
        />
        <View style={styles.buttonSpacing} />
        <PreferenceButton
          label="Manually Select"
          onPress={handleManuallySelectPress}
        />
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
    width: '100%',
    height: '100%',
  },
  backButton: {
    position: 'absolute',
    top: Platform.OS === 'web' ? 20 : 50,
    left: 20,
    zIndex: 10,
  },
  mascotImage: {
    position: 'absolute',
    top: Platform.OS === 'web' ? 80 : 100,
    right: -20,
    width: 250,
    height: 350,
    zIndex: 1,
  },
  mainHeading: {
    ...Globals.fonts.styles.header2Bold,
    position: 'absolute',
    bottom: 100 + 160 + 20 + 160 + 25, // 25px above AI Assistant button
    // Container bottom: 100, Manually Select: 160px, spacing: 20px, AI Assistant: 160px, + 25px above
    textAlign: 'left',
    width: '100%',
    paddingLeft: 25,
    paddingRight: 20,
    marginLeft: 7,
    color: '#000',
    zIndex: 5,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 100,
    width: '100%',
    alignItems: 'center',
  },
  buttonSpacing: {
    height: 20,
  },
});

