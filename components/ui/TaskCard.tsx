import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { colors } from '@/constants/styles';

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
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 8, // Only bottom margin for spacing between cards
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  completedContainer: {
    backgroundColor: '#F3F4F6',
  },
  title: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000',
    flex: 1,
  },
  completedTitle: {
    textDecorationLine: 'line-through',
    opacity: 0.6,
  },
  xpText: {
    fontSize: 14,
    fontWeight: '600',
  },
});

export default TaskCard;
