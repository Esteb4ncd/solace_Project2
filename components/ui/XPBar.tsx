import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

type XPBarProps = {
  currentProgress?: number;
  totalProgress?: number;
  level?: number;
};

const XPBar = ({ 
  currentProgress = 0, 
  totalProgress = 50, 
  level = 1
}: XPBarProps) => {
  const progressPercentage = Math.min((currentProgress / totalProgress) * 100, 100);

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
            {currentProgress}/{totalProgress}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 375, // 59px circle + 316px bar = 375px total
    height: 59, // Height of the level circle
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  levelCircle: {
    width: 59,
    height: 59,
    borderRadius: 29.5,
    backgroundColor: '#332E62',
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
    width: 316,
    height: 26,
    backgroundColor: '#9CA3AF', // Medium gray
    borderRadius: 13,
    position: 'absolute',
    left: 29.5, // Half overlap with circle (59/2 = 29.5)
    top: 16.5, // Center vertically (59-26)/2 = 16.5
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#6B7280', // Darker gray
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
