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
  // Core states
  const [isStarted, setIsStarted] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  // Breathing state
  const [currentPhase, setCurrentPhase] = useState(PHASES.INHALE);
  const [currentCycle, setCurrentCycle] = useState(1);
  const [timeRemaining, setTimeRemaining] = useState(BREATHING_PATTERN.INHALE);

  // Animation
  const circleScale = useRef(new Animated.Value(0.5)).current; // Start at 50% scale
  const timerRef = useRef(null);
  const animationRef = useRef(null);

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
      // Stop any existing animation
      if (animationRef.current) {
        animationRef.current.stop();
      }

      let toValue;
      switch (phase) {
        case PHASES.INHALE:
          toValue = 1; // Scale up to 100%
          break;
        case PHASES.HOLD:
          toValue = 1; // Stay at 100%
          break;
        case PHASES.EXHALE:
          toValue = 0.5; // Scale down to 50%
          break;
        default:
          toValue = 0.5;
      }

      // For HOLD phase, don't animate (stay at current scale)
      if (phase === PHASES.HOLD) {
        return;
      }

      // Create smooth animation
      animationRef.current = Animated.timing(circleScale, {
        toValue,
        duration: duration * 1000, // Convert to milliseconds
        useNativeDriver: false,
      });

      animationRef.current.start();
    },
    [circleScale]
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
        }

        // Move to next phase
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
    circleScale.setValue(0.5);
  }, [circleScale]);

  // Pause exercise
  const handlePause = useCallback(() => {
    setIsPaused(true);
    clearInterval(timerRef.current);

    // Stop animation
    if (animationRef.current) {
      animationRef.current.stop();
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

    // Reset circle
    circleScale.setValue(0.5);
  }, [circleScale]);

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

  return (
    <View style={styles.page}>
      {!isCompleted && (
        <BackButton
          style={styles.backButton}
          onPress={() => {
            /* Handle back navigation */
          }}
        />
      )}

      <View style={styles.container}>
        {isCompleted ? (
          <View style={styles.completionContainer}>
            <Text style={styles.congratsTitle}>Congratulations!</Text>
            <Text style={styles.congratsMessage}>
              You have completed the breathing exercise
            </Text>
          </View>
        ) : showBreathingView ? (
          <View style={styles.breathingContainer}>
            <Text style={styles.phaseText}>{phaseText}</Text>
            <Text style={styles.timerText}>{timeRemaining}</Text>
            <Text style={styles.cycleText}>Cycle {currentCycle} of 4</Text>

            <Animated.View
              style={[
                styles.breathingCircle,
                {
                  transform: [{ scale: circleScale }],
                },
              ]}
            />
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
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  breathingCircle: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: "#7267D9",
    marginTop: 30,
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
  congratsTitle: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#7267D9",
    textAlign: "center",
    marginBottom: 20,
  },
  congratsMessage: {
    fontSize: 22,
    color: "#333",
    textAlign: "center",
    paddingHorizontal: 20,
  },
});

export default breathingExercise;
