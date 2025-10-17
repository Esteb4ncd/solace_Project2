import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';
import { Globals } from '../../constants/globals';
import AnswerChip from './AnswerChip';

interface InteractiveSectionProps {
  selectedTasks: string[];
  textInput: string;
  onTaskToggle: (task: string) => void;
  onTextChange: (text: string) => void;
  onVoiceInput: () => void;
}

const questions = {
  question1: {
    title: "What iron work tasks do you typically do?",
    options: [
      "Heavy lifting",
      "Overhead work", 
      "Repetitive tool use",
      "Kneeling"
    ]
  },
  question2: {
    title: "Where do you usually feel pain or discomfort?",
    options: [
      "Left shoulder",
      "Right Shoulder",
      "Right Knee",
      "Central lower back"
    ]
  }
};

const InteractiveSection: React.FC<InteractiveSectionProps> = ({
  selectedTasks,
  textInput,
  onTaskToggle,
  onTextChange,
  onVoiceInput,
}) => {
  // For now, display question 1
  const currentQuestion = questions.question1;
  return (
    <View style={styles.interactiveSection}>
      {/* Task Selection Buttons */}
      <View style={styles.taskButtonsContainer}>
        {currentQuestion.options.map((option) => (
          <AnswerChip
            key={option}
            title={option}
            isSelected={selectedTasks.includes(option)}
            onPress={() => onTaskToggle(option)}
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
          onChangeText={onTextChange}
          multiline={false}
          autoFocus={false}
          blurOnSubmit={false}
        />
        <Pressable style={styles.voiceButton} onPress={onVoiceInput}>
          <Ionicons name="mic" size={16} color="#000" />
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  interactiveSection: {
    width: '100%',
    alignItems: 'center',
  },
  taskButtonsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 20,
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
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12,
  },
});

export default InteractiveSection;
