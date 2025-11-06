import React from 'react';
import { Image, StyleSheet, View } from 'react-native';

interface OnboardingMascotProps {
  isKeyboardVisible?: boolean;
}

const OnboardingMascot: React.FC<OnboardingMascotProps> = ({ isKeyboardVisible = false }) => {
  return (
    <View style={[
      styles.mascot,
      isKeyboardVisible && styles.mascotKeyboardVisible
    ]}>
      <Image 
        source={require('../../assets/SollyStates/happysolly.png')}
        style={styles.image}
        resizeMode="contain"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  mascot: {
    width: 190,
    height: 250,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mascotKeyboardVisible: {
    width: 80,
    height: 80,
  },
  image: {
    width: '100%',
    height: '100%',
  },
});

export default OnboardingMascot;
