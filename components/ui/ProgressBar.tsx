import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

type ProgressBarProps = {
  currentProgress?: number;
  totalProgress?: number;
  level?: number;
  showLevelCircle?: boolean;
  isXpBar?: boolean;
};

const ProgressBar = ({ 
  currentProgress = 0, 
  totalProgress = 50, 
  level = 1,
  showLevelCircle = true,
  isXpBar = false
}: ProgressBarProps) => {
  const progressPercentage = Math.min((currentProgress / totalProgress) * 100, 100);

  if (isXpBar) {
    return (
      <View style={styles.xpContainer}>
        <View style={styles.xpLevelCircle}>
          <Text style={styles.xpLevelText}>{level}</Text>
        </View>
        
        <View style={styles.xpProgressBar}>
          <View 
            style={[
              styles.xpProgressFill, 
              { width: `${progressPercentage}%` }
            ]} 
          />
          <View style={styles.xpTextContainer}>
            <Text style={styles.xpProgressText}>
              {currentProgress}/{totalProgress}
            </Text>
          </View>
        </View>
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
  // XP bar styles
  xpContainer: {
    width: 260,
    height: 59,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  xpLevelCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#8B5CF6', // Dark purple
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  xpLevelText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  xpProgressBar: {
    flex: 1,
    height: 20,
    backgroundColor: '#9CA3AF', // Medium gray
    borderRadius: 10,
    position: 'relative',
    overflow: 'hidden',
  },
  xpProgressFill: {
    height: '100%',
    backgroundColor: '#6B7280', // Darker gray
    borderRadius: 10,
  },
  xpTextContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  xpProgressText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
  },
});

export default ProgressBar;
