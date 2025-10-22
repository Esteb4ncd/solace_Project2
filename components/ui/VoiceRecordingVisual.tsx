import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Dimensions, Pressable, StyleSheet, View } from 'react-native';
import { Globals } from '../../constants/globals';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

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
    maxWidth: screenWidth * 0.9, // 90% of screen width
    backgroundColor: Globals.colors.white,
    borderRadius: screenWidth * 0.06, // 6% of screen width
    paddingLeft: screenWidth * 0.04, // 4% of screen width
    paddingRight: screenWidth * 0.01, // 1% of screen width
    paddingVertical: screenWidth * 0.01, // 1% of screen width
    borderWidth: 1,
    borderColor: Globals.colors.accentNormal,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: screenWidth * 0.005 }, // 0.5% of screen width
    shadowOpacity: 0.1,
    shadowRadius: screenWidth * 0.008, // 0.8% of screen width
    elevation: 3,
  },
  controlButton: {
    backgroundColor: Globals.colors.primaryButton,
    borderRadius: screenWidth * 0.06, // 6% of screen width
    width: screenWidth * 0.13, // 13% of screen width
    height: screenWidth * 0.13, // 13% of screen width
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: screenWidth * -0.028, // -2.8% of screen width
  },
  stopIcon: {
    width: screenWidth * 0.04, // 4% of screen width
    height: screenWidth * 0.04, // 4% of screen width
    backgroundColor: '#000',
    borderRadius: screenWidth * 0.005, // 0.5% of screen width
  },
  barsContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: screenWidth * 0.13, // 13% of screen width
  },
  bar: {
    width: screenWidth * 0.008, // 0.8% of screen width
    backgroundColor: Globals.colors.primaryButton,
    marginHorizontal: screenWidth * 0.0025, // 0.25% of screen width
    borderRadius: screenWidth * 0.004, // 0.4% of screen width
  },
  sendButton: {
    backgroundColor: Globals.colors.primaryButton,
    borderRadius: screenWidth * 0.06, // 6% of screen width
    width: screenWidth * 0.13, // 13% of screen width
    height: screenWidth * 0.13, // 13% of screen width
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: screenWidth * 0.03, // 3% of screen width
  },
});

export default VoiceRecordingVisual;
