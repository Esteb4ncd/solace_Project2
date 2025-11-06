import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Animated, StyleSheet, Text, View } from "react-native";
import Svg, { Circle, Defs, RadialGradient, Stop } from "react-native-svg";
import BackButton from "../../components/ui/BackButton";
import ExercisePage from "../../components/ui/ExercisePage";
import LargeButton from "../../components/ui/LargeButton";
import { useExerciseContext } from "../../contexts/ExerciseContext";

// Create animated SVG components
const AnimatedSvg = Animated.createAnimatedComponent(Svg);
const AnimatedCircle = Animated.createAnimatedComponent(Circle);

// Breathing pattern configurations
const BREATHING_PATTERNS = {
  "4-7-8 Breathing": {
    INHALE: 4,
    HOLD: 7,
    EXHALE: 8,
    cycles: 4,
    phases: ["INHALE", "HOLD", "EXHALE"],
  },
  "Box Breathing": {
    INHALE: 4,
    HOLD_AFTER_INHALE: 4,
    EXHALE: 4,
    HOLD_AFTER_EXHALE: 4,
    cycles: 3,
    phases: ["INHALE", "HOLD_AFTER_INHALE", "EXHALE", "HOLD_AFTER_EXHALE"],
  },
  "Deep Breathing": {
    INHALE: 4,
    EXHALE: 8,
    cycles: 5,
    phases: ["INHALE", "EXHALE"],
  },
};

const PHASES = {
  INHALE: "INHALE",
  HOLD: "HOLD",
  EXHALE: "EXHALE",
  HOLD_AFTER_INHALE: "HOLD_AFTER_INHALE",
  HOLD_AFTER_EXHALE: "HOLD_AFTER_EXHALE",
};

