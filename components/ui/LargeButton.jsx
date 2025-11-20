import { useButton } from '@react-native-aria/button';
import { useToggleState } from '@react-stately/toggle';
import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { Globals } from '../../constants/globals'; // adjust path if needed

const LargeButton = ({ label, onPress, style, disabled = false }) => {
  const state = useToggleState({});
  const { buttonProps } = useButton(
    { onPress, isDisabled: disabled },
    state
  );

  return (
    <Pressable
      {...buttonProps}
      style={({ pressed }) => [
        styles.button, 
        { backgroundColor: Globals.colors.primaryButton },
        pressed && !disabled && styles.buttonPressed,
        disabled && styles.buttonDisabled,
        style // Allow style override
      ]}
    >
      <Text style={[styles.text, disabled && styles.textDisabled]}>{label}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    display: 'flex',
    width: 352,
    height: 60,
    paddingTop: 14,
    paddingBottom: 15,
    paddingLeft: 60.941,
    paddingRight: 63.059,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 24,
    borderBottomWidth: 2,
    borderBottomColor: Globals.colors.buttonStroke,
  },
  buttonPressed: {
    borderBottomWidth: 0,
  },
  buttonDisabled: {
    opacity: 0.4,
    borderBottomWidth: 0,
  },
  text: {
    ...Globals.fonts.styles.header2Bold,
    textAlign: 'center',
  },
  textDisabled: {
    color: '#FFFFFF',
  },
});

export default LargeButton;
