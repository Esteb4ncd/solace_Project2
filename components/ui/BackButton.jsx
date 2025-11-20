import { useButton } from '@react-native-aria/button';
import { router } from 'expo-router';
import { useToggleState } from '@react-stately/toggle';
import { Pressable, StyleSheet, View } from 'react-native';

const BackButton = ({onPress, style}) => {
  const state = useToggleState({});
  
  const handleBack = () => {
    if (onPress) {
      onPress();
    } else {
      if (router.canGoBack()) {
        router.back();
      } else {
        router.push('/(tabs)/homePage');
      }
    }
  };
  
  const {buttonProps} = useButton(
    {
      onPress: handleBack,
      isDisabled: false
    },
    state,
  );

  return (
    <Pressable
      {...buttonProps}
      style={[styles.button, style]}
    >
      <View style={styles.LeftArrow}></View>
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
});

export default BackButton;