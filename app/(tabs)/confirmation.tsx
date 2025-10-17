import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import LargeButton from '../../components/ui/LargeButton';
import OnboardingMascot from '../../components/ui/OnboardingMascot';
import TextInputWithVoice from '../../components/ui/TextInputWithVoice';
import { Globals } from '../../constants/globals';

const confirmations = [
  {
    thanksText: "Thanks for sharing!",
    subText: "Just to make sure I got it right.",
    mainFinding: "Your tasks involve heavy lifting and overhead work.",
    nextFindingIndex: 1,
    buttonText: "Yes"
  },
  {
    thanksText: "",
    subText: "",
    mainFinding: "Your exercises will target your left shoulder and right knee.\n\nYour exercises will help you with heavy lifting and overhead work.",
    nextFindingIndex: null, // End of findings
    buttonText: "Yes, Finish"
  }
];

export default function ConfirmationScreen() {
  const { findingIndex } = useLocalSearchParams();
  const confirmationIndex = findingIndex ? parseInt(findingIndex as string) : 0;
  const currentConfirmation = confirmations[confirmationIndex];

  const handleYesPress = () => {
    if (currentConfirmation.nextFindingIndex !== null) {
      // Navigate back to onboardingQuestions with the next finding
      router.push(`/(tabs)/onboardingQuestions?next=true&findingIndex=${currentConfirmation.nextFindingIndex}`);
    } else {
      // End of findings - navigate to homepage
      router.push('/(tabs)/homePage');
    }
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
          {currentConfirmation.thanksText}
        </ThemedText>
        <ThemedText style={styles.subText}>
          {currentConfirmation.subText}
        </ThemedText>
      </View>

      {/* Main Finding */}
      <View style={styles.findingContainer}>
        {confirmationIndex === 1 ? (
          <ThemedText style={styles.mainFindingRegular}>
            Your exercises will target your <ThemedText style={styles.boldText}>left shoulder and right knee</ThemedText>.
            {'\n\n'}
            Your exercises will help you with <ThemedText style={styles.boldText}>heavy lifting and overhead work</ThemedText>.
          </ThemedText>
        ) : (
          <ThemedText style={styles.mainFinding}>
            {currentConfirmation.mainFinding}
          </ThemedText>
        )}
      </View>

      {/* Yes Button */}
      <View style={styles.buttonContainer}>
        <LargeButton 
          label={currentConfirmation.buttonText} 
          onPress={handleYesPress} 
        />
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
    width: 393,
    alignSelf: 'center',
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
  findingContainer: {
    alignItems: 'center',
    marginBottom: 40,
    paddingHorizontal: 20,
  },
  mainFinding: {
    ...Globals.fonts.styles.header2Bold,
    textAlign: 'center',
  },
  mainFindingRegular: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 20,
    color: '#000000',
    textAlign: 'center',
  },
  boldText: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 20,
    color: '#000000',
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 129, // 40px (inputSection bottom) + 60px (button height) + 24px (gap) + 5px (extra spacing)
    left: 20,
    right: 20,
    alignItems: 'center',
  },
  inputSection: {
    position: 'absolute',
    bottom: 40,
    left: 20,
    right: 20,
  },
});
