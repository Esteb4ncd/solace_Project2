import { borderRadius, colors, shadows, spacing } from '@/constants/styles';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface CompletedTaskProps {
  taskName: string;
  xpGained: number;
}

const CompletedTask: React.FC<CompletedTaskProps> = ({ taskName, xpGained }) => {
  return (
    <View style={styles.container}>
      {/* Completion Checkmark */}
      <View style={styles.checkmarkContainer}>
        <Text style={styles.checkmark}>✓</Text>
      </View>
      
      {/* Task Name with Strikethrough */}
      <Text style={styles.taskName}>{taskName}</Text>
      
      {/* XP Gained */}
      <View style={styles.xpContainer}>
        <Text style={styles.xpLabel}>Gained</Text>
        <Text style={styles.xpAmount}>{xpGained}xp</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#E6E6FA', // Light lavender background
    borderRadius: 24, // Match TaskCard border radius
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.lg, // Match TaskCard margin
    width: 360, // Match TaskCard width
    height: 72, // Match TaskCard height
    borderWidth: 1,
    borderColor: '#9CA3AF', // Match TaskCard border color
    ...shadows.sm,
  },
  checkmarkContainer: {
    width: 24,
    height: 24,
    borderRadius: borderRadius.full,
    backgroundColor: '#28244C', // Dark purple circle
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmark: {
    color: colors.background,
    fontSize: 16,
    fontWeight: 'bold',
  },
  taskName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000', // Black text
    flex: 1,
    marginLeft: spacing.md,
    textDecorationLine: 'line-through',
  },
  xpContainer: {
    alignItems: 'flex-end',
  },
  xpLabel: {
    fontSize: 12,
    color: '#000000', // Black text with 28% opacity effect
    fontWeight: '400',
    opacity: 0.28,
  },
  xpAmount: {
    fontSize: 16,
    color: '#28244C', // Dark purple
    fontWeight: 'bold',
  },
});

export default CompletedTask;
