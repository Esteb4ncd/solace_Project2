import { router } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { Animated, Image, Platform, Pressable, StyleSheet, Text, View } from "react-native";
import CircularBackArrowButton from "../../components/ui/CircularBackArrowButton";
import CircularNextArrowButton from "../../components/ui/CircularNextArrowButton";

function tutorial() {
  const [currentStep, setCurrentStep] = useState(0);
  const totalSteps = 3;
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;
  const backButtonAnim = useRef(new Animated.Value(0)).current;
  const nextButtonAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Animate progress indicator width based on current step
    Animated.timing(progressAnim, {
      toValue: currentStep,
      duration: 300,
      useNativeDriver: false,
    }).start();

    // Animate back button
    Animated.timing(backButtonAnim, {
      toValue: currentStep > 0 ? 1 : 0,
      duration: 250,
      useNativeDriver: true,
    }).start();

    // Animate next button (keep visible on all steps)
    Animated.timing(nextButtonAnim, {
      toValue: 1,
      duration: 250,
      useNativeDriver: true,
    }).start();
  }, [currentStep]);

  function animateStepTransition(callback) {
    // Fade out current content
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 150,
      useNativeDriver: true,
    }).start(() => {
      // Change step
      callback();
      // Fade in new content
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }).start();
    });
  }

  function handleNext() {
    if (currentStep < totalSteps - 1) {
      animateStepTransition(() => setCurrentStep(currentStep + 1));
    } else {
      // Navigate to start questions at the end of the tutorial
      router.push('/(tabs)/startQuestions');
    }
  }

  function handleBack() {
    if (currentStep > 0) {
      animateStepTransition(() => setCurrentStep(currentStep - 1));
    }
  }

  function handleSkip() {
    router.push('/(tabs)/startQuestions');
  }

  function renderStepContent() {
    switch (currentStep) {
      case 0:
        return (
          <View style={styles.stepContent}>
            <Image
              style={[styles.stepImage, { width: 182 }]}
              source={require("../../assets/images/tutorial_mascot01.png")}
            />
            <Text style={styles.stepTitle}>Meet Solly</Text>
            <Text style={styles.stepSubheading}>
              Solly’s life is in your hands.
            </Text>
            <Text style={styles.stepDescription}>
              Complete daily exercises to earn XP, which is Solly’s health!
            </Text>
          </View>
        );
      case 1:
        return (
          <View style={styles.stepContent}>
            <Image
              style={[styles.stepImage, { width: 228.43 }]}
              source={require("../../assets/images/tutorial_mascot02.png")}
            />
            <Text style={styles.stepTitle}>Feel like skipping days?</Text>
            <Text style={styles.stepDescription}>
              You’ll lose XP and we’ll rip his arms off!
            </Text>
          </View>
        );
      case 2:
        return (
          <View style={styles.stepContent}>
            <Image
              style={[styles.stepImage, { width: 163.88 }]}
              source={require("../../assets/images/tutorial_mascot03.png")}
            />
            <Text style={styles.stepTitle}>
              Completing your exercises everyday?
            </Text>
            <Text style={styles.stepDescription}>
              You’ll level up and we’ll pump him with steroids! Yay!
            </Text>
          </View>
        );
      default:
        return null;
    }
  }

  function renderStepIndicator() {
    return (
      <View style={styles.progressBarContainer}>
        {[0, 1, 2].map((step) => {
          const isActive = currentStep === step;
          const animatedWidth = progressAnim.interpolate({
            inputRange: [step - 0.5, step, step + 0.5],
            outputRange: [4, 36, 4],
            extrapolate: "clamp",
          });

          return (
            <Animated.View
              key={step}
              style={[
                styles.stroke,
                {
                  width: isActive ? animatedWidth : 4,
                  opacity: currentStep >= step ? 1 : 0.3,
                },
              ]}
            />
          );
        })}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Pressable onPress={handleSkip} style={styles.skipButtonContainer}>
        <Text style={styles.skip}>Skip</Text>
      </Pressable>
      <Animated.View style={[styles.stepContainer, { opacity: fadeAnim }]}>
        {renderStepContent()}
      </Animated.View>
      <View style={styles.progressIndicatorContainer}>
        {renderStepIndicator()}
        <View style={styles.buttonsContainer}>
          <Animated.View
            style={{
              opacity: backButtonAnim,
              transform: [
                {
                  scale: backButtonAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.8, 1],
                  }),
                },
                {
                  translateX: backButtonAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [-20, 0],
                  }),
                },
              ],
            }}
          >
            {currentStep > 0 && (
              <CircularBackArrowButton onPress={handleBack} />
            )}
          </Animated.View>

          <Animated.View
            style={{
              opacity: nextButtonAnim,
              transform: [
                {
                  scale: nextButtonAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.8, 1],
                  }),
                },
                {
                  translateX: nextButtonAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [20, 0],
                  }),
                },
              ],
            }}
          >
            <CircularNextArrowButton onPress={handleNext} />
          </Animated.View>
        </View>
      </View>
    </View>
  );
}

export default tutorial;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    height: 852,
    width: 393,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
  },
  skip: {
    fontSize: 12,
    color: "black",
    fontWeight: "bold",
  },
  skipButtonContainer: {
    position: 'absolute',
    top: Platform.OS === 'web' ? 30 : 60, // Match PagesMenu positioning
    right: 20,
    zIndex: 1000,
    padding: 8,
  },
  stepContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 110,
  },
  stepContent: {
    justifyContent: "center",
    alignItems: "center",
  },
  stepImage: {
    marginBottom: 20,
    resizeMode: "contain",
  },
  stepTitle: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 18,
    color: "black",
    textAlign: "center",
  },
  stepSubheading: {
    fontSize: 16,
    margin: 8,
    color: "black",
    fontWeight: "bold",
  },
  stepDescription: {
    fontSize: 16,
    textAlign: "center",
    paddingHorizontal: 40,
    color: "black",
    margin: 8,
  },
  progressIndicatorContainer: {
    position: "absolute",
    bottom: 70,
    alignItems: "center",
  },
  progressBarContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
  },
  stroke: {
    height: 1,
    borderWidth: 4,
    borderRadius: 6,
    borderColor: "#A2BC60",
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: "30%",
    gap: 20,
    marginTop: 50,
  },
});
