import React from 'react';
import { Pressable, Text, StyleSheet } from 'react-native';
import { useButton } from '@react-native-aria/button';
import { useToggleState } from '@react-stately/toggle';
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
      style={[styles.button, { backgroundColor: Globals.colors.primaryButton }]}
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
    borderRadius: 8,
  },
  text: {
    color: Globals.colors.textDark,
    fontSize: 20,
    fontWeight: '700',
  },
});

export default LargeButton;
