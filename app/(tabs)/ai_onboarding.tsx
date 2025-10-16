import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import React, { useState } from "react";
import { Alert, StyleSheet, TextInput, View } from "react-native";
import LargeButton from '../../components/ui/LargeButton';

const AIOnboarding = () => {
  const [step, setStep] = useState(0);
  const [userInput, setUserInput] = useState("");

  const nextStep = () => {
    setStep((prevStep) => prevStep + 1);
  };

  const handleSendInput = () => {
    if (userInput.trim()) {
      Alert.alert('Input Received', `You said: "${userInput}"`);
      setUserInput("");
      nextStep();
    } else {
      Alert.alert('Please enter some text', 'The input field cannot be empty.');
    }
  };

  return (
    <ThemedView style={styles.container}>
      <View style={styles.content}>
        <ThemedText type="title" style={styles.title}>
          AI Onboarding
        </ThemedText>
        
        {step === 0 && (
          <ThemedText style={styles.question}>
            What's a typical day like for you?
          </ThemedText>
        )}
        
        {step === 1 && (
          <ThemedText style={styles.question}>
            Thanks for sharing! Just to make sure I got it right. you work 8
            hours, lift heavy things sometimes, have some mid- and lower-back
            pain. Is that right?
          </ThemedText>
        )}
        
        {step === 2 && (
          <ThemedText style={styles.question}>
            Thanks! I've got your daily routine, but what does your schedule look
            like? I can set up a plan and we can adjust it together.
          </ThemedText>
        )}
        
        {step === 3 && (
          <ThemedText style={styles.question}>
            Great! I'll set up a plan for you. You can always adjust it later.
          </ThemedText>
        )}
        
        <View style={styles.buttonContainer}>
          {step === 1 ? (
            <LargeButton label="Yes" onPress={nextStep} />
          ) : (
            <>
              <LargeButton label="Yes" onPress={nextStep} />
              <TextInput
                style={styles.textInput}
                placeholder="No, I actually..."
                value={userInput}
                onChangeText={setUserInput}
                multiline
              />
              <LargeButton label="Send" onPress={handleSendInput} />
            </>
          )}
        </View>
      </View>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 40,
    textAlign: 'center',
  },
  question: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 40,
    paddingHorizontal: 20,
    lineHeight: 24,
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
    gap: 16,
  },
  textInput: {
    width: '100%',
    height: 100,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    textAlignVertical: 'top',
    backgroundColor: '#fff',
  },
});

export default AIOnboarding;
