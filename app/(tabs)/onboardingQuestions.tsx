import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Platform, Pressable, StyleSheet, TextInput, View } from 'react-native';
import { Globals } from '../../constants/globals';

// Character placeholder for future SVG (same as startQuestions)
const CharacterPlaceholder = () => (
  <View style={styles.characterPlaceholder}>
    {/* SVG character will be added here later */}
  </View>
);

// Task selection button component
const TaskButton = ({ title, isSelected, onPress }: { title: string; isSelected: boolean; onPress: () => void }) => (
  <Pressable 
    style={[styles.taskButton, isSelected && styles.taskButtonSelected]} 
    onPress={onPress}
  >
    <ThemedText style={[styles.taskButtonText, isSelected && styles.taskButtonTextSelected]}>
      {title}
    </ThemedText>
  </Pressable>
);

export default function OnboardingQuestionsScreen() {
  const [selectedTasks, setSelectedTasks] = useState<string[]>([]);
  const [textInput, setTextInput] = useState('');

  const handleTaskToggle = (task: string) => {
    setSelectedTasks(prev => 
      prev.includes(task) 
        ? prev.filter(t => t !== task)
        : [...prev, task]
    );
  };

  const handleVoiceInput = () => {
    Alert.alert('Voice Input', 'Voice input functionality would be implemented here');
  };

  const handleBackPress = () => {
    router.push('/(tabs)/startQuestions');
  };

  const tasks = [
    'Heavy lifting',
    'Overhead work', 
    'Repetitive tool use',
    'Kneeling'
  ];

  return (
    <ThemedView style={styles.container}>
      {/* Back Button */}
      <Pressable style={styles.backButton} onPress={handleBackPress}>
        <Ionicons name="arrow-back" size={24} color="#000" />
      </Pressable>

      {/* Character Placeholder */}
      <CharacterPlaceholder />
      
      {/* Main Question */}
      <ThemedText style={styles.question}>
        What iron work tasks do you typically do?
      </ThemedText>
      
      {/* Task Selection Buttons */}
      <View style={styles.taskButtonsContainer}>
        {tasks.map((task, index) => (
          <TaskButton
            key={task}
            title={task}
            isSelected={selectedTasks.includes(task)}
            onPress={() => handleTaskToggle(task)}
          />
        ))}
      </View>
      
      {/* Text Input with Voice Button */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          placeholder="Type or say something"
          placeholderTextColor="#999"
          value={textInput}
          onChangeText={setTextInput}
          multiline={false}
        />
        <Pressable style={styles.voiceButton} onPress={handleVoiceInput}>
          <Ionicons name="mic" size={20} color="#fff" />
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
    // Force mobile-like appearance on web
    ...(Platform.OS === 'web' && {
      maxWidth: 393, // iPhone 16 width
      width: 393, // Fixed width
      height: 852, // iPhone 16 height
      marginHorizontal: 'auto',
      marginVertical: 'auto',
    }),
  },
  backButton: {
    position: 'absolute',
    top: Platform.OS === 'web' ? 20 : 50,
    left: 20,
    zIndex: 10,
    padding: 8,
  },
  characterPlaceholder: {
    width: 190,
    height: 250,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    marginBottom: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#ddd',
    borderStyle: 'dashed',
  },
  question: {
    ...Globals.fonts.styles.header2Bold,
    textAlign: 'center',
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  taskButtonsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 40,
    gap: 12,
  },
  taskButton: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#ddd',
    borderStyle: 'dashed',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    minWidth: 120,
    alignItems: 'center',
  },
  taskButtonSelected: {
    backgroundColor: '#e8f4fd',
    borderColor: '#007AFF',
    borderStyle: 'solid',
  },
  taskButtonText: {
    ...Globals.fonts.styles.body,
    color: '#000',
  },
  taskButtonTextSelected: {
    ...Globals.fonts.styles.button,
    color: '#007AFF',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    maxWidth: 350,
    backgroundColor: '#f8f8f8',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 20,
  },
  textInput: {
    flex: 1,
    ...Globals.fonts.styles.body,
    color: '#000',
    paddingVertical: 4,
  },
  voiceButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 20,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12,
  },
});