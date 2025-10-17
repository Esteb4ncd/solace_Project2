import React from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { Globals } from '../../constants/globals';
import { ThemedText } from '../themed-text';

interface AnswerChipProps {
  title: string;
  isSelected: boolean;
  onPress: () => void;
}

const AnswerChip: React.FC<AnswerChipProps> = ({ title, isSelected, onPress }) => {
  return (
    <Pressable 
      style={[styles.chip, isSelected && styles.chipSelected]} 
      onPress={onPress}
    >
      <ThemedText style={[styles.chipText, isSelected && styles.chipTextSelected]}>
        {title}
      </ThemedText>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  chip: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#ddd',
    borderStyle: 'dashed',
    borderRadius: 25,
    paddingHorizontal: 20,
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 8,
  },
  chipSelected: {
    backgroundColor: '#fff',
    borderColor: '#000',
    borderStyle: 'solid',
  },
  chipText: {
    ...Globals.fonts.styles.header4,
    textAlign: 'center',
  },
  chipTextSelected: {
    ...Globals.fonts.styles.header4,
    textAlign: 'center',
  },
});

export default AnswerChip;
