import { useExerciseContext } from '@/contexts/ExerciseContext';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

type XPBarProps = {
  currentProgress?: number;
  totalProgress?: number;
  level?: number;
};

const XPBar = ({ 
  currentProgress, 
  totalProgress = 50, 
  level = 1
}: XPBarProps) => {
  const { completedExercises } = useExerciseContext();
  
  // Calculate current progress from completed exercises
  const calculatedProgress = completedExercises.reduce((total, exercise) => total + exercise.xpGained, 0);
  
  // Use calculated progress if no currentProgress prop is provided
  const actualProgress = currentProgress !== undefined ? currentProgress : calculatedProgress;
  
  const progressPercentage = Math.min((actualProgress / totalProgress) * 100, 100);

  return (
    <View style={styles.container}>
      <View style={styles.levelCircle}>
        <Text style={styles.levelText}>{level}</Text>
      </View>
      
      <View style={styles.progressBar}>
        <View 
          style={[
            styles.progressFill, 
            { width: `${progressPercentage}%` }
          ]} 
        />
        <View style={styles.textContainer}>
          <Text style={styles.progressText}>
            {actualProgress}/{totalProgress}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%', // Use full available width
    height: 59, // Height of the level circle
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  levelCircle: {
    width: 59,
    height: 59,
    borderRadius: 29.5,
    backgroundColor: '#332E62', // Dark purple from design
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    left: 0,
    zIndex: 2, // Above the progress bar
  },
  levelText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  progressBar: {
    height: 26,
    backgroundColor: '#949494', // Gray from design
    borderRadius: 13,
    position: 'absolute',
    left: 29.5, // Half overlap with circle (59/2 = 29.5)
    right: 0, // Stretch to right edge
    top: 16.5, // Center vertically (59-26)/2 = 16.5
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#5B52AE', // Purple from design
    borderRadius: 13,
  },
  textContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  progressText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
  },
});

export default XPBar;
