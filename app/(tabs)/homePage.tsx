import TaskCard from "@/components/taskCards/TaskCard";
import { ThemedText } from "@/components/themed-text";
import BottomNavigation from "@/components/ui/BottomNavigation";
import Header from "@/components/ui/Header";
import StatusBar from "@/components/ui/StatusBar";
import TabBar from "@/components/ui/TabBar";
import XPBar from "@/components/ui/XPBar";
import { Colors } from "@/constants/theme";
import { useExerciseContext } from "@/contexts/ExerciseContext";
import { router } from "expo-router";
import { useState } from "react";
import {
  Dimensions,
  Image,
  Keyboard,
  Pressable,
  ScrollView,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from "react-native";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

const HomePage = () => {
  const [userName, setUserName] = useState("Solly");
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempUserName, setTempUserName] = useState("Solly");
  const [activeTab, setActiveTab] = useState<"stretch" | "relax" | "complete">(
    "stretch"
  );

  const { completedExercises, getStreakCount, dailyTasks } =
    useExerciseContext();
  const streakCount = getStreakCount();

  // Check if an exercise was just completed
  useEffect(() => {
    const currentCompletedCount = completedExercises.length;
    
    // If completed count increased, show "Oh that's a bit better!"
    if (currentCompletedCount > prevCompletedCount.current) {
      setShowExerciseCompleteMessage(true);
      setSollyMessage("Oh that's a bit better!");
    }
    
    prevCompletedCount.current = currentCompletedCount;
  }, [completedExercises]);

  // Generate AI-powered personalized message for Solly
  const generateSollyMessage = useCallback(async () => {
    // If we should show the exercise complete message, don't generate a new one
    if (showExerciseCompleteMessage) {
      return;
    }
    
    try {
      const completedCount = completedExercises.length;
      const dailyCompletedCount = dailyTasks.filter(task => task.isCompleted).length;
      const totalDailyTasks = dailyTasks.length;
      const currentStreak = getStreakCount();
      const hasStreak = currentStreak > 0;

      // Get user context from AI service (work tasks and pain areas)
      const aiContext = aiService.getCurrentContext();

      // Create comprehensive context for AI
      const context = {
        completedExercises: completedCount,
        dailyCompleted: dailyCompletedCount,
        totalDaily: totalDailyTasks,
        streakDays: currentStreak,
        hasStreak: hasStreak,
        painAreas: aiContext.painAreas,
        workTasks: aiContext.workTasks,
      };

      console.log('Generating new Solly message with context:', context);

      // Generate personalized AI message
      const message = await aiService.generateSpeechBubbleMessage(context);
      console.log('New Solly message generated:', message);
      setSollyMessage(message);
    } catch (error) {
      console.error('Error generating Solly message:', error);
      setSollyMessage('Ready to exercise?');
    }
  }, [completedExercises, dailyTasks, getStreakCount, showExerciseCompleteMessage]);

  // Initial load and periodic updates
  useEffect(() => {
    // Only generate message if we're not showing the exercise complete message
    if (!showExerciseCompleteMessage) {
      generateSollyMessage();
    }
    
    // Update message periodically or when state changes (every 45 seconds for variety)
    // But only if we're not showing the exercise complete message
    const interval = setInterval(() => {
      if (!showExerciseCompleteMessage) {
        generateSollyMessage();
      }
    }, 45000);
    return () => clearInterval(interval);
  }, [completedExercises, dailyTasks, streakCount, showExerciseCompleteMessage, generateSollyMessage]);

  // Animation on load
  useEffect(() => {
    // Bounce animation on initial load
    Animated.sequence([
      Animated.timing(sollyBounceAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.timing(sollyBounceAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  // Handle Solly click - refresh message and animate
  const handleSollyPress = useCallback(() => {
    console.log('👆 Solly clicked - refreshing message');
    
    // Clear the exercise complete message flag so we can generate normal messages
    setShowExerciseCompleteMessage(false);
    
    // Trigger bounce animation
    sollyBounceAnim.setValue(0);
    Animated.sequence([
      Animated.timing(sollyBounceAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(sollyBounceAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();

    // Force a refresh by temporarily clearing the message, then generating a new one
    setSollyMessage('');
    
    // Small delay to ensure state update, then generate new message
    setTimeout(() => {
      generateSollyMessage().catch(error => {
        console.error('Error refreshing Solly message:', error);
        setSollyMessage('Ready to exercise?');
      });
    }, 50);
  }, [generateSollyMessage]);

  // Interpolate bounce animation
  const bounceScale = sollyBounceAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.1],
  });

  const additionalTasks = [
    {
      id: "4",
      title: "Stress Relief",
      xpAmount: 5,
      xpColor: "#7267D9",
      isCompleted: false,
    },
    {
      id: "5",
      title: "Sleep Help",
      xpAmount: 5,
      xpColor: "#7267D9",
      isCompleted: false,
    },
    {
      id: "6",
      title: "Anxiety Release",
      xpAmount: 5,
      xpColor: "#7267D9",
      isCompleted: false,
    },
  ];

  const handleNavPress = (itemId: string) => {
    switch (itemId) {
      case "home":
        break;
      case "physical":
        router.push("/(tabs)/physicalHomePage");
        break;
      case "mental":
        router.push("/(tabs)/mentalHomePage");
        break;
      case "account":
        router.push("/(tabs)/accountSettingsPage");
        break;
      default:
        console.log(`Navigating to ${itemId}`);
    }
  };

  const handleEditPress = () => {
    setIsEditingName(true);
    setTempUserName(userName);
  };

  const handleSaveName = () => {
    setUserName(tempUserName);
    setIsEditingName(false);
    Keyboard.dismiss();
  };

  const handleCancelEdit = () => {
    setTempUserName(userName);
    setIsEditingName(false);
    Keyboard.dismiss();
  };

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  return (
    <TouchableWithoutFeedback onPress={dismissKeyboard}>
      <View style={styles.container}>
        <StatusBar />

        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.contentContainer}>
            <Header
              userName={userName}
              streakCount={streakCount}
              onEditPress={handleEditPress}
              isEditingName={isEditingName}
              tempUserName={tempUserName}
              onUserNameChange={setTempUserName}
              onSaveName={handleSaveName}
              onCancelEdit={handleCancelEdit}
            />

            {/* Avatar Section */}
            <View style={styles.avatarSection}>
              <Image
                source={require("@/assets/hompageAssets/SollySitting.png")}
                style={styles.avatar}
              />
            </View>

            <View style={styles.xpBarContainer}>
              <XPBar totalProgress={50} level={1} />
            </View>

            {/* Tab Bar */}
            <TabBar activeTab={activeTab} onTabChange={setActiveTab} />

            {/* Content based on active tab */}
            {activeTab === "stretch" && (
              <>
                {dailyTasks.length > 0 ? (
                  <TaskCard
                    tasks={dailyTasks}
                    exerciseType="physical"
                    isDaily={true}
                  />
                ) : (
                  <View style={styles.emptyStateContainer}>
                    <ThemedText style={styles.emptyStateText}>
                      Answer the questions to get your personalized exercise
                      list
                    </ThemedText>
                    <Pressable
                      style={styles.takeQuizButton}
                      onPress={() =>
                        router.push("/(tabs)/onboardingPreference")
                      }
                    >
                      <ThemedText style={styles.takeQuizButtonText}>
                        Take Quiz
                      </ThemedText>
                    </Pressable>
                  </View>
                )}
              </>
            )}

            {activeTab === "relax" && (
              <TaskCard
                tasks={additionalTasks}
                exerciseType="mental"
                isDaily={false}
              />
            )}

            {activeTab === "complete" && <View style={styles.emptyState} />}

            <View style={styles.bottomSpacing} />
          </View>
        </ScrollView>

        <BottomNavigation onItemPress={handleNavPress} />
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
    width: screenWidth,
    height: screenHeight,
  },
  // ... existing styles ...
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: screenWidth * 0.04,
  },
  avatarSection: {
    alignItems: "center",
    paddingVertical: screenHeight * 0.01,
  },
  avatar: {
    width: screenWidth * 0.38,
    height: screenWidth * 0.38,
    resizeMode: "contain",
  },
  xpBarContainer: {
    alignItems: "center",
    paddingVertical: screenHeight * 0.02,
  },
  bottomSpacing: {
    height: screenHeight * 0.12,
  },
  emptyState: {
    paddingVertical: 40,
    alignItems: "center",
  },
  completeSection: {
    paddingVertical: 16,
  },
  completeSectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 16,
  },
  emptyStateContainer: {
    paddingVertical: 60,
    paddingHorizontal: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#666",
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 26,
  },
  allCompletedContainer: {
    paddingVertical: 60,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  allCompletedText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 26,
  },
  takeQuizButton: {
    backgroundColor: "#7267D9",
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  takeQuizButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
  // NEW STYLES
  overlayContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 999, // High Z-Index to float above everything
  },
});

const aiModalStyles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalCard: {
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 24,
    width: "100%",
    maxWidth: 400,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
  },
  closeButton: {
    position: "absolute",
    top: 16,
    right: 16,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  closeButtonText: {
    fontSize: 24,
    color: "#000",
    fontWeight: "300",
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
    marginTop: 8,
  },
  avatarContainer: {
    marginRight: 16,
  },
  greetingContainer: {
    flex: 1,
  },
  greetingText: {
    fontSize: 20,
    fontWeight: "600",
    color: "#000",
    marginBottom: 4,
  },
  contextFeedback: {
    fontSize: 14,
    fontWeight: "400",
    color: "#666",
    marginTop: 8,
    fontStyle: "italic",
  },
  dotsContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  recordingDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#7267D9",
  },
  recordingDotSpacing: {
    marginRight: 8,
  },
  modalInputContainer: {
    marginTop: 16,
  },
  modalButtonContainer: {
    marginTop: 16,
    alignItems: "center",
  },
  modalStopButton: {
    width: "100%",
  },
});

export default HomePage;
