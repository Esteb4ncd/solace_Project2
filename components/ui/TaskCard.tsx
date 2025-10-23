import { colors } from '@/constants/styles';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

type TaskCardProps = {
  title: string;
  xpAmount: number;
  xpColor?: string;
  isCompleted?: boolean;
  onPress?: () => void;
};

const TaskCard = ({ 
  title, 
  xpAmount, 
  xpColor = colors.accent.purple,
  isCompleted = false,
  onPress 
}: TaskCardProps) => {
  return (
    <TouchableOpacity 
      style={[styles.container, isCompleted && styles.completedContainer]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text style={[styles.title, isCompleted && styles.completedTitle]}>
        {title}
      </Text>
      <Text style={[styles.xpText, { color: xpColor }]}>
        {xpAmount}xp
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 16, // 16px spacing between cards
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#9CA3AF', // Grey border
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  completedContainer: {
    backgroundColor: '#F3F4F6',
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000',
    flex: 1,
  },
  completedTitle: {
    textDecorationLine: 'line-through',
    opacity: 0.6,
  },
  xpText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default TaskCard;
