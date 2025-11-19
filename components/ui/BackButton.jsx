import { useButton } from '@react-native-aria/button';
import { router, usePathname } from 'expo-router';
import { useToggleState } from '@react-stately/toggle';
import { useEffect } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

const BackButton = ({onPress, style}) => {
  const state = useToggleState({});
  const pathname = usePathname();
  
  // Intercept navigation to sign in page and redirect to homePage
  useEffect(() => {
    if (pathname?.includes('signInPage') || pathname === '/(tabs)' || pathname === '/') {
      // If we somehow ended up on sign in page, redirect to homePage
      router.push('/(tabs)/homePage');
    }
  }, [pathname]);
  
  const handleBack = () => {
    if (onPress) {
      onPress();
    } else {
      // Never allow navigation back to sign in page
      // If current path is sign in page, go to homePage
      if (pathname?.includes('signInPage') || pathname === '/(tabs)' || pathname === '/') {
        router.push('/(tabs)/homePage');
        return;
      }
      
      // Check if we can go back
      if (router.canGoBack()) {
        router.back();
        // Use setTimeout to check if we navigated to sign in page and redirect if so
        setTimeout(() => {
          const currentPath = router.pathname || pathname;
          if (currentPath?.includes('signInPage') || currentPath === '/(tabs)' || currentPath === '/') {
            router.push('/(tabs)/homePage');
          }
        }, 100);
      } else {
        // If no history, go to homePage instead of defaulting to index (sign in page)
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