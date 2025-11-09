import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Image, Keyboard, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, TouchableWithoutFeedback, View } from 'react-native';
import BackButton from '../../components/ui/BackButton';
import TextAndVoiceInput from '../../components/ui/TextAndVoiceInput';
import VoiceConversationView from '../../components/ui/VoiceConversationView';
import { Globals } from '../../constants/globals';

export default function AIQuestion1Screen() {
  const [inputValue, setInputValue] = useState('');
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [transcribedText, setTranscribedText] = useState('');

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

  const handleBackPress = () => {
    // If in recording view, reset to normal state
    if (isRecording) {
      setIsRecording(false);
      setTranscribedText('');
      setInputValue('');
    } else {
      // Otherwise, navigate back
      router.back();
    }
  };

  const handleVoicePress = () => {
    if (isKeyboardVisible) {
      // When keyboard is visible, send functionality
      handleNext();
    } else {
      // Start recording
      setIsRecording(true);
    }
  };

  const handleSend = async () => {
    // Navigate directly to next page without showing transcribed text
    handleNext();
  };

  const handlePlayRecording = () => {
    // Handle play recording - proceed to next page
    handleNext();
  };

  const handleNext = () => {
    // Use a default answer or input value
    const answer = inputValue.trim() || 'Voice input';
    router.push({
      pathname: '/(tabs)/aiConfirmation1',
      params: { answer }
    });
  };

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  // Show conversation view when recording
  if (isRecording) {
    return (
      <ThemedView style={styles.container}>
        {/* Back Button */}
        <BackButton style={styles.backButton} onPress={handleBackPress} />
        
        {/* Voice Button centered at top */}
        <View style={styles.voiceButtonContainer}>
          <Pressable style={styles.voiceButton}>
            <ThemedText style={styles.voiceButtonText}>Voice</ThemedText>
          </Pressable>
        </View>

        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
          <VoiceConversationView
            question="What iron work tasks do you typically do?"
            transcribedText={transcribedText}
            isRecording={isRecording}
            onSend={handleSend}
            onPlay={handlePlayRecording}
            onStopRecording={handleSend}
          />
        </ScrollView>
      </ThemedView>
    );
  }

  return (
    <TouchableWithoutFeedback onPress={dismissKeyboard}>
      <KeyboardAvoidingView 
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ThemedView style={styles.container}>
          {/* Back Button */}
          <BackButton style={styles.backButton} onPress={handleBackPress} />

          {isKeyboardVisible ? (
            // Speech bubble layout when keyboard is visible
            <View style={styles.keyboardQuestionContainer}>
              <Image
                source={require('../../assets/onboarding/aiOnboarding02.png')}
                style={styles.keyboardMascotImage}
                resizeMode="contain"
              />
              <View style={styles.speechBubble}>
                <ThemedText style={styles.speechBubbleText}>
                  What iron work tasks do you typically do?
                </ThemedText>
                <View style={styles.speechBubbleTailBorder} />
                <View style={styles.speechBubbleTail} />
              </View>
            </View>
          ) : (
            <>
              {/* Question - centered horizontally */}
              <View style={styles.questionContainer}>
                <ThemedText style={styles.questionText}>
                  What iron work tasks do you typically do?
                </ThemedText>
              </View>

              {/* Mascot - positioned lower-left/central */}
              <Image
                source={require('../../assets/onboarding/aiOnboarding02.png')}
                style={styles.mascotImage}
                resizeMode="contain"
              />
            </>
          )}

          {/* Text Input Section */}
          <View style={styles.inputSection}>
            <TextAndVoiceInput
              placeholder="Ask Solly anything!"
              value={inputValue}
              onChangeText={setInputValue}
              onVoicePress={handleVoicePress}
              onStartRecording={() => setIsRecording(true)}
              onSend={handleSend}
              isKeyboardVisible={isKeyboardVisible}
              autoFocus={false}
              multiline={true}
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
    width: '100%',
    height: '100%',
    paddingHorizontal: 20,
  },
  backButton: {
    position: 'absolute',
    top: Platform.OS === 'web' ? 30 : 60,
    left: 20,
    zIndex: 10,
  },
  questionContainer: {
    marginTop: Platform.OS === 'web' ? 220 : 240,
    marginBottom: 30,
    alignItems: 'center',
    paddingHorizontal: 20,
    zIndex: 2,
  },
  questionText: {
    ...Globals.fonts.styles.header2Bold,
    textAlign: 'center',
    color: '#000',
  },
  mascotImage: {
    position: 'absolute',
    bottom: 140,
    left: -20,
    width: 280,
    height: 360,
    zIndex: 0,
  },
  keyboardQuestionContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: Platform.OS === 'web' ? 100 : 120,
    marginBottom: 20,
    paddingHorizontal: 20,
    zIndex: 2,
  },
  keyboardMascotImage: {
    width: 120,
    height: 150,
    marginRight: 8,
    zIndex: 0,
  },
  speechBubble: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 16,
    borderWidth: 3,
    borderColor: '#E0E0E0',
    padding: 16,
    marginTop: 0,
    marginLeft: -10,
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
    zIndex: 2,
  },
  speechBubbleText: {
    ...Globals.fonts.styles.header3,
    fontSize: 18,
    color: '#000',
    textAlign: 'center',
    lineHeight: 26,
  },
  speechBubbleTail: {
    position: 'absolute',
    left: -10,
    bottom: 10,
    width: 0,
    height: 0,
    borderStyle: 'solid',
    borderRightWidth: 10,
    borderTopWidth: 8,
    borderBottomWidth: 8,
    borderRightColor: '#fff',
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
    zIndex: 2,
  },
  speechBubbleTailBorder: {
    position: 'absolute',
    left: -13,
    bottom: 8.5,
    width: 0,
    height: 0,
    borderStyle: 'solid',
    borderRightWidth: 13,
    borderTopWidth: 11,
    borderBottomWidth: 11,
    borderRightColor: '#E0E0E0',
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
    zIndex: 1,
  },
  inputSection: {
    position: 'absolute',
    bottom: 40,
    left: 20,
    right: 20,
    zIndex: 2,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 120, // Increased to ensure send button is visible
    flexGrow: 1,
  },
  voiceButtonContainer: {
    position: 'absolute',
    top: Platform.OS === 'web' ? 30 : 60,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 10,
  },
  voiceButton: {
    backgroundColor: '#D3D0F3',
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 8,
    width: 160,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  voiceButtonText: {
    ...Globals.fonts.styles.header2Bold,
    fontSize: 20,
    fontWeight: '700',
    color: '#564DA3',
    textAlign: 'center',
  },
});

