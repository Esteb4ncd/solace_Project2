import TaskCard from '@/components/taskCards/TaskCard';
import BottomNavigation from '@/components/ui/BottomNavigation';
import Header from '@/components/ui/Header';
import StatusBar from '@/components/ui/StatusBar';
import TabBar from '@/components/ui/TabBar';
import XPBar from '@/components/ui/XPBar';
import { Colors } from '@/constants/theme';
import { useExerciseContext } from '@/contexts/ExerciseContext';
import { ThemedText } from '@/components/themed-text';
import { router } from 'expo-router';
import { useState } from 'react';
import { Dimensions, Image, Keyboard, Pressable, ScrollView, StyleSheet, TouchableWithoutFeedback, View } from 'react-native';

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

const HomePage = () => {
  const [userName, setUserName] = useState("Solly");
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempUserName, setTempUserName] = useState("Solly");
  const [activeTab, setActiveTab] = useState<'stretch' | 'relax' | 'complete'>('stretch');
  
  const { completedExercises, getStreakCount, dailyTasks } = useExerciseContext();
  const streakCount = getStreakCount();

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

	// 2. Run Animation on Mount if flag is present
	useEffect(() => {
		if (showIconAnimation === "true") {
			setIsAnimationVisible(true);

			// Start animation immediately
			Animated.timing(animationProgress, {
				toValue: 1,
				duration: 1200, // Duration of flight
				easing: Easing.out(Easing.exp), // Smooth deceleration
				useNativeDriver: true,
			}).start(({ finished }) => {
				if (finished) {
					// Optional: Hide the flying icon after it lands,
					// assuming the Header component has a permanent version of it.
					// setIsAnimationVisible(false);
				}
			});
		}
	}, [showIconAnimation]);

	// 3. Calculate Interpolations (Center -> Top Right)
	// Start: Center of screen (0,0 relative to centered view)
	// End: Top Right corner
	const iconTranslateX = animationProgress.interpolate({
		inputRange: [0, 1],
		outputRange: [0, screenWidth / 2 - 40], // Moves right
	});

	const iconTranslateY = animationProgress.interpolate({
		inputRange: [0, 1],
		outputRange: [0, -screenHeight / 2 + 60], // Moves up (adjust 60 for status bar height)
	});

	const iconScale = animationProgress.interpolate({
		inputRange: [0, 1],
		outputRange: [1, 0.25], // Shrinks from 100% to 25%
	});

	const handleNavPress = (itemId) => {
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
        
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
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
              source={require('@/assets/hompageAssets/SollySitting.png')} 
              style={styles.avatar}
            />
          </View>

						<View
							style={
								styles.xpBarContainer
							}
						>
							<XPBar
								totalProgress={
									50
								}
								level={1}
							/>
						</View>

						{/* Tab Bar */}
						<TabBar
							activeTab={activeTab}
							onTabChange={
								setActiveTab
							}
						/>

          {/* Content based on active tab */}
          {activeTab === 'stretch' && (
            <>
              {dailyTasks.length > 0 ? (
                /* Daily Checklist Section */
                <TaskCard 
                  tasks={dailyTasks}
                  exerciseType="physical"
                  isDaily={true}
                />
              ) : (
                /* Empty State - Prompt to take quiz */
                <View style={styles.emptyStateContainer}>
                  <ThemedText style={styles.emptyStateText}>
                    Answer the questions to get your personalized exercise list
                  </ThemedText>
                  <Pressable 
                    style={styles.takeQuizButton}
                    onPress={() => router.push('/(tabs)/onboardingPreference')}
                  >
                    <ThemedText style={styles.takeQuizButtonText}>Take Quiz</ThemedText>
                  </Pressable>
                </View>
              )}
            </>
          )}

          {activeTab === 'relax' && (
            <>
              {/* Additional XP Section */}
              <TaskCard 
                tasks={additionalTasks}
                exerciseType="mental"
                isDaily={false}
              />
            </>
          )}

          {activeTab === 'complete' && (
            <View style={styles.emptyState}>
              {/* Complete content will go here */}
            </View>
          )}

          {/* Bottom spacing for navigation */}
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
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: screenWidth * 0.04, // 4% of screen width
  },
  avatarSection: {
    alignItems: 'center',
    paddingVertical: screenHeight * 0.01, // 1% of screen height
  },
  avatar: {
    width: screenWidth * 0.38, // 38% of screen width
    height: screenWidth * 0.38, // 38% of screen width (maintains aspect ratio)
    resizeMode: 'contain',
  },
  xpBarContainer: {
    alignItems: 'center',
    paddingVertical: screenHeight * 0.02, // 2% of screen height
  },
  bottomSpacing: {
    height: screenHeight * 0.12, // 12% of screen height
  },
  emptyState: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  emptyStateContainer: {
    paddingVertical: 60,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 26,
  },
  takeQuizButton: {
    backgroundColor: '#7267D9',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  takeQuizButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});

const aiModalStyles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalCard: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  closeButtonText: {
    fontSize: 24,
    color: '#000',
    fontWeight: '300',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
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
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
  },
  contextFeedback: {
    fontSize: 14,
    fontWeight: '400',
    color: '#666',
    marginTop: 8,
    fontStyle: 'italic',
  },
  dotsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  recordingDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#7267D9',
  },
  recordingDotSpacing: {
    marginRight: 8,
  },
  modalInputContainer: {
    marginTop: 16,
  },
  modalButtonContainer: {
    marginTop: 16,
    alignItems: 'center',
  },
  modalStopButton: {
    width: '100%',
  },
});

export default HomePage;
