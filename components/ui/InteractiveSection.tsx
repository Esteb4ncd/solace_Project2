import React from 'react';
import { StyleSheet, View } from 'react-native';
import AnswerChip from './AnswerChip';
import TextInputWithVoice from './TextInputWithVoice';

interface InteractiveSectionProps {
  selectedTasks: string[];
  textInput: string;
  onTaskToggle: (task: string) => void;
  onTextChange: (text: string) => void;
  onVoiceInput: () => void;
  isKeyboardVisible: boolean;
  currentQuestion: {
    title: string;
    options: string[];
  };
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
  isKeyboardVisible,
  currentQuestion,
}) => {
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
      <TextInputWithVoice
        placeholder="Type or click to say something..."
        value={textInput}
        onChangeText={onTextChange}
        onVoicePress={onVoiceInput}
        isKeyboardVisible={isKeyboardVisible}
        multiline={false}
        autoFocus={false}
        blurOnSubmit={false}
      />
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
});

export default InteractiveSection;
