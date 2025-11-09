import React from 'react';
import { StyleSheet, View } from 'react-native';
import AnswerChip from './AnswerChip';
import LargeButton from './LargeButton';
import TextAndVoiceInput from './TextAndVoiceInput';

interface InteractiveSectionProps {
  selectedTasks: string[];
  textInput: string;
  onTaskToggle: (task: string) => void;
  onTextChange: (text: string) => void;
  onVoiceInput: () => void;
  onNext: () => void;
  isKeyboardVisible: boolean;
  currentQuestion: {
    title: string;
    options: string[];
  };
}

export const questions = [
  {
    title: "What iron work tasks do you typically do?",
    options: [
      "Heavy lifting",
      "Overhead work", 
      "Repetitive tool use",
      "Kneeling"
    ]
  },
  {
    title: "Where do you usually feel pain or discomfort?",
    options: [
      "Shoulders",
      "Knees",
      "Hands & Wrists",
      "Back"
    ]
  }
];

const InteractiveSection: React.FC<InteractiveSectionProps> = ({
  selectedTasks,
  textInput,
  onTaskToggle,
  onTextChange,
  onVoiceInput,
  onNext,
  isKeyboardVisible,
  currentQuestion,
}) => {
  const hasSelectedTasks = selectedTasks.length > 0;

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
      
      {/* Conditional rendering based on selection */}
      {hasSelectedTasks ? (
        <LargeButton 
          label="Next" 
          onPress={onNext}
        />
      ) : (
        <TextAndVoiceInput
          placeholder="Type or say something..."
          value={textInput}
          onChangeText={onTextChange}
          onVoicePress={onVoiceInput}
          onSend={onNext}
          isKeyboardVisible={isKeyboardVisible}
          multiline={false}
          autoFocus={false}
          blurOnSubmit={false}
        />
      )}
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
