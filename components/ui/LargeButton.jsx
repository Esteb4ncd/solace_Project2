import { useButton } from '@react-native-aria/button';
import { useToggleState } from '@react-stately/toggle';
import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { Globals } from '../../constants/globals'; // adjust path if needed

const LargeButton = ({ label, onPress }) => {
  const state = useToggleState({});
  const { buttonProps } = useButton(
    { onPress, isDisabled: false },
    state
  );

  return (
    <Pressable
      {...buttonProps}
      style={({ pressed }) => [
        styles.button, 
        { backgroundColor: Globals.colors.primaryButton },
        pressed && styles.buttonPressed
      ]}
    >
      <Text style={styles.text}>{label}</Text>
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
  text: {
    ...Globals.fonts.styles.header2Bold,
    textAlign: 'center',
  },
});

export default LargeButton;