function breathingExercise() {
  const router = useRouter();
  const { exerciseType } = useLocalSearchParams();
  const { markExerciseComplete } = useExerciseContext();

  // Get the current breathing pattern based on exercise type
  const currentExerciseType = exerciseType || "4-7-8 Breathing";

  const breathingConfig = useMemo(() => {
    const pattern = BREATHING_PATTERNS[currentExerciseType];
    return {
      pattern,
      maxCycles: pattern.cycles,
      phaseSequence: pattern.phases,
    };
  }, [currentExerciseType]);

  const {
    pattern: BREATHING_PATTERN,
    maxCycles,
    phaseSequence,
  } = breathingConfig;

  // Core states
  const [showConfirmation, setShowConfirmation] = useState(true);
  const [isStarted, setIsStarted] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  // Breathing state
  const initialPhase = PHASES[phaseSequence[0]];
  const [currentPhase, setCurrentPhase] = useState(initialPhase);
  const [currentCycle, setCurrentCycle] = useState(1);
  const [timeRemaining, setTimeRemaining] = useState(() => {
    return BREATHING_PATTERN[phaseSequence[0]];
  });

  // Animation
  const circleSize = useRef(new Animated.Value(145)).current; // Start at 145px
  const circleColor = useRef(new Animated.Value(0)).current; // 0 = #7267D9, 1 = #332E62
  const timerRef = useRef(null);
  const animationRef = useRef(null);
  const colorAnimationRef = useRef(null);

  // Get phase duration
  const getPhaseDuration = useCallback(
    (phase) => {
      const duration = BREATHING_PATTERN[phase];
      if (currentExerciseType === "Deep Breathing") {
        console.log(
          `Deep Breathing - Phase: ${phase}, Duration: ${duration}, Pattern:`,
          BREATHING_PATTERN
        );
      }
      return duration;
    },
    [breathingConfig, currentExerciseType]
  );

  // Get next phase in sequence
  const getNextPhase = useCallback(
    (phase) => {
      const currentIndex = phaseSequence.indexOf(phase);
      if (currentIndex === -1) return PHASES.INHALE;

      const nextIndex = (currentIndex + 1) % phaseSequence.length;
      return PHASES[phaseSequence[nextIndex]];
    },
    [breathingConfig]
  );

  // Get phase display text
  const getPhaseText = useCallback((phase) => {
    switch (phase) {
      case PHASES.INHALE:
        return "Breathe In";
      case PHASES.HOLD:
      case PHASES.HOLD_AFTER_INHALE:
      case PHASES.HOLD_AFTER_EXHALE:
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
        case PHASES.HOLD_AFTER_INHALE:
          sizeToValue = 275; // Stay at 275px
          colorToValue = 1; // Stay at darker color
          break;
        case PHASES.EXHALE:
          sizeToValue = 145; // Shrink to 145px
          colorToValue = 0; // Back to original color #7267D9
          break;
        case PHASES.HOLD_AFTER_EXHALE:
          sizeToValue = 145; // Stay at 145px
          colorToValue = 0; // Stay at original color
          break;
        default:
          sizeToValue = 145;
          colorToValue = 0;
      }

      // For HOLD phases, don't animate (stay at current size and color)
      if (
        phase === PHASES.HOLD ||
        phase === PHASES.HOLD_AFTER_INHALE ||
        phase === PHASES.HOLD_AFTER_EXHALE
      ) {
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

        // Check if we completed a full cycle (last phase -> first phase)
        const lastPhaseInSequence =
          PHASES[phaseSequence[phaseSequence.length - 1]];
        const firstPhaseInSequence = PHASES[phaseSequence[0]];

        if (
          currentPhase === lastPhaseInSequence &&
          nextPhase === firstPhaseInSequence
        ) {
          const nextCycle = currentCycle + 1;
          setCurrentCycle(nextCycle);

          // Check if we completed all cycles
          if (nextCycle > maxCycles) {
            setIsCompleted(true);
            setIsStarted(false);
            clearInterval(timerRef.current);
            markExerciseComplete(maxCycles.toString(), currentExerciseType, 5);
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
    breathingConfig,
  ]);

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

  // Start exercise from confirmation
  const handleStartExercise = useCallback(() => {
    setShowConfirmation(false);
    setIsStarted(true);
    setIsPaused(false);
  }, []);

  // Reset exercise
  const handleReset = useCallback(() => {
    setShowConfirmation(false);
    setIsStarted(false);
    setIsPaused(false);
    setIsCompleted(false);
    setCurrentPhase(PHASES[phaseSequence[0]]);
    setCurrentCycle(1);
    setTimeRemaining(getPhaseDuration(PHASES[phaseSequence[0]]));

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
    router.push("/(tabs)/mentalHomePage");
  }, [circleSize, circleColor, router, breathingConfig, getPhaseDuration]);

  // Go back to confirmation
  const handleBackToConfirmation = useCallback(() => {
    setShowConfirmation(true);
    setIsStarted(false);
    setIsPaused(false);
    setIsCompleted(false);
    setCurrentPhase(PHASES[phaseSequence[0]]);
    setCurrentCycle(1);
    setTimeRemaining(getPhaseDuration(PHASES[phaseSequence[0]]));

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
  }, [circleSize, circleColor, breathingConfig, getPhaseDuration]);

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

    if (isPaused) {
      return { label: "Resume", onPress: handleResume };
    }

    return { label: "Pause", onPress: handlePause };
  };

  const { label: buttonLabel, onPress: buttonAction } = getButtonConfig();
  const phaseText = getPhaseText(currentPhase);

  // Show confirmation page before starting
  if (showConfirmation) {
    return (
      <ExercisePage
        title={currentExerciseType}
        subtitle={`+5 XP • ${maxCycles} cycles`}
        characterImage={require("@/assets/hompageAssets/SollySitting.png")}
        bottomText="Ready to begin your breathing exercise?"
        buttonLabel="Start Exercise"
        onButtonPress={handleStartExercise}
        onBack={() => router.push("/(tabs)/mentalHomePage")}
        showBackButton={true}
      />
    );
  }

  // If completed, show the XP gain page as full screen
  if (isCompleted) {
    return (
      <ExercisePage
        title="Congrats!"
        characterImage={require("@/assets/SollyStates/SollyXPGain.png")}
        bottomText="You've gained 5 xp"
        buttonLabel="Back to Home"
        onButtonPress={handleReset}
        showBackButton={false}
      />
    );
  }

  return (
    <View style={styles.page}>
      <BackButton
        style={styles.backButton}
        onPress={handleBackToConfirmation}
      />

      <View style={styles.container}>
        <View style={styles.breathingContainer}>
          <View style={styles.titleContainer}>
            <Text style={styles.exerciseTitle}>{currentExerciseType}</Text>
          </View>

          <View style={styles.circleContainer}>
            <AnimatedSvg
              width={circleSize}
              height={circleSize}
              style={styles.breathingCircle}
            >
              <Defs>
                {/* Regular purple gradient (smaller circle) */}
                <RadialGradient id="regularGradient" cx="50%" cy="50%" r="50%">
                  <Stop offset="0%" stopColor="#9F97E9" />
                  <Stop offset="100%" stopColor="#6657F5" />
                </RadialGradient>

                {/* Darker purple gradient (bigger circle) */}
                <RadialGradient id="darkGradient" cx="50%" cy="50%" r="50%">
                  <Stop offset="0%" stopColor="#685EC8" />
                  <Stop offset="100%" stopColor="#332E62" />
                </RadialGradient>
              </Defs>

              <AnimatedCircle
                cx={Animated.divide(circleSize, 2)}
                cy={Animated.divide(circleSize, 2)}
                r={Animated.divide(circleSize, 2)}
                fill="url(#regularGradient)"
                opacity={Animated.subtract(1, circleColor)}
              />

              <AnimatedCircle
                cx={Animated.divide(circleSize, 2)}
                cy={Animated.divide(circleSize, 2)}
                r={Animated.divide(circleSize, 2)}
                fill="url(#darkGradient)"
                opacity={circleColor}
              />
            </AnimatedSvg>
          </View>

          <View style={styles.infoContainer}>
            <Text style={styles.cycleText}>
              Cycle {currentCycle} of {maxCycles}
            </Text>
            <Text style={styles.phaseText}>{phaseText}</Text>
            <Text style={styles.timerText}>{timeRemaining}</Text>
          </View>
        </View>
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
  titleContainer: {
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 20,
    paddingBottom: 10,
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
  exerciseTitle: {
    fontSize: 30,
    fontWeight: "bold",
    color: "black",
    marginBottom: 10,
    textAlign: "center",
  },
  cycleText: {
    fontSize: 18,
    color: "#666",
    marginBottom: 20,
  },
  backButton: {
    position: "absolute",
    top: 55,
    left: 25.5,
    zIndex: 10,
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
