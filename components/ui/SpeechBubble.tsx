import React, { useEffect, useState } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';

interface SpeechBubbleProps {
  message: string;
  position?: 'left' | 'right' | 'top' | 'bottom';
}

export default function SpeechBubble({ message, position = 'right' }: SpeechBubbleProps) {
  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    // Fade in animation
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [message]);

  if (!message) return null;

  return (
    <Animated.View 
      style={[
        styles.container,
        position === 'left' && styles.leftPosition,
        position === 'right' && styles.rightPosition,
        position === 'top' && styles.topPosition,
        position === 'bottom' && styles.bottomPosition,
        { opacity: fadeAnim }
      ]}
    >
      <View style={styles.bubble}>
        <Text style={styles.text}>{message}</Text>
      </View>
      {/* Speech bubble tail */}
      <View style={[
        styles.tail, 
        position === 'right' && styles.tailRight,
        position === 'left' && styles.tailLeft
      ]} />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    zIndex: 100,
  },
  rightPosition: {
    left: 120,
    top: 20,
  },
  leftPosition: {
    right: 200,
    top: 20,
  },
  topPosition: {
    bottom: 60,
    alignSelf: 'center',
  },
  bottomPosition: {
    top: 60,
    alignSelf: 'center',
  },
  bubble: {
    backgroundColor: '#D3D0F3',
    borderRadius: 16,
    paddingHorizontal: 8,
    paddingVertical: 18,
    maxWidth: 90,
    minHeight: 80,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  text: {
    color: '#28244C',
    fontSize: 13,
    fontWeight: '500',
    textAlign: 'center',
    lineHeight: 18,
  },
  tail: {
    position: 'absolute',
    width: 0,
    height: 0,
    borderLeftWidth: 8,
    borderRightWidth: 8,
    borderTopWidth: 8,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: '#7267D9',
    bottom: -8,
    left: 20,
  },
  tailRight: {
    left: 20,
  },
  tailLeft: {
    width: 0,
    height: 0,
    borderTopWidth: 6,
    borderBottomWidth: 6,
    borderRightWidth: 8,
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
    borderRightColor: '#D3D0F3',
    borderLeftWidth: 0,
    borderLeftColor: 'transparent',
    right: -8,
    left: 'auto',
    top: 25, // Position on right side, vertically centered
    bottom: 'auto',
    transform: [{ rotate: '180deg' }],
  },
});

