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
    height: 16,
    width: 86,
    borderRadius: 8,
    backgroundColor: '#D3D0F3', // Light purple/lavender for inactive
    marginRight: 4,
  },
  barActive: {
    backgroundColor: '#7267D9', // Purple for active
  },
  lastBar: {
    marginRight: 0,
  },
});

export default ProgressIndicator;

