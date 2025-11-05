import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, Button, FlatList, Keyboard, KeyboardAvoidingView, Platform, Pressable, StyleSheet, TextInput, TouchableWithoutFeedback, View } from 'react-native';
import { RetrieveResponse } from 'roughlyai';
import { questions } from '../../components/ui/InteractiveSection';
import OnboardingMascot from '../../components/ui/OnboardingMascot';
import { Globals } from '../../constants/globals';

export default function OnboardingQuestionsScreen() {
  const [selectedTasks, setSelectedTasks] = useState<string[]>([]);
  const [textInput, setTextInput] = useState('');
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const { next, findingIndex, previousTasks } = useLocalSearchParams();

  const [title, setTitle] = useState<string>('What are your Iron Worker daily tasks?');
  const [message, setMessage] = useState<string>('');
  // const [suggest, setSuggest] = useState<string[]>([]);
  const [suggest, setSuggest] = useState<string[]>([]);
  const [num, setNum] = useState<number>(1);

  useEffect(() => {
    // If coming from confirmation page, advance to next finding
    if (next === 'true' && findingIndex) {
      const nextIndex = parseInt(findingIndex as string);
      setCurrentQuestionIndex(nextIndex);
      setSelectedTasks([]);
      setTextInput('');
    }
  }, [next, findingIndex]);

  const GetTasks = async () => {
    try {

      const _resp = await fetch("https://m3rcwp4vofeta3kqelrykbgosi0rswzn.lambda-url.ca-central-1.on.aws/", {
        method: "POST",
        body: JSON.stringify({
          prompt: `Using "worker_tasts.txt", suggest 5 tasks that an iron worker typically do. Return in an array format [], do not include \`\`\`json.`,
          project_name: "solace"
        })
      });

      const _json_string = await _resp.json();
      const _json: { url: string } = JSON.parse(_json_string);

      console.log("what is _json", _json.url);
      // console.log("url", _url)
      const _report: any = await RetrieveResponse(_json.url);
      setSuggest(JSON.parse(_report.answer));
    } catch (e: any) {
      console.log("fail parse or retrieve")
    }
  }

  const GetMuscles = async (_tasks:string) => {
    try {
      const _resp = await fetch("https://m3rcwp4vofeta3kqelrykbgosi0rswzn.lambda-url.ca-central-1.on.aws/", {
        method: "POST",
        body: JSON.stringify({
          prompt: `Using "paper.pdf", suggest 5 muscle groups that may be affected from these tasks, make educated guesses:
          ${_tasks}
          
          Return in an array format [], do not include \`\`\`json.`,
          project_name: "solace"
        })
      });

      const _json_string = await _resp.json();
      const _json: { url: string } = JSON.parse(_json_string);

      console.log("what is _json", _json.url);
      // console.log("url", _url)
      const _report: any = await RetrieveResponse(_json.url);
      setSuggest(JSON.parse(_report.answer));
      setNum(2);
    } catch (e: any) {
      console.log("fail parse or retrieve")
    }
  }

  useEffect(() => {

    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
      setIsKeyboardVisible(true);
    });
    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      setIsKeyboardVisible(false);
    });
    GetTasks();

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

  const handleNextQuestion = async (_num:number) => {

    try {
      if(_num === 1){
        await AsyncStorage.setItem('workertask', JSON.stringify(message));
        setTitle('Do you feel discomfort in any of your muscles?')
        // router.push(`/(tabs)/confirmation`);
        GetMuscles(JSON.stringify(message))
        setMessage("");
      }

      if(_num === 2){
        await AsyncStorage.setItem('muscles', JSON.stringify(message));
        // setTitle('Do you feel discomfort in any of your muscles?')
        router.push(`/(tabs)/homePage`);
      }
    } catch (e) {
      // saving error
    }
    // Navigate to confirmation page with current finding index and selected tasks
    // const selectedTasksParam = selectedTasks.join(',');


    // if (currentQuestionIndex === 1 && previousTasks) {
    //   // This is the second question, pass both previous tasks and current body parts
    //   router.push(`/(tabs)/confirmation?findingIndex=${currentQuestionIndex}&selectedTasks=${selectedTasksParam}&previousTasks=${previousTasks}`);
    // } else {
    //   // First question, just pass current tasks
    //   router.push(`/(tabs)/confirmation?findingIndex=${currentQuestionIndex}&selectedTasks=${selectedTasksParam}`);
    // }
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
              {title}
            </ThemedText>
          </View>

          {/* Interactive Section */}
          <View style={[
            styles.interactiveSectionContainer,
            isKeyboardVisible ? styles.interactiveSectionKeyboardVisible : styles.interactiveSectionKeyboardHidden
          ]}>
            {/* <InteractiveSection
            selectedTasks={selectedTasks}
            textInput={textInput}
            onTaskToggle={handleTaskToggle}
            onTextChange={setTextInput}
            onVoiceInput={handleVoiceInput}
            onNext={handleNextQuestion}
            isKeyboardVisible={isKeyboardVisible}
            currentQuestion={currentQuestion}
          /> */}

            <ThemedText style={{ color: "#666" }}>
              Some suggestions might include...
            </ThemedText>
            <View
            // style={{ height: 150, overflow:"hidden" }}
            >

              <FlatList
                style={{ height: 150 }}
                showsVerticalScrollIndicator={true}
                data={suggest}
                ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
                renderItem={({ item }) =>
                  <TouchableWithoutFeedback onPress={() => setMessage((p) => p + ' ' + item)}>

                    <ThemedText style={{ color: "#666", backgroundColor: "#CCC", padding: 5 }}>{item}</ThemedText>
                  </TouchableWithoutFeedback>
                }
              />
            </View>
            <TextInput
              placeholder="Type your message here..."
              style={{ minHeight: 100, borderColor: "#CCC", borderWidth: 1 }}
              value={message}
              onChangeText={setMessage}
              multiline={true}
              numberOfLines={4}
              textAlignVertical="top" // ensures text starts at the top
            />
            <Button onPress={() => handleNextQuestion(num)} title='Next' />
          </View>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  keyboardAvoidingView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButton: {
    position: 'absolute',
    top: Platform.OS === 'web' ? 20 : 50,
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