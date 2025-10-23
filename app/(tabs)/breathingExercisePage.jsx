import { useRouter } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { Animated, StyleSheet, Text, View } from "react-native";
import BackButton from "../../components/ui/BackButton";
import LargeButton from "../../components/ui/LargeButton";

// 4-7-8 breathing pattern configuration
const BREATHING_PATTERN = {
  INHALE: 4, // 4 seconds
  HOLD: 7, // 7 seconds
  EXHALE: 8, // 8 seconds
};

const PHASES = {
  INHALE: "INHALE",
  HOLD: "HOLD",
  EXHALE: "EXHALE",
};

function breathingExercise() {
  const router = useRouter();

  // Core states
  const [isStarted, setIsStarted] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  // Breathing state
  const [currentPhase, setCurrentPhase] = useState(PHASES.INHALE);
  const [currentCycle, setCurrentCycle] = useState(1);
  const [timeRemaining, setTimeRemaining] = useState(BREATHING_PATTERN.INHALE);

  // Animation
  const circleSize = useRef(new Animated.Value(145)).current; // Start at 145px
  const circleColor = useRef(new Animated.Value(0)).current; // 0 = #7267D9, 1 = #332E62
  const timerRef = useRef(null);
  const animationRef = useRef(null);
  const colorAnimationRef = useRef(null);

  // Get phase duration
  const getPhaseDuration = useCallback((phase) => {
    return BREATHING_PATTERN[phase];
  }, []);

  // Get next phase in sequence
  const getNextPhase = useCallback((phase) => {
    switch (phase) {
      case PHASES.INHALE:
        return PHASES.HOLD;
      case PHASES.HOLD:
        return PHASES.EXHALE;
      case PHASES.EXHALE:
        return PHASES.INHALE;
      default:
        return PHASES.INHALE;
    }
  }, []);

  // Get phase display text
  const getPhaseText = useCallback((phase) => {
    switch (phase) {
      case PHASES.INHALE:
        return "Breathe In";
      case PHASES.HOLD:
        return "Hold";
      case PHASES.EXHALE:
        return "Breathe Out";
      default:
        return "Breathe In";
    }
  }, []);

  // Start circle animation for current phase
  const startPhaseAnimation = useCallback(
    (phase, duration) => {
      // Stop any existing animations
      if (animationRef.current) {
        animationRef.current.stop();
      }
      if (colorAnimationRef.current) {
        colorAnimationRef.current.stop();
      }

      let sizeToValue, colorToValue;
      switch (phase) {
        case PHASES.INHALE:
          sizeToValue = 275; // Expand to 275px
          colorToValue = 1; // Change to darker color #332E62
          break;
        case PHASES.HOLD:
          sizeToValue = 275; // Stay at 275px
          colorToValue = 1; // Stay at darker color
          break;
        case PHASES.EXHALE:
          sizeToValue = 145; // Shrink to 145px
          colorToValue = 0; // Back to original color #7267D9
          break;
        default:
          sizeToValue = 145;
          colorToValue = 0;
      }

      // For HOLD phase, don't animate (stay at current size and color)
      if (phase === PHASES.HOLD) {
        return;
      }

      // Create smooth size animation
      animationRef.current = Animated.timing(circleSize, {
        toValue: sizeToValue,
        duration: duration * 1000, // Convert to milliseconds
        useNativeDriver: false,
      });

      // Create smooth color animation
      colorAnimationRef.current = Animated.timing(circleColor, {
        toValue: colorToValue,
        duration: duration * 1000, // Convert to milliseconds
        useNativeDriver: false,
      });

      // Start both animations together
      Animated.parallel([
        animationRef.current,
        colorAnimationRef.current,
      ]).start();
    },
    [circleSize, circleColor]
  );

  // Main timer function
  const runTimer = useCallback(() => {
    if (isPaused || isCompleted) return;

    const duration = getPhaseDuration(currentPhase);
    let timeLeft = duration;

    // Start animation for this phase
    startPhaseAnimation(currentPhase, duration);

    timerRef.current = setInterval(() => {
      timeLeft -= 1;
      setTimeRemaining(timeLeft);

      if (timeLeft <= 0) {
        // Phase completed, move to next
        const nextPhase = getNextPhase(currentPhase);

        // Check if we completed a full cycle (exhale -> inhale)
        if (currentPhase === PHASES.EXHALE && nextPhase === PHASES.INHALE) {
          const nextCycle = currentCycle + 1;
          setCurrentCycle(nextCycle);

          // Check if we completed all 4 cycles
          if (nextCycle > 4) {
            setIsCompleted(true);
            setIsStarted(false);
            clearInterval(timerRef.current);
            return;
          }

          // Add 1-second delay between cycles
          clearInterval(timerRef.current);
          setTimeout(() => {
            if (!isPaused && !isCompleted) {
              setCurrentPhase(nextPhase);
              setTimeRemaining(getPhaseDuration(nextPhase));
            }
          }, 1000);
          return;
        }

        // Move to next phase (within same cycle)
        setCurrentPhase(nextPhase);
        setTimeRemaining(getPhaseDuration(nextPhase));

        // Clear current timer - runTimer will be called again by useEffect
        clearInterval(timerRef.current);
      }
    }, 1000);
  }, [
    currentPhase,
    currentCycle,
    isPaused,
    isCompleted,
    getPhaseDuration,
    getNextPhase,
    startPhaseAnimation,
  ]);

  // Start exercise
  const handleStart = useCallback(() => {
    setIsStarted(true);
    setIsPaused(false);
    setIsCompleted(false);
    setCurrentPhase(PHASES.INHALE);
    setCurrentCycle(1);
    setTimeRemaining(BREATHING_PATTERN.INHALE);

    // Reset circle to starting position
    circleSize.setValue(145);
    circleColor.setValue(0);
  }, [circleSize, circleColor]);

  // Pause exercise
  const handlePause = useCallback(() => {
    setIsPaused(true);
    clearInterval(timerRef.current);

    // Stop animation
    if (animationRef.current) {
      animationRef.current.stop();
    }
    if (colorAnimationRef.current) {
      colorAnimationRef.current.stop();
    }
  }, []);

  // Resume exercise
  const handleResume = useCallback(() => {
    setIsPaused(false);
  }, []);

  // Reset exercise
  const handleReset = useCallback(() => {
    setIsStarted(false);
    setIsPaused(false);
    setIsCompleted(false);
    setCurrentPhase(PHASES.INHALE);
    setCurrentCycle(1);
    setTimeRemaining(BREATHING_PATTERN.INHALE);

    // Clear timer and animation
    clearInterval(timerRef.current);
    if (animationRef.current) {
      animationRef.current.stop();
    }
    if (colorAnimationRef.current) {
      colorAnimationRef.current.stop();
    }

    // Reset circle
    circleSize.setValue(145);
    circleColor.setValue(0);

    // Navigate back to home page
    router.push("/homePage");
  }, [circleSize, circleColor, router]);

  // Run timer when started and not paused
  useEffect(() => {
    if (isStarted && !isPaused && !isCompleted) {
      runTimer();
    }

    return () => {
      clearInterval(timerRef.current);
    };
  }, [isStarted, isPaused, isCompleted, currentPhase, runTimer]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearInterval(timerRef.current);
      if (animationRef.current) {
        animationRef.current.stop();
      }
      if (colorAnimationRef.current) {
        colorAnimationRef.current.stop();
      }
    };
  }, []);

  // Get button configuration
  const getButtonConfig = () => {
    if (isCompleted) {
      return { label: "Back to Home", onPress: handleReset };
    }

    if (!isStarted) {
      return { label: "Start", onPress: handleStart };
    }

    if (isPaused) {
      return { label: "Resume", onPress: handleResume };
    }

    return { label: "Pause", onPress: handlePause };
  };

  const { label: buttonLabel, onPress: buttonAction } = getButtonConfig();
  const phaseText = getPhaseText(currentPhase);
  const showBreathingView = isStarted && !isCompleted;

  // Interpolate color based on animation value
  const backgroundColor = circleColor.interpolate({
    inputRange: [0, 1],
    outputRange: ["#7267D9", "#332E62"], // Original purple to darker purple
  });

  return (
    <View style={styles.page}>
      {!isCompleted && (
        <BackButton
          style={styles.backButton}
          onPress={() => router.push("/homePage")}
        />
      )}

      <View style={styles.container}>
        {isCompleted ? (
          <View style={styles.completionContainer}>
            <Text style={[styles.title, { marginBottom: 60 }]}>Congrates!</Text>
            {/* <Image
              source={require("")} // ADD THE CONGRATE IMAGE
              style={styles.image}
            /> */}
            <Text style={[styles.description, { fontWeight: "bold" }]}>
              You’ve gained 10 xp
            </Text>
          </View>
        ) : showBreathingView ? (
          <View style={styles.breathingContainer}>
            <View style={styles.circleContainer}>
              <Animated.View
                style={[
                  styles.breathingCircle,
                  {
                    width: circleSize,
                    height: circleSize,
                    borderRadius: Animated.divide(circleSize, 2),
                    backgroundColor: backgroundColor,
                  },
                ]}
              />
            </View>

            <View style={styles.infoContainer}>
              <Text style={styles.cycleText}>Cycle {currentCycle} of 4</Text>
              <Text style={styles.phaseText}>{phaseText}</Text>
              <Text style={styles.timerText}>{timeRemaining}</Text>
            </View>
          </View>
        ) : (
          <>
            <Text style={styles.title}>
              Click start when you're ready to start
            </Text>
            <Text style={styles.description}>
              Follow the prompts, pause at any time, and click start to continue
            </Text>
            <Text style={styles.description}>
              <Text style={{ fontWeight: "bold" }}>Tips:</Text>
              {"\n"}You have to breathe
            </Text>
          </>
        )}
      </View>

      <LargeButton
        label={buttonLabel}
        onPress={buttonAction}
        disabled={!buttonAction}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingRight: 25.5,
    paddingLeft: 25.5,
    paddingTop: 55,
    paddingBottom: 55,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "flex-start",
    backgroundColor: "#fff",
    marginRight: 20,
    marginLeft: 20,
  },
  breathingContainer: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    paddingVertical: 40,
  },
  circleContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  infoContainer: {
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 20,
  },
  breathingCircle: {
    // Base size will be animated, so no fixed width/height here
  },
  phaseText: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  timerText: {
    fontSize: 48,
    fontWeight: "bold",
    color: "#7267D9",
    marginBottom: 10,
  },
  cycleText: {
    fontSize: 18,
    color: "#666",
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    marginBottom: 20,
    fontWeight: "bold",
  },
  description: {
    fontSize: 20,
    marginBottom: 20,
  },
  backButton: {
    marginTop: 55,
    marginLeft: 25.5,
  },
  completionContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
    image: {
    width: 200,
    height: 200,
    marginVertical: 20,
  },
});

export default breathingExercise;
