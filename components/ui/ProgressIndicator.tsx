import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Globals } from '../../constants/globals';

interface ProgressIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({
  currentStep,
  totalSteps,
}) => {
  return (
    <View style={styles.container}>
      {Array.from({ length: totalSteps }, (_, index) => {
        const stepNumber = index + 1;
        const isActive = stepNumber <= currentStep;
        const isLast = index === totalSteps - 1;
        
        return (
          <View
            key={index}
            style={[
              styles.bar,
              isActive && styles.barActive,
              isLast && styles.lastBar,
            ]}
          />
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bar: {
    height: 4,
    width: 80,
    borderRadius: 2,
    backgroundColor: '#E5E7EB', // Light gray for inactive
    marginRight: 4,
  },
  barActive: {
    backgroundColor: '#7267D9', // Purple from design
  },
  lastBar: {
    marginRight: 0,
  },
});

export default ProgressIndicator;

