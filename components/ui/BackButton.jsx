
import { useButton } from '@react-native-aria/button';
import { useNavigation } from '@react-navigation/native';
import { useToggleState } from '@react-stately/toggle';
import { Pressable, StyleSheet, View } from 'react-native';

const BackButton = ({onPress, style, highContrast = false}) => {
  const state = useToggleState({});
  const navigation = useNavigation();
  const {buttonProps} = useButton(
    {
      onPress: onPress ? onPress : () => navigation.goBack(),
      isDisabled: false
    },
    state,
  );

  return (
    <Pressable
      {...buttonProps}
      style={[
        styles.button,
        highContrast && styles.buttonHighContrast,
        style,
      ]}
    >
      <View
        style={[
          styles.LeftArrow,
          highContrast && styles.leftArrowHighContrast,
        ]}
      ></View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    display: 'flex',
    height: 48,
    width: 48,
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 20,
    paddingRight: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
    overflow: 'hidden',
    backgroundColor: '#B0A9F8',
    
  },
  LeftArrow: {
    left: 2.3,
    width: 18,
    height: 18,
    borderLeftWidth: 4.77,
    borderBottomWidth: 4.77,
    transform: [{ rotate: "45deg" }],
    borderColor: "#FFFFFF",
    borderLeft: "4.77px solid white",
    borderBottom: "4.77px solid white",
  },
  buttonHighContrast: {
    backgroundColor: '#000000',
    borderWidth: 2,
    borderColor: '#000000',
  },
  leftArrowHighContrast: {
    borderColor: '#FFFFFF',
  },
});

export default BackButton;