import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useRef } from 'react';
import { Animated, Pressable, StyleSheet, View } from 'react-native';
import { Globals } from '../../constants/globals';

interface VoiceRecordingVisualProps {
  onStop: () => void;
  onSend: () => void;
  isPaused?: boolean;
}

const VoiceRecordingVisual: React.FC<VoiceRecordingVisualProps> = ({ onStop, onSend, isPaused = false }) => {
  const animationRefs = useRef<Animated.Value[]>([]);
  
  // Initialize animated values for each bar
  useEffect(() => {
    animationRefs.current = Array.from({ length: 20 }, () => new Animated.Value(0.3));
    
    // Start animations immediately when component mounts
    const startAnimations = () => {
      const animations = animationRefs.current.map((anim, index) => 
        Animated.loop(
          Animated.sequence([
            Animated.timing(anim, {
              toValue: Math.random() * 0.7 + 0.3, // Random height between 0.3 and 1
              duration: 200 + Math.random() * 300, // Random duration
              useNativeDriver: false,
            }),
            Animated.timing(anim, {
              toValue: Math.random() * 0.7 + 0.3,
              duration: 200 + Math.random() * 300,
              useNativeDriver: false,
            }),
          ])
        )
      );
      
      animations.forEach(animation => animation.start());
      return animations;
    };

    const animations = startAnimations();
    
    return () => {
      animations.forEach(animation => animation.stop());
    };
  }, []);

  // Control animations based on pause state
  useEffect(() => {
    if (animationRefs.current.length > 0) {
      animationRefs.current.forEach(anim => {
        if (isPaused) {
          anim.stopAnimation();
        } else {
          // Resume animation with new random values
          Animated.loop(
            Animated.sequence([
              Animated.timing(anim, {
                toValue: Math.random() * 0.7 + 0.3,
                duration: 200 + Math.random() * 300,
                useNativeDriver: false,
              }),
              Animated.timing(anim, {
                toValue: Math.random() * 0.7 + 0.3,
                duration: 200 + Math.random() * 300,
                useNativeDriver: false,
              }),
            ])
          ).start();
        }
      });
    }
  }, [isPaused]);

  return (
    <View style={styles.container}>
      {/* Stop/Pause Button */}
      <Pressable style={styles.stopButton} onPress={onStop}>
        {isPaused ? (
          <Ionicons name="play" size={16} color="#000" />
        ) : (
          <View style={styles.stopIcon} />
        )}
      </Pressable>
      
      {/* Animated Bars */}
      <View style={styles.barsContainer}>
        {animationRefs.current.map((anim, index) => (
          <Animated.View
            key={index}
            style={[
              styles.bar,
              {
                height: anim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [8, 40], // Min and max bar heights
                }),
              },
            ]}
          />
        ))}
      </View>
      
      {/* Send Button */}
      <Pressable style={styles.sendButton} onPress={onSend}>
        <Ionicons name="arrow-up" size={16} color="#000" />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    maxWidth: 350,
    backgroundColor: Globals.colors.white,
    borderRadius: 24,
    paddingLeft: 16,
    paddingRight: 4,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: Globals.colors.accentNormal,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  stopButton: {
    backgroundColor: '#90EE90', // Light green
    borderRadius: 24,
    width: 52,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  stopIcon: {
    width: 16,
    height: 16,
    backgroundColor: '#000',
    borderRadius: 2,
  },
  barsContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 40,
  },
  bar: {
    width: 3,
    backgroundColor: '#90EE90', // Light green
    marginHorizontal: 1,
    borderRadius: 1.5,
  },
  sendButton: {
    backgroundColor: '#90EE90', // Light green
    borderRadius: 24,
    width: 52,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12,
  },
});

export default VoiceRecordingVisual;
