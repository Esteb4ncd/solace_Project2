import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

type ProgressBarProps = {
  currentProgress?: number;
  totalProgress?: number;
  level?: number;
  showLevelCircle?: boolean;
};

const ProgressBar = ({ 
  currentProgress = 0, 
  totalProgress = 50, 
  level = 1,
  showLevelCircle = true 
}: ProgressBarProps) => {
  const progressPercentage = Math.min((currentProgress / totalProgress) * 100, 100);

  return (
    <View style={styles.container}>
      {showLevelCircle && (
        <View style={styles.levelCircle}>
          <Text style={styles.levelText}>{level}</Text>
        </View>
      )}
      
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View 
            style={[
              styles.progressFill, 
              { width: `${progressPercentage}%` }
            ]} 
          />
        </View>
        <Text style={styles.progressText}>
          {currentProgress}/{totalProgress}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  levelCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#8B5CF6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    zIndex: 1,
  },
  levelText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  progressContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressBar: {
    flex: 1,
    height: 20,
    backgroundColor: '#E5E7EB',
    borderRadius: 10,
    marginRight: 12,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#8B5CF6',
    borderRadius: 10,
  },
  progressText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    minWidth: 60,
  },
});

export default ProgressBar;
