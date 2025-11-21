import React, { useEffect, useRef } from 'react';
import { Animated, Image, Modal, StyleSheet, Text, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

interface StreakSplashScreenProps {
  visible: boolean;
  streakCount: number;
  onClose: () => void;
}

export default function StreakSplashScreen({ visible, streakCount, onClose }: StreakSplashScreenProps) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.5)).current;
  const streakScaleAnim = useRef(new Animated.Value(0)).current;
  const streakRotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      // Reset animations
      fadeAnim.setValue(0);
      scaleAnim.setValue(0.5);
      streakScaleAnim.setValue(0);
      streakRotateAnim.setValue(0);

      // Sequence of animations
      Animated.sequence([
        // Fade in and scale up Solly
        Animated.parallel([
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.spring(scaleAnim, {
            toValue: 1,
            tension: 50,
            friction: 7,
            useNativeDriver: true,
          }),
        ]),
        // Small delay
        Animated.delay(200),
        // Streak icon animation - scale and rotate
        Animated.parallel([
          Animated.spring(streakScaleAnim, {
            toValue: 1,
            tension: 50,
            friction: 7,
            useNativeDriver: true,
          }),
          Animated.timing(streakRotateAnim, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true,
          }),
        ]),
        // Hold for 2 seconds
        Animated.delay(2000),
        // Fade out
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
      ]).start(() => {
        onClose();
      });
    }
  }, [visible]);

  const streakRotation = streakRotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="none"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <Animated.View
          style={[
            styles.container,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          {/* Solly XPGain Image */}
          <Image
            source={require('@/assets/SollyStates/SollyXPGain.png')}
            style={styles.sollyImage}
            resizeMode="contain"
          />

          {/* Streak Icon with Animation */}
          <View style={styles.streakIconContainer}>
            <Animated.View
              style={[
                styles.streakIconWrapper,
                {
                  transform: [
                    { scale: streakScaleAnim },
                    { rotate: streakRotation },
                  ],
                },
              ]}
            >
              <Svg width={80} height={80} viewBox="0 0 24 24" fill="none">
                <Path
                  d="M12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2ZM11.8037 3.89062C11.6075 3.8476 11.42 4.25247 11.0459 5.06055L8.31445 10.96C7.72284 12.2378 7.42776 12.8774 7.72266 13.3389C8.01776 13.7999 8.72191 13.7998 10.1299 13.7998H11.5C11.7356 13.7998 11.8535 13.7999 11.9268 13.873C12 13.9462 12 14.0642 12 14.2998V18.7295C12 19.6202 12.0001 20.0662 12.1963 20.1094C12.3925 20.1524 12.58 19.7475 12.9541 18.9395L15.6855 13.04C16.2772 11.7622 16.5722 11.1226 16.2773 10.6611C15.9822 10.2001 15.2781 10.2002 13.8701 10.2002H12.5C12.2644 10.2002 12.1465 10.2001 12.0732 10.127C12 10.0538 12 9.93577 12 9.7002V5.27051C12 4.37985 11.9999 3.93384 11.8037 3.89062Z"
                  fill="#C2E273"
                />
              </Svg>
            </Animated.View>
            <Text style={styles.streakNumber}>{streakCount}</Text>
          </View>

          {/* Celebration Text */}
          <Text style={styles.celebrationText}>
            Day Streak!
          </Text>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  sollyImage: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  streakIconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    gap: 16,
  },
  streakIconWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  streakNumber: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#28244C',
  },
  celebrationText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#28244C',
    textAlign: 'center',
  },
});

