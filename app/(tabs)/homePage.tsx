import TaskCard from "@/components/taskCards/TaskCard";
import { ThemedText } from "@/components/themed-text";
import BottomNavigation from "@/components/ui/BottomNavigation";
import Header from "@/components/ui/Header";
import StatusBar from "@/components/ui/StatusBar";
import TabBar from "@/components/ui/TabBar";
import XPBar from "@/components/ui/XPBar";
import { Colors } from "@/constants/theme";
import { useExerciseContext } from "@/contexts/ExerciseContext";
import { router, useLocalSearchParams } from "expo-router"; // Added useLocalSearchParams
import { useEffect, useRef, useState } from "react";
import {
	Animated,
	Dimensions,
	Easing,
	Image,
	Keyboard,
	Pressable,
	ScrollView,
	StyleSheet,
	TouchableWithoutFeedback,
	View,
} from "react-native";
import Svg, { Defs, LinearGradient, Path, Stop } from "react-native-svg"; // Added SVG imports

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

const HomePage = () => {
	// 1. Check if we should trigger the animation
	const { showIconAnimation } = useLocalSearchParams();
	const animationProgress = useRef(new Animated.Value(0)).current;
	const [isAnimationVisible, setIsAnimationVisible] = useState(false);

	const [userName, setUserName] = useState("Solly");
	const [isEditingName, setIsEditingName] = useState(false);
	const [tempUserName, setTempUserName] = useState("Solly");
	const [activeTab, setActiveTab] = useState("stretch");

	const { completedExercises, getStreakCount, dailyTasks } =
		useExerciseContext();
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

				<ScrollView
					style={styles.scrollView}
					showsVerticalScrollIndicator={false}
				>
					<View style={styles.contentContainer}>
						<Header
							userName={userName}
							streakCount={
								streakCount
							}
							onEditPress={
								handleEditPress
							}
							isEditingName={
								isEditingName
							}
							tempUserName={
								tempUserName
							}
							onUserNameChange={
								setTempUserName
							}
							onSaveName={
								handleSaveName
							}
							onCancelEdit={
								handleCancelEdit
							}
						/>

						{/* Avatar Section */}
						<View
							style={
								styles.avatarSection
							}
						>
							<Image
								source={require("@/assets/hompageAssets/SollySitting.png")}
								style={
									styles.avatar
								}
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
						{activeTab === "stretch" && (
							<>
								{dailyTasks.length >
								0 ? (
									<TaskCard
										tasks={
											dailyTasks
										}
										exerciseType='physical'
										isDaily={
											true
										}
									/>
								) : (
									<View
										style={
											styles.emptyStateContainer
										}
									>
										<ThemedText
											style={
												styles.emptyStateText
											}
										>
											Answer
											the
											questions
											to
											get
											your
											personalized
											exercise
											list
										</ThemedText>
										<Pressable
											style={
												styles.takeQuizButton
											}
											onPress={() =>
												router.push(
													"/(tabs)/onboardingPreference"
												)
											}
										>
											<ThemedText
												style={
													styles.takeQuizButtonText
												}
											>
												Take
												Quiz
											</ThemedText>
										</Pressable>
									</View>
								)}
							</>
						)}

						{activeTab === "relax" && (
							<TaskCard
								tasks={
									additionalTasks
								}
								exerciseType='mental'
								isDaily={false}
							/>
						)}

						{activeTab === "complete" && (
							<View
								style={
									styles.emptyState
								}
							/>
						)}

						<View
							style={
								styles.bottomSpacing
							}
						/>
					</View>
				</ScrollView>

				<BottomNavigation
					onItemPress={handleNavPress}
				/>

				{/* 4. THE FLYING ANIMATION OVERLAY */}
				{isAnimationVisible && (
					<View
						style={styles.overlayContainer}
						pointerEvents='none'
					>
						<Animated.View
							style={{
								transform: [
									{
										translateX: iconTranslateX,
									},
									{
										translateY: iconTranslateY,
									},
									{
										scale: iconScale,
									},
								],
							}}
						>
							<Svg
								width={178}
								height={204}
								viewBox='0 0 89 102'
								fill='none'
							>
								<Defs>
									<LinearGradient
										id='paint0_linear_home'
										x1='45.2175'
										y1='42.0566'
										x2='85.3677'
										y2='8.88927'
										gradientUnits='userSpaceOnUse'
									>
										<Stop stopColor='#7267D9' />
										<Stop
											offset='0.39'
											stopColor='#B9D5F1'
										/>
										<Stop
											offset='0.84'
											stopColor='#D3D0F3'
										/>
									</LinearGradient>
								</Defs>
								<Path
									d='M53.8977 20.4069C61.532 20.4069 67.5258 27.2069 66.8703 35.1197L62.0161 93.5873C61.5185 98.374 57.6493 102 53.0404 102H13.8804C9.27159 102 5.40232 98.374 4.90479 93.5873L0.0505504 35.1197C-0.604974 27.2069 5.38887 20.4069 13.0232 20.4069H53.901H53.8977Z'
									fill='#7267D9'
								/>
								<Path
									d='M20.1095 59.5428C22.447 59.5428 24.3419 57.6128 24.3419 55.232C24.3419 52.8513 22.447 50.9213 20.1095 50.9213C17.7721 50.9213 15.8772 52.8513 15.8772 55.232C15.8772 57.6128 17.7721 59.5428 20.1095 59.5428Z'
									fill='#F6F6F6'
								/>
								<Path
									d='M46.8112 59.5428C49.1486 59.5428 51.0435 57.6128 51.0435 55.232C51.0435 52.8513 49.1486 50.9213 46.8112 50.9213C44.4737 50.9213 42.5789 52.8513 42.5789 55.232C42.5789 57.6128 44.4737 59.5428 46.8112 59.5428Z'
									fill='#F6F6F6'
								/>
								<Path
									d='M16.7613 64.5178H50.156C53.7026 64.5178 56.5802 67.4487 56.5802 71.061C56.5802 81.9116 47.9306 90.7214 37.2775 90.7214H29.6398C18.9867 90.7214 10.3372 81.9116 10.3372 71.061C10.3372 67.4487 13.2147 64.5178 16.7613 64.5178Z'
									fill='#F6F6F6'
								/>
								<Path
									d='M60.9165 56.0983C60.4627 56.0983 60.0559 55.8107 59.8979 55.3758L53.383 37.4445C53.1847 36.9035 52.7678 36.4755 52.2367 36.2769L34.6317 29.6413C34.2047 29.4804 33.9224 29.0661 33.9224 28.6038C33.9224 28.1416 34.2047 27.7273 34.6317 27.5664L52.2367 20.9307C52.7678 20.7287 53.188 20.3041 53.383 19.7632L59.8979 1.83183C60.0559 1.39699 60.4627 1.10938 60.9165 1.10938C61.3703 1.10938 61.7771 1.39699 61.9351 1.83183L68.45 19.7632C68.6483 20.3041 69.0652 20.7321 69.5963 20.9307L87.2047 27.5664C87.6316 27.7273 87.914 28.1416 87.914 28.6038C87.914 29.0661 87.6316 29.4804 87.2047 29.6413L69.5963 36.2769C69.0652 36.479 68.645 36.9035 68.45 37.4445L61.9351 55.3758C61.7771 55.8107 61.3703 56.0983 60.9165 56.0983Z'
									fill='url(#paint0_linear_home)'
								/>
								<Path
									d='M60.9166 2.21188L67.4315 20.1432C67.7374 20.9855 68.393 21.6532 69.2199 21.9648L86.825 28.6004L69.2199 35.2361C68.393 35.5476 67.7374 36.2153 67.4315 37.0576L60.9166 54.9889L54.4017 37.0576C54.0958 36.2153 53.4403 35.5476 52.6133 35.2361L35.0083 28.6004L52.6133 21.9648C53.4403 21.6532 54.0958 20.9855 54.4017 20.1432L60.9166 2.21188ZM60.9166 0C60.009 0 59.1955 0.575227 58.8795 1.44491L52.3646 19.3762C52.2772 19.6159 52.0923 19.8008 51.8603 19.8898L34.2553 26.5255C33.4014 26.8473 32.8367 27.6759 32.8367 28.6004C32.8367 29.5249 33.4014 30.3535 34.2553 30.6753L51.8603 37.311C52.0956 37.4 52.2772 37.5883 52.3646 37.8246L58.8795 55.7559C59.1955 56.6256 60.009 57.2008 60.9166 57.2008C61.8243 57.2008 62.6378 56.6256 62.9538 55.7559L69.4687 37.8246C69.5561 37.5849 69.741 37.4 69.9729 37.311L87.578 30.6753C88.4318 30.3535 88.9966 29.5249 88.9966 28.6004C88.9966 27.6759 88.4318 26.8473 87.578 26.5255L69.9729 19.8898C69.7376 19.8008 69.5561 19.6125 69.4687 19.3762L62.9538 1.44491C62.6378 0.575227 61.8243 0 60.9166 0Z'
									fill='white'
								/>
							</Svg>
						</Animated.View>
					</View>
				)}
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

export default HomePage;
