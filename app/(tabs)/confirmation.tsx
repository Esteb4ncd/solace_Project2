import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import OnboardingMascot from '../../components/ui/OnboardingMascot';
import TextInputWithVoice from '../../components/ui/TextInputWithVoice';
import { Globals } from '../../constants/globals';

export default function ConfirmationScreen() {
  const handleYesPress = () => {
    // Navigate back to onboardingQuestions with question 2
    // We'll use a query parameter to indicate we should show the next question
    router.push('/(tabs)/onboardingQuestions?next=true');
  };

  const handleBackPress = () => {
    router.back();
  };

  const handleVoicePress = () => {
    // Navigate to confirmation page
    router.push('/(tabs)/confirmation');
  };

  return (
    <ThemedView style={styles.container}>
      {/* Back Button */}
      <Pressable style={styles.backButton} onPress={handleBackPress}>
        <Ionicons name="arrow-back" size={24} color="#000" />
      </Pressable>

      {/* Mascot */}
      <View style={styles.mascotContainer}>
        <OnboardingMascot isKeyboardVisible={false} />
      </View>

      {/* Confirmation Text */}
      <View style={styles.textContainer}>
        <ThemedText style={styles.thanksText}>
          Thanks for sharing!
        </ThemedText>
        <ThemedText style={styles.subText}>
          Just to make sure I got it right.
        </ThemedText>
      </View>

      {/* Main Question */}
      <View style={styles.questionContainer}>
        <ThemedText style={styles.mainQuestion}>
          Your tasks involve heavy lifting and overhead work.
        </ThemedText>
      </View>

      {/* Yes Button */}
      <View style={styles.buttonContainer}>
        <Pressable style={styles.yesButton} onPress={handleYesPress}>
          <ThemedText style={styles.yesButtonText}>Yes</ThemedText>
        </Pressable>
      </View>

      {/* Text Input Section */}
      <View style={styles.inputSection}>
        <TextInputWithVoice
          placeholder="Type or click to say something..."
          onVoicePress={handleVoicePress}
          isKeyboardVisible={false}
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
    paddingHorizontal: 20,
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 10,
    padding: 8,
  },
  mascotContainer: {
    marginBottom: 30,
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  thanksText: {
    ...Globals.fonts.styles.body,
    textAlign: 'center',
    marginBottom: 8,
  },
  subText: {
    ...Globals.fonts.styles.body,
    textAlign: 'center',
  },
  questionContainer: {
    alignItems: 'center',
    marginBottom: 40,
    paddingHorizontal: 20,
  },
  mainQuestion: {
    ...Globals.fonts.styles.header2Bold,
    textAlign: 'center',
  },
  buttonContainer: {
    marginBottom: 40,
  },
  yesButton: {
    backgroundColor: Globals.colors.accentNormal,
    borderRadius: 24,
    paddingHorizontal: 40,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  yesButtonText: {
    ...Globals.fonts.styles.header2Bold,
    color: Globals.colors.black,
  },
  inputSection: {
    position: 'absolute',
    bottom: 40,
    left: 20,
    right: 20,
  },
});
