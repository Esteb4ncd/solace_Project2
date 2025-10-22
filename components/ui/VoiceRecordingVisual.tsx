import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Pressable, StyleSheet, View } from 'react-native';
import { Globals } from '../../constants/globals';

interface VoiceRecordingVisualProps {
  onSend: () => void;
}

const VoiceRecordingVisual: React.FC<VoiceRecordingVisualProps> = ({ onSend }) => {
  const [isPaused, setIsPaused] = useState(false);

  // Create animated values right away (one for each bar)
  const animationRefs = useRef(
    Array.from({ length: 20 }, () => new Animated.Value(0.1))
  );
  const animationLoops = useRef<Animated.CompositeAnimation[]>([]);

  // Function to build the looping animations
  const buildAnimations = () => {
    return animationRefs.current.map((anim, index) => {
      const base = 0.1 + (index % 4) * 0.1;
      const max = 0.9 + Math.random() * 0.3;

      return Animated.loop(
        Animated.sequence([
          Animated.timing(anim, {
            toValue: base + Math.random() * (max - base),
            duration: 150 + Math.random() * 200,
            useNativeDriver: false,
          }),
          Animated.timing(anim, {
            toValue: base + Math.random() * (max - base),
            duration: 150 + Math.random() * 200,
            useNativeDriver: false,
          }),
        ])
      );
    });
  };

  // Start animations on mount
  useEffect(() => {
    animationLoops.current = buildAnimations();
    animationLoops.current.forEach(loop => loop.start());

    return () => animationLoops.current.forEach(loop => loop.stop());
  }, []);

  // Play/Pause logic
  const handlePlayPause = () => {
    console.log('Clicked. isPaused =', isPaused);
    if (isPaused) {
      console.log('Resuming...');
      // rebuild and restart animations
      animationLoops.current = buildAnimations();
      animationLoops.current.forEach(loop => loop.start());
      setIsPaused(false);
    } else {
      console.log('Pausing...');
      // stop animations
      animationLoops.current.forEach(loop => loop.stop());
      setIsPaused(true);
    }
  };

  return (
    <View style={styles.container}>
       {/* Play/Pause Button */}
       <Pressable style={styles.controlButton} onPress={handlePlayPause}>
         {isPaused ? (
           <Ionicons name="play" size={16} color="#000" />
         ) : (
           <View style={styles.stopIcon} />
         )}
       </Pressable>

      {/* Animated Bars */}
      <View style={styles.barsContainer}>
        {animationRefs.current.map((anim, i) => (
          <Animated.View
            key={i}
            style={[
              styles.bar,
              {
                height: anim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [4, 50],
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
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  controlButton: {
    backgroundColor: Globals.colors.primaryButton,
    borderRadius: 24,
    width: 52,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: -11,
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
    height: 50,
  },
  bar: {
    width: 3,
    backgroundColor: Globals.colors.primaryButton,
    marginHorizontal: 1,
    borderRadius: 1.5,
  },
  sendButton: {
    backgroundColor: Globals.colors.primaryButton,
    borderRadius: 24,
    width: 52,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12,
  },
});

export default VoiceRecordingVisual;
