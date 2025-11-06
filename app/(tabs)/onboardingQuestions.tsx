import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, Keyboard, KeyboardAvoidingView, Platform, Pressable, StyleSheet, TouchableWithoutFeedback, View } from 'react-native';
import InteractiveSection, { questions } from '../../components/ui/InteractiveSection';
import OnboardingMascot from '../../components/ui/OnboardingMascot';
import { Globals } from '../../constants/globals';

export default function OnboardingQuestionsScreen() {
  const [selectedTasks, setSelectedTasks] = useState<string[]>([]);
  const [textInput, setTextInput] = useState('');
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const { next, findingIndex, previousTasks } = useLocalSearchParams();

  useEffect(() => {
    // If coming from confirmation page, advance to next finding
    if (next === 'true' && findingIndex) {
      const nextIndex = parseInt(findingIndex as string);
      setCurrentQuestionIndex(nextIndex);
      setSelectedTasks([]);
      setTextInput('');
    }
  }, [next, findingIndex]);

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

  const handleTaskToggle = (task: string) => {
    setSelectedTasks(prev => 
      prev.includes(task) 
        ? prev.filter(t => t !== task)
        : [...prev, task]
    );
  };

  const handleVoiceInput = () => {
    if (isKeyboardVisible) {
      // When keyboard is visible, show "Message sent" and clear the text
      Alert.alert(
        "Message sent",
        "Your message has been sent",
        [{ text: "OK" }]
      );
      setTextInput(''); // Clear the text input
    }
    // When keyboard is not visible, the TextInputWithVoice component handles recording
  };

  const handleNextQuestion = () => {
    // Navigate to confirmation page with current finding index and selected tasks
    const selectedTasksParam = selectedTasks.join(',');
    
    if (currentQuestionIndex === 1 && previousTasks) {
      // This is the second question, pass both previous tasks and current body parts
      router.push(`/(tabs)/confirmation?findingIndex=${currentQuestionIndex}&selectedTasks=${selectedTasksParam}&previousTasks=${previousTasks}`);
    } else {
      // First question, just pass current tasks
      router.push(`/(tabs)/confirmation?findingIndex=${currentQuestionIndex}&selectedTasks=${selectedTasksParam}`);
    }
  };

  const handleBackPress = () => {
    router.push('/(tabs)/startQuestions');
  };

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <ThemedView style={styles.container}>
      <TouchableWithoutFeedback onPress={dismissKeyboard}>
        <KeyboardAvoidingView 
          style={styles.keyboardAvoidingView}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
        >
          {/* Back Button */}
          <Pressable style={styles.backButton} onPress={handleBackPress}>
            <Ionicons name="arrow-back" size={24} color="#000" />
          </Pressable>

        {/* Character Placeholder */}
        <View style={[
          styles.questionContainer,
          isKeyboardVisible ? styles.questionContainerKeyboardVisible : styles.questionContainerKeyboardHidden
        ]}>
          <OnboardingMascot isKeyboardVisible={isKeyboardVisible} />
          
          {/* Main Question */}
          <ThemedText style={styles.question}>
            {currentQuestion.title}
          </ThemedText>
        </View>
          
        {/* Interactive Section */}
        <View style={[
          styles.interactiveSectionContainer,
          isKeyboardVisible ? styles.interactiveSectionKeyboardVisible : styles.interactiveSectionKeyboardHidden
        ]}>
          <InteractiveSection
            selectedTasks={selectedTasks}
            textInput={textInput}
            onTaskToggle={handleTaskToggle}
            onTextChange={setTextInput}
            onVoiceInput={handleVoiceInput}
            onNext={handleNextQuestion}
            isKeyboardVisible={isKeyboardVisible}
            currentQuestion={currentQuestion}
          />
        </View>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    width: 393,
    height: 852,
  },
  keyboardAvoidingView: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
  },
  backButton: {
    position: 'absolute',
    top: Platform.OS === 'web' ? 30 : 60,
    left: 20,
    zIndex: 10,
    padding: 8,
  },
  questionContainer: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  questionContainerKeyboardHidden: {
    position: 'absolute',
    top: Platform.OS === 'web' ? 80 : 100,
    left: 0,
    right: 0,
  },
  questionContainerKeyboardVisible: {
    position: 'absolute',
    top: 100,
    left: 0,
    right: 0,
  },
  question: {
    ...Globals.fonts.styles.header2Bold,
    textAlign: 'center',
    marginBottom: 40,
    paddingHorizontal: 20,
  },
  interactiveSectionContainer: {
    paddingHorizontal: 20,
  },
  interactiveSectionKeyboardHidden: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
  },
  interactiveSectionKeyboardVisible: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 350 : 300, // Higher above keyboard
    left: 0,
    right: 0,
  },
});