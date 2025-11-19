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
import { useEffect, useRef, useState } from 'react';
import { Animated, Dimensions, Image, Keyboard, Modal, Pressable, ScrollView, StyleSheet, TouchableWithoutFeedback, View } from 'react-native';
import Svg, { Defs, LinearGradient, Path, Stop } from 'react-native-svg';
import TextAndVoiceInput from '@/components/ui/TextAndVoiceInput';
import LargeButton from '@/components/ui/LargeButton';
import { aiService } from '@/services/aiService';
import { speechService } from '@/services/speechService';
import { recommendExercises, getExerciseXpReward } from '@/constants/exercises';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const HomePage = () => {
  const [userName, setUserName] = useState("Solly");
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempUserName, setTempUserName] = useState("Solly");
  const [activeTab, setActiveTab] = useState<'stretch' | 'relax' | 'complete'>('stretch');
  
  // AI Chat Modal state
  const [showAIModal, setShowAIModal] = useState(false);
  const [aiInputValue, setAiInputValue] = useState('');
  const [isAIRecording, setIsAIRecording] = useState(false);
  const [isAIKeyboardVisible, setIsAIKeyboardVisible] = useState(false);
  const [aiContextFeedback, setAiContextFeedback] = useState<string>('');
  
  // Animation values for recording dots
  const dot1Anim = useRef(new Animated.Value(0)).current;
  const dot2Anim = useRef(new Animated.Value(0)).current;
  const dot3Anim = useRef(new Animated.Value(0)).current;
  
  const { completedExercises, getStreakCount, dailyTasks, setRecommendedExercises, updateDailyTasks } = useExerciseContext();
  const streakCount = getStreakCount();
  
  // Debug: Log when dailyTasks changes
  useEffect(() => {
    console.log('📋 Daily tasks updated in homepage:', dailyTasks);
  }, [dailyTasks]);

  const additionalTasks = [
    { id: '4', title: 'Stress Relief', xpAmount: 5, xpColor: '#7267D9', isCompleted: false },
    { id: '5', title: 'Sleep Help', xpAmount: 5, xpColor: '#7267D9', isCompleted: false },
    { id: '6', title: 'Anxiety Release', xpAmount: 5, xpColor: '#7267D9', isCompleted: false },
  ];

  const handleNavPress = (itemId: string) => {
    switch (itemId) {
      case 'home':
        // Already on home page
        break;
      case 'physical':
        router.push('/(tabs)/physicalHomePage');
        break;
      case 'mental':
        router.push('/(tabs)/mentalHomePage');
        break;
      case 'account':
        router.push('/(tabs)/accountSettingsPage');
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

  // AI Modal handlers
  const handleAIIconPress = () => {
    // Don't reset conversation - allow context to accumulate
    // This allows users to build context over multiple messages
    setShowAIModal(true);
  };

  const handleCloseAIModal = () => {
    if (isAIRecording) {
      speechService.cancelRecording().catch(console.error);
      setIsAIRecording(false);
    }
    setShowAIModal(false);
    setAiInputValue('');
    setAiContextFeedback('');
  };

  const handleAIStartRecording = async () => {
    try {
      await speechService.startRecording();
      setIsAIRecording(true);
      setIsAIKeyboardVisible(false);
    } catch (error) {
      console.error('Error starting recording in AI modal:', error);
      setIsAIRecording(true);
    }
  };

  const handleAIVoicePress = async () => {
    if (isAIKeyboardVisible) {
      handleAISend();
    } else {
      await handleAIStartRecording();
    }
  };

  const handleAISend = async () => {
    let finalText = aiInputValue.trim();
    
    if (isAIRecording) {
      try {
        const { transcription } = await speechService.stopAndTranscribeWithUri();
        if (transcription) {
          finalText = transcription;
          setAiInputValue(transcription);
        }
      } catch (error) {
        console.error('Error transcribing in AI modal:', error);
      }
      setIsAIRecording(false);
    }
    
    // Process with AI service
    if (finalText) {
      try {
        await aiService.sendMessage(finalText, isAIRecording);
        
        // Check if we have enough context to generate recommendations
        const context = aiService.getCurrentContext();
        console.log('📊 AI Context after message:', context);
        
        // Get context from AI service, with fallback extraction from message
        let painAreas = [...context.painAreas];
        let workTasks = [...context.workTasks];
        
        // Fallback: try to extract from the message if context extraction didn't work
        if (painAreas.length === 0) {
          const lowerText = finalText.toLowerCase();
          if (lowerText.includes('shoulder') || lowerText.includes('arm')) painAreas.push('shoulder');
          if (lowerText.includes('knee') || lowerText.includes('leg')) painAreas.push('knee');
          if (lowerText.includes('back')) painAreas.push('back');
          if (lowerText.includes('neck')) painAreas.push('neck');
          if (lowerText.includes('wrist') || lowerText.includes('hand')) painAreas.push('wrist');
        }
        
        if (workTasks.length === 0) {
          const lowerText = finalText.toLowerCase();
          if (lowerText.includes('lift') || lowerText.includes('heavy') || lowerText.includes('weight')) {
            workTasks.push('heavy lifting');
          }
          if (lowerText.includes('overhead') || lowerText.includes('above') || lowerText.includes('reach')) {
            workTasks.push('overhead work');
          }
          if (lowerText.includes('tool') || lowerText.includes('repetitive') || lowerText.includes('hammer') || lowerText.includes('drill')) {
            workTasks.push('repetitive tool use');
          }
          if (lowerText.includes('kneel') || lowerText.includes('crouch') || lowerText.includes('squat')) {
            workTasks.push('kneeling');
          }
        }
        
        // Update feedback message
        if (painAreas.length > 0 && workTasks.length > 0) {
          setAiContextFeedback(`Got it! I found ${painAreas.join(', ')} pain areas and ${workTasks.join(', ')} work tasks. Generating your personalized exercises...`);
        } else if (painAreas.length > 0) {
          setAiContextFeedback(`I found ${painAreas.join(', ')} pain areas. Can you tell me about your work activities?`);
        } else if (workTasks.length > 0) {
          setAiContextFeedback(`I found ${workTasks.join(', ')} work tasks. Where do you feel pain or discomfort?`);
        } else {
          setAiContextFeedback('Tell me about your pain areas and work activities so I can create your exercise plan.');
        }
        
        // Generate recommendations if we have both pain areas and work tasks
        if (painAreas.length > 0 && workTasks.length > 0) {
          console.log('📋 Generating recommendations with context:', { painAreas, workTasks });
          
          const recommendedExercises = recommendExercises(
            painAreas,
            workTasks,
            [],
            3 // Get top 3 recommendations for daily checklist
          );
          
          if (recommendedExercises.length > 0) {
            setRecommendedExercises(recommendedExercises);
            
            // Convert to daily tasks format
            const dailyTasks = recommendedExercises.map((recEx) => ({
              id: recEx.exercise.id,
              title: recEx.exercise.name,
              xpAmount: getExerciseXpReward(recEx.exercise, recEx.isRecommended),
              xpColor: '#7267D9',
              isCompleted: false,
            }));
            
            // Update daily tasks - this should trigger a re-render
            updateDailyTasks(dailyTasks);
            console.log('✅ Updated daily checklist with recommendations:', dailyTasks);
            console.log('📝 Daily tasks after update:', dailyTasks);
            
            // Force a small delay to ensure state update propagates
            setTimeout(() => {
              // Close modal only after successfully generating recommendations
              setShowAIModal(false);
              setAiInputValue('');
            }, 100);
          } else {
            console.warn('⚠️ No exercises found for context:', { painAreas, workTasks });
            // Keep modal open if no exercises found
            setAiInputValue('');
          }
        } else {
          console.log('⏳ Waiting for more context. Current:', { 
            painAreas: painAreas.length, 
            workTasks: workTasks.length 
          });
          // Keep modal open to gather more context
          // Clear input so user can type again
          setAiInputValue('');
        }
      } catch (error) {
        console.error('Error processing with AI in modal:', error);
      }
    }
  };

  // Recording animation effect
  useEffect(() => {
    if (isAIRecording) {
      const createAnimation = (animValue: Animated.Value, delay: number) => {
        return Animated.loop(
          Animated.sequence([
            Animated.delay(delay),
            Animated.timing(animValue, {
              toValue: 1,
              duration: 600,
              useNativeDriver: true,
            }),
            Animated.timing(animValue, {
              toValue: 0,
              duration: 600,
              useNativeDriver: true,
            }),
          ])
        );
      };

      const anim1 = createAnimation(dot1Anim, 0);
      const anim2 = createAnimation(dot2Anim, 200);
      const anim3 = createAnimation(dot3Anim, 400);
      Animated.parallel([anim1, anim2, anim3]).start();
    } else {
      dot1Anim.setValue(0);
      dot2Anim.setValue(0);
      dot3Anim.setValue(0);
    }
  }, [isAIRecording, dot1Anim, dot2Anim, dot3Anim]);

  useEffect(() => {
    if (showAIModal) {
      const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
        setIsAIKeyboardVisible(true);
      });
      const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
        setIsAIKeyboardVisible(false);
      });

      return () => {
        keyboardDidShowListener?.remove();
        keyboardDidHideListener?.remove();
      };
    }
  }, [showAIModal]);

  const dot1Scale = dot1Anim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.5],
  });
  const dot1Opacity = dot1Anim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.5, 1],
  });
  const dot2Scale = dot2Anim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.5],
  });
  const dot2Opacity = dot2Anim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.5, 1],
  });
  const dot3Scale = dot3Anim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.5],
  });
  const dot3Opacity = dot3Anim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.5, 1],
  });

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
              onAIIconPress={handleAIIconPress}
            />

          {/* Avatar Section */}
          <View style={styles.avatarSection}>
            <Image 
              source={require('@/assets/hompageAssets/SollySitting.png')} 
              style={styles.avatar}
            />
          </View>

          <View style={styles.xpBarContainer}>
            <XPBar 
              totalProgress={50}
              level={1}
            />
          </View>

          {/* Tab Bar */}
          <TabBar 
            activeTab={activeTab}
            onTabChange={setActiveTab}
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

      {/* AI Chat Modal */}
      <Modal
        visible={showAIModal}
        transparent={true}
        animationType="fade"
        onRequestClose={handleCloseAIModal}
      >
        {isAIRecording ? (
          <View style={aiModalStyles.modalOverlay}>
            <Pressable style={aiModalStyles.modalCard} onPress={(e) => e.stopPropagation()}>
              <Pressable style={aiModalStyles.closeButton} onPress={handleCloseAIModal}>
                <ThemedText style={aiModalStyles.closeButtonText}>×</ThemedText>
              </Pressable>
              <View style={aiModalStyles.modalHeader}>
                <View style={aiModalStyles.avatarContainer}>
                  <Svg width={89} height={102} viewBox="0 0 89 102" fill="none">
                    <Defs>
                      <LinearGradient id="paint0_linear_ai_modal" x1="45.2175" y1="42.0566" x2="85.3677" y2="8.88927" gradientUnits="userSpaceOnUse">
                        <Stop stopColor="#7267D9" />
                        <Stop offset="0.39" stopColor="#B9D5F1" />
                        <Stop offset="0.84" stopColor="#D3D0F3" />
                      </LinearGradient>
                    </Defs>
                    <Path d="M53.8977 20.4069C61.532 20.4069 67.5258 27.2069 66.8703 35.1197L62.0161 93.5873C61.5185 98.374 57.6493 102 53.0404 102H13.8804C9.27159 102 5.40232 98.374 4.90479 93.5873L0.0505504 35.1197C-0.604974 27.2069 5.38887 20.4069 13.0232 20.4069H53.901H53.8977Z" fill="#7267D9"/>
                    <Path d="M20.1095 59.5428C22.447 59.5428 24.3419 57.6128 24.3419 55.232C24.3419 52.8513 22.447 50.9213 20.1095 50.9213C17.7721 50.9213 15.8772 52.8513 15.8772 55.232C15.8772 57.6128 17.7721 59.5428 20.1095 59.5428Z" fill="#F6F6F6"/>
                    <Path d="M46.8112 59.5428C49.1486 59.5428 51.0435 57.6128 51.0435 55.232C51.0435 52.8513 49.1486 50.9213 46.8112 50.9213C44.4737 50.9213 42.5789 52.8513 42.5789 55.232C42.5789 57.6128 44.4737 59.5428 46.8112 59.5428Z" fill="#F6F6F6"/>
                    <Path d="M16.7613 64.5178H50.156C53.7026 64.5178 56.5802 67.4487 56.5802 71.061C56.5802 81.9116 47.9306 90.7214 37.2775 90.7214H29.6398C18.9867 90.7214 10.3372 81.9116 10.3372 71.061C10.3372 67.4487 13.2147 64.5178 16.7613 64.5178Z" fill="#F6F6F6"/>
                    <Path d="M60.9165 56.0983C60.4627 56.0983 60.0559 55.8107 59.8979 55.3758L53.383 37.4445C53.1847 36.9035 52.7678 36.4755 52.2367 36.2769L34.6317 29.6413C34.2047 29.4804 33.9224 29.0661 33.9224 28.6038C33.9224 28.1416 34.2047 27.7273 34.6317 27.5664L52.2367 20.9307C52.7678 20.7287 53.188 20.3041 53.383 19.7632L59.8979 1.83183C60.0559 1.39699 60.4627 1.10938 60.9165 1.10938C61.3703 1.10938 61.7771 1.39699 61.9351 1.83183L68.45 19.7632C68.6483 20.3041 69.0652 20.7321 69.5963 20.9307L87.2047 27.5664C87.6316 27.7273 87.914 28.1416 87.914 28.6038C87.914 29.0661 87.6316 29.4804 87.2047 29.6413L69.5963 36.2769C69.0652 36.479 68.645 36.9035 68.45 37.4445L61.9351 55.3758C61.7771 55.8107 61.3703 56.0983 60.9165 56.0983Z" fill="url(#paint0_linear_ai_modal)"/>
                  </Svg>
                </View>
                <View style={aiModalStyles.greetingContainer}>
                  <ThemedText style={aiModalStyles.greetingText}>Recording</ThemedText>
                  <View style={aiModalStyles.dotsContainer}>
                    <Animated.View
                      style={[
                        aiModalStyles.recordingDot,
                        aiModalStyles.recordingDotSpacing,
                        {
                          transform: [{ scale: dot1Scale }],
                          opacity: dot1Opacity,
                        },
                      ]}
                    />
                    <Animated.View
                      style={[
                        aiModalStyles.recordingDot,
                        aiModalStyles.recordingDotSpacing,
                        {
                          transform: [{ scale: dot2Scale }],
                          opacity: dot2Opacity,
                        },
                      ]}
                    />
                    <Animated.View
                      style={[
                        aiModalStyles.recordingDot,
                        {
                          transform: [{ scale: dot3Scale }],
                          opacity: dot3Opacity,
                        },
                      ]}
                    />
                  </View>
                </View>
              </View>
              <View style={aiModalStyles.modalButtonContainer}>
                <LargeButton 
                  label="Stop & Send" 
                  onPress={handleAISend}
                  style={aiModalStyles.modalStopButton}
                />
              </View>
            </Pressable>
          </View>
        ) : (
          <Pressable style={aiModalStyles.modalOverlay} onPress={handleCloseAIModal}>
            <Pressable style={aiModalStyles.modalCard} onPress={(e) => e.stopPropagation()}>
              <Pressable style={aiModalStyles.closeButton} onPress={handleCloseAIModal}>
                <ThemedText style={aiModalStyles.closeButtonText}>×</ThemedText>
              </Pressable>

              <View style={aiModalStyles.modalHeader}>
                <View style={aiModalStyles.avatarContainer}>
                  <Svg width={89} height={102} viewBox="0 0 89 102" fill="none">
                    <Defs>
                      <LinearGradient id="paint0_linear_ai_modal2" x1="45.2175" y1="42.0566" x2="85.3677" y2="8.88927" gradientUnits="userSpaceOnUse">
                        <Stop stopColor="#7267D9" />
                        <Stop offset="0.39" stopColor="#B9D5F1" />
                        <Stop offset="0.84" stopColor="#D3D0F3" />
                      </LinearGradient>
                    </Defs>
                    <Path d="M53.8977 20.4069C61.532 20.4069 67.5258 27.2069 66.8703 35.1197L62.0161 93.5873C61.5185 98.374 57.6493 102 53.0404 102H13.8804C9.27159 102 5.40232 98.374 4.90479 93.5873L0.0505504 35.1197C-0.604974 27.2069 5.38887 20.4069 13.0232 20.4069H53.901H53.8977Z" fill="#7267D9"/>
                    <Path d="M20.1095 59.5428C22.447 59.5428 24.3419 57.6128 24.3419 55.232C24.3419 52.8513 22.447 50.9213 20.1095 50.9213C17.7721 50.9213 15.8772 52.8513 15.8772 55.232C15.8772 57.6128 17.7721 59.5428 20.1095 59.5428Z" fill="#F6F6F6"/>
                    <Path d="M46.8112 59.5428C49.1486 59.5428 51.0435 57.6128 51.0435 55.232C51.0435 52.8513 49.1486 50.9213 46.8112 50.9213C44.4737 50.9213 42.5789 52.8513 42.5789 55.232C42.5789 57.6128 44.4737 59.5428 46.8112 59.5428Z" fill="#F6F6F6"/>
                    <Path d="M16.7613 64.5178H50.156C53.7026 64.5178 56.5802 67.4487 56.5802 71.061C56.5802 81.9116 47.9306 90.7214 37.2775 90.7214H29.6398C18.9867 90.7214 10.3372 81.9116 10.3372 71.061C10.3372 67.4487 13.2147 64.5178 16.7613 64.5178Z" fill="#F6F6F6"/>
                    <Path d="M60.9165 56.0983C60.4627 56.0983 60.0559 55.8107 59.8979 55.3758L53.383 37.4445C53.1847 36.9035 52.7678 36.4755 52.2367 36.2769L34.6317 29.6413C34.2047 29.4804 33.9224 29.0661 33.9224 28.6038C33.9224 28.1416 34.2047 27.7273 34.6317 27.5664L52.2367 20.9307C52.7678 20.7287 53.188 20.3041 53.383 19.7632L59.8979 1.83183C60.0559 1.39699 60.4627 1.10938 60.9165 1.10938C61.3703 1.10938 61.7771 1.39699 61.9351 1.83183L68.45 19.7632C68.6483 20.3041 69.0652 20.7321 69.5963 20.9307L87.2047 27.5664C87.6316 27.7273 87.914 28.1416 87.914 28.6038C87.914 29.0661 87.6316 29.4804 87.2047 29.6413L69.5963 36.2769C69.0652 36.479 68.645 36.9035 68.45 37.4445L61.9351 55.3758C61.7771 55.8107 61.3703 56.0983 60.9165 56.0983Z" fill="url(#paint0_linear_ai_modal2)"/>
                  </Svg>
                </View>
                <View style={aiModalStyles.greetingContainer}>
                  <ThemedText style={aiModalStyles.greetingText}>Hey, Let me know</ThemedText>
                  <ThemedText style={aiModalStyles.greetingText}>anything!</ThemedText>
                  {aiContextFeedback ? (
                    <ThemedText style={aiModalStyles.contextFeedback}>{aiContextFeedback}</ThemedText>
                  ) : null}
                </View>
              </View>

              <View style={aiModalStyles.modalInputContainer}>
                <TextAndVoiceInput
                  placeholder="Ask Solly anything!"
                  value={aiInputValue}
                  onChangeText={setAiInputValue}
                  onVoicePress={handleAIVoicePress}
                  onStartRecording={handleAIStartRecording}
                  onSend={handleAISend}
                  isKeyboardVisible={isAIKeyboardVisible}
                  autoFocus={false}
                  multiline={false}
                />
              </View>
            </Pressable>
          </Pressable>
        )}
      </Modal>
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
