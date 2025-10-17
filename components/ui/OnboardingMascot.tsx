import React from 'react';
import { StyleSheet, View } from 'react-native';

interface OnboardingMascotProps {
  isKeyboardVisible?: boolean;
}

const OnboardingMascot: React.FC<OnboardingMascotProps> = ({ isKeyboardVisible = false }) => {
  return (
    <View style={[
      styles.mascot,
      isKeyboardVisible && styles.mascotKeyboardVisible
    ]}>
      {/* SVG character will be added here later */}
    </View>
  );
};

const styles = StyleSheet.create({
  mascot: {
    width: 190,
    height: 250,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    marginBottom: 30,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#ddd',
    borderStyle: 'dashed',
  },
  mascotKeyboardVisible: {
    width: 80,
    height: 80,
    marginBottom: 20,
  },
});

export default OnboardingMascot;
