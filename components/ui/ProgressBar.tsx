import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

type ProgressBarProps = {
  currentProgress?: number;
  totalProgress?: number;
  level?: number;
  showLevelCircle?: boolean;
  isHealthBar?: boolean;
};

const ProgressBar = ({ 
  currentProgress = 0, 
  totalProgress = 50, 
  level = 1,
  showLevelCircle = true,
  isHealthBar = false
}: ProgressBarProps) => {
  const progressPercentage = Math.min((currentProgress / totalProgress) * 100, 100);

  if (isHealthBar) {
    return (
      <View style={styles.healthContainer}>
        <View style={styles.healthBar}>
          <View 
            style={[
              styles.healthFill, 
              { width: `${progressPercentage}%` }
            ]} 
          />
        </View>
        <Text style={styles.healthText}>
          Health: {Math.round(progressPercentage)}%
        </Text>
      </View>
    );
  }

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
    height: 8,
    backgroundColor: '#C5C5C5',
    borderRadius: 4,
    marginRight: 12,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#7267D9',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    minWidth: 60,
  },
  // Health bar styles
  healthContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  healthBar: {
    width: 352,
    height: 42,
    backgroundColor: '#DEDFDF',
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 8,
  },
  healthFill: {
    height: '100%',
    backgroundColor: '#1BAA55',
    borderRadius: 8,
  },
  healthText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000000',
  },
});

export default ProgressBar;
