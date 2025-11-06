import React from 'react';
import { Image, Pressable, StyleSheet, Text } from 'react-native';

interface PreferenceButtonProps {
  label: string;
  onPress: () => void;
}

const PreferenceButton: React.FC<PreferenceButtonProps> = ({ label, onPress }) => {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.button,
        pressed && styles.buttonPressed
      ]}
      onPress={onPress}
    >
      <Image
        source={require('../../assets/onboarding/backgroundPreferenceButton.png')}
        style={styles.backgroundImage}
        resizeMode="stretch"
      />
      <Text style={styles.label}>{label}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    width: 327,
    height: 160,
    borderRadius: 20,
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    paddingLeft: 24,
    paddingRight: 24,
    paddingTop: 24,
    paddingBottom: 24,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  backgroundImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 327,
    height: 160,
    borderRadius: 20,
  },
  buttonPressed: {
    opacity: 0.8,
  },
  label: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 28,
    fontWeight: '700',
    color: '#443E82',
    textAlign: 'left',
    lineHeight: 28,
  },
});

export default PreferenceButton;

