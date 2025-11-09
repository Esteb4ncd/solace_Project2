import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, Keyboard, KeyboardAvoidingView, Platform, Pressable, StyleSheet, TouchableWithoutFeedback, View } from 'react-native';
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
  const { findingIndex, selectedTasks, previousTasks } = useLocalSearchParams();
  const confirmationIndex = findingIndex ? parseInt(findingIndex as string) : 0;
  const currentConfirmation = confirmations[confirmationIndex];
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  
  // Parse selected tasks from URL parameter
  const selectedTasksArray = selectedTasks ? (selectedTasks as string).split(',') : [];
  const previousTasksArray = previousTasks ? (previousTasks as string).split(',') : [];

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
      setIsKeyboardVisible(true);
    });
    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      setIsKeyboardVisible(false);
    });

    return () => {
      keyboardDidShowListener?.remove();
      keyboardDidHideListener?.remove();
    };
  }, []);

  const handleYesPress = () => {
    if (currentConfirmation.nextFindingIndex !== null) {
      // Navigate to work task selection (replacing disabled onboardingQuestions)
      router.push('/(tabs)/workTaskSelection');
    } else {
      // End of findings - navigate to homepage
      router.push('/(tabs)/homePage');
    }
  };

  const handleBackPress = () => {
    router.back();
  };

  const handleVoicePress = () => {
    // This will be called when keyboard is visible (send functionality)
    // For now, just show an alert
    Alert.alert(
      "Message sent",
      "Your message has been sent",
      [{ text: "OK" }]
    );
  };

  const handleSend = () => {
    // This will be called when voice recording is sent
    // Navigate to next page
    handleYesPress();
  };

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  return (
    <TouchableWithoutFeedback onPress={dismissKeyboard}>
      <KeyboardAvoidingView 
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ThemedView style={styles.container}>
      {/* Back Button */}
      <Pressable style={styles.backButton} onPress={handleBackPress}>
        <Ionicons name="arrow-back" size={24} color="#000" />
      </Pressable>

      {/* Mascot */}
      <View style={[
        styles.mascotContainer,
        isKeyboardVisible && styles.mascotContainerKeyboardVisible
      ]}>
        <OnboardingMascot isKeyboardVisible={isKeyboardVisible} />
      </View>

      {/* Confirmation Text */}
      <View style={[
        styles.textContainer,
        isKeyboardVisible && styles.textContainerKeyboardVisible
      ]}>
        <ThemedText style={styles.thanksText}>
          {currentConfirmation.thanksText}
        </ThemedText>
        <ThemedText style={styles.subText}>
          {currentConfirmation.subText}
        </ThemedText>
      </View>

      {/* Main Finding */}
      <View style={[
        confirmationIndex === 1 ? styles.findingContainerSecond : styles.findingContainer,
        isKeyboardVisible && styles.findingContainerKeyboardVisible
      ]}>
        {confirmationIndex === 0 ? (
          <ThemedText style={styles.mainFinding}>
            Your tasks involve <ThemedText style={styles.boldText}>{selectedTasksArray.join(', ')}</ThemedText>.
          </ThemedText>
        ) : confirmationIndex === 1 ? (
          <ThemedText style={styles.mainFindingRegular}>
            Your exercises will target <ThemedText style={styles.boldText}>{selectedTasksArray.join(', ')}</ThemedText>.
            {'\n\n'}
            Your exercises will help you with <ThemedText style={styles.boldText}>{previousTasksArray.join(', ')}</ThemedText>.
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
          placeholder="No, add more..."
          onVoicePress={handleVoicePress}
          onSend={handleSend}
          isKeyboardVisible={isKeyboardVisible}
          autoFocus={false}
        />
      </View>
        </ThemedView>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
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
    height: 852,
  },
  backButton: {
    position: 'absolute',
    top: Platform.OS === 'web' ? 30 : 60,
    left: 20,
    zIndex: 10,
    padding: 8,
  },
  mascotContainer: {
    marginBottom: 5,
  },
  mascotContainerKeyboardVisible: {
    marginBottom: 20,
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  textContainerKeyboardVisible: {
    marginBottom: 15,
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
    marginBottom: 60,
    paddingHorizontal: 20,
  },
  findingContainerSecond: {
    alignItems: 'center',
    marginTop: -80,
    marginBottom: 60,
    paddingHorizontal: 20,
  },
  findingContainerKeyboardVisible: {
    marginTop: -120,
    marginBottom: 40,
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
