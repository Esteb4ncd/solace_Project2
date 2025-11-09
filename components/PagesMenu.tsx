import { useExerciseContext } from '@/contexts/ExerciseContext';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useRef, useState } from 'react';
import { Alert, Dimensions, Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const PagesMenu = ({ hideOnTutorial = false }) => {
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const { completedExercises, resetAllExercises, markAllDailyExercisesComplete } = useExerciseContext();
  const [isHidden, setIsHidden] = useState(false);
  const [tapCount, setTapCount] = useState(0);
  const tapTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  
  // Triple tap detection
  const handleTripleTap = () => {
    if (tapCount === 2) {
      setIsHidden(false);
      setTapCount(0);
      if (tapTimeoutRef.current) {
        clearTimeout(tapTimeoutRef.current);
      }
    } else {
      setTapCount(prev => prev + 1);
      if (tapTimeoutRef.current) {
        clearTimeout(tapTimeoutRef.current);
      }
      tapTimeoutRef.current = setTimeout(() => {
        setTapCount(0);
      }, 500); // Reset tap count after 500ms
    }
  };
  
  const toggleMenu = () => {
    setIsMenuVisible(!isMenuVisible);
  };

  const navigateToScreen = (screenName: string) => {
    setIsMenuVisible(false);
    
    // Special handling for breathing exercise - go to confirmation first
    if (screenName === 'breathingExercisePage') {
      router.push({
        pathname: '/(tabs)/exerciseConfirmation',
        params: {
          exerciseName: 'Breathing Exercise',
          xpReward: '5',
          duration: '2 minutes'
        }
      });
    } else {
      router.push(`/(tabs)/${screenName}` as any);
    }
  };

  const skipToXPGain = () => {
    setIsMenuVisible(false);
    router.push({
      pathname: '/(tabs)/xpGain',
      params: {
        xpAmount: '5',
        exerciseId: '4',
        exerciseName: 'Stress Relief'
      }
    });
  };

  const startPhysicalExerciseFlow = () => {
    setIsMenuVisible(false);
    router.push('/(tabs)/exerciseConfirmation');
  };

  const handleResetExercises = () => {
    Alert.alert(
      'Reset All Exercises',
      'Are you sure you want to reset all completed exercises?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Reset', 
          style: 'destructive',
          onPress: () => {
            resetAllExercises();
            setIsMenuVisible(false);
          }
        }
      ]
    );
  };

  const handleMarkAllComplete = () => {
    Alert.alert(
      'Mark All Daily Exercises Complete',
      'This will mark all daily exercises as complete for styling testing.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Mark Complete', 
          style: 'default',
          onPress: () => {
            markAllDailyExercisesComplete();
            setIsMenuVisible(false);
          }
        }
      ]
    );
  };

  const handleResetAIOnboarding = () => {
    Alert.alert(
      'Reset AI Onboarding',
      'This will reset all AI onboarding questions and navigate you back to the start.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Reset', 
          style: 'default',
          onPress: () => {
            setIsMenuVisible(false);
            // Use replace to clear navigation stack and reset state
            router.replace('/(tabs)/startAiOnboarding');
          }
        }
      ]
    );
  };

  const hideMenu = () => {
    setIsMenuVisible(false);
    setIsHidden(true);
  };

  const menuItems = [
    { name: 'breathingExercisePage', title: 'Breathing Exercise Page', icon: 'leaf-outline' },
    { name: 'skipBreathing', title: 'Skip Breathing Exercise', icon: 'fast-forward', isSkip: true },
    { name: 'startPhysicalFlow', title: 'Start Physical Exercise Flow', icon: 'play-circle', isPhysicalFlow: true },
    { name: 'signInPage', title: 'Sign In Page', icon: 'log-in' },
    { name: 'tutorial', title: 'Tutorial', icon: 'school' },
    { name: 'startQuestions', title: 'Start Questions', icon: 'person' },
    { name: 'onboardingPreference', title: 'Onboarding Preference', icon: 'options' },
    { name: 'startAiOnboarding', title: 'Start AI Onboarding', icon: 'chatbubble-outline' },
    { name: 'aiQuestion1', title: 'AI Question 1', icon: 'mic-outline' },
    { name: 'aiQuestion2', title: 'AI Question 2', icon: 'mic-outline' },
    { name: 'aiConfirmation1', title: 'AI Confirmation 1', icon: 'checkmark-circle-outline' },
    { name: 'aiConfirmation2', title: 'AI Confirmation 2', icon: 'checkmark-circle-outline' },
    // Disabled - not in use
    // { name: 'onboardingQuestions', title: 'Onboarding Questions', icon: 'help-circle' },
    { name: 'confirmation', title: 'Confirmation', icon: 'checkmark-circle' },
    { name: 'homePage', title: 'Home Page', icon: 'home-outline' },
    { name: 'physicalHomePage', title: 'Physical Home Page', icon: 'fitness' },
    { name: 'mentalHomePage', title: 'Mental Home Page', icon: 'brain' },
    { name: 'hide', title: 'Hide Menu', icon: 'eye-off', isSpecial: true },
  ];

  return (
    <>
      {!hideOnTutorial && !isHidden && (
        <View style={styles.floatingMenu}>
          <Pressable onPress={toggleMenu} style={styles.menuButton}>
            <Ionicons name="menu" size={24} color="#000" />
          </Pressable>
        </View>
      )}

      {/* Triple tap detector when hidden */}
      {isHidden && (
        <Pressable style={styles.tripleTapDetector} onPress={handleTripleTap} />
      )}

      <Modal
        visible={isMenuVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsMenuVisible(false)}
      >
        <Pressable 
          style={styles.modalOverlay} 
          onPress={() => setIsMenuVisible(false)}
        >
          <View style={styles.menuContainer}>
            <View style={styles.menuHeader}>
              <Text style={styles.menuTitle}>Navigation</Text>
              <Pressable onPress={() => setIsMenuVisible(false)}>
                <Ionicons name="close" size={24} color="#000" />
              </Pressable>
            </View>
            
            <ScrollView 
              style={styles.scrollView}
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={true}
            >
              {menuItems.map((item) => (
                <Pressable
                  key={item.name}
                  style={[
                    styles.menuItem, 
                    item.isSpecial && styles.specialMenuItem,
                    item.isSkip && styles.skipMenuItem,
                    item.isPhysicalFlow && styles.physicalFlowMenuItem
                  ]}
                  onPress={() => {
                    if (item.isSpecial) {
                      hideMenu();
                    } else if (item.isSkip) {
                      skipToXPGain();
                    } else if (item.isPhysicalFlow) {
                      startPhysicalExerciseFlow();
                    } else {
                      navigateToScreen(item.name);
                    }
                  }}
                >
                  <Ionicons 
                    name={item.icon as any} 
                    size={20} 
                    color={
                      item.isSkip ? "#FF6B35" : 
                      item.isPhysicalFlow ? "#4CAF50" : 
                      "#000"
                    } 
                  />
                  <Text style={[
                    styles.menuItemText, 
                    item.isSkip && styles.skipText,
                    item.isPhysicalFlow && styles.physicalFlowText
                  ]}>
                    {item.title}
                  </Text>
                </Pressable>
              ))}

              {/* Test Button */}
              <View style={styles.sectionDivider} />
              <Pressable
                style={[styles.menuItem, styles.testButton]}
                onPress={handleMarkAllComplete}
              >
                <Ionicons name="checkmark-circle" size={20} color="#8B5CF6" />
                <Text style={[styles.menuItemText, styles.testText]}>Mark All Daily Complete (Test)</Text>
              </Pressable>

              {/* Reset AI Onboarding Button */}
              <View style={styles.sectionDivider} />
              <Pressable
                style={[styles.menuItem, styles.resetAIButton]}
                onPress={handleResetAIOnboarding}
              >
                <Ionicons name="refresh-outline" size={20} color="#8B5CF6" />
                <Text style={[styles.menuItemText, styles.resetAIText]}>Reset AI Onboarding</Text>
              </Pressable>

              {/* Reset Button */}
              {completedExercises.length > 0 && (
                <>
                  <View style={styles.sectionDivider} />
                  <Pressable
                    style={[styles.menuItem, styles.resetButton]}
                    onPress={handleResetExercises}
                  >
                    <Ionicons name="refresh" size={20} color="#FF4444" />
                    <Text style={[styles.menuItemText, styles.resetText]}>Reset All Exercises</Text>
                  </Pressable>
                </>
              )}
            </ScrollView>
          </View>
        </Pressable>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  floatingMenu: {
    position: 'absolute',
    top: screenHeight * 0.06, // 6% of screen height
    right: screenWidth * 0.05, // 5% of screen width
    zIndex: 1000,
  },
  menuButton: {
    padding: screenWidth * 0.02, // 2% of screen width
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: screenWidth * 0.05, // 5% of screen width
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: screenWidth * 0.005, // 0.5% of screen width
    },
    shadowOpacity: 0.25,
    shadowRadius: screenWidth * 0.01, // 1% of screen width
    elevation: 5,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    paddingTop: screenHeight * 0.12, // 12% of screen height
    paddingRight: screenWidth * 0.05, // 5% of screen width
  },
  menuContainer: {
    backgroundColor: '#fff',
    borderRadius: screenWidth * 0.03, // 3% of screen width
    padding: screenWidth * 0.04, // 4% of screen width
    minWidth: screenWidth * 0.5, // 50% of screen width
    maxHeight: screenHeight * 0.8, // 80% of screen height
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: screenWidth * 0.005, // 0.5% of screen width
    },
    shadowOpacity: 0.25,
    shadowRadius: screenWidth * 0.01, // 1% of screen width
    elevation: 5,
  },
  scrollView: {
    maxHeight: screenHeight * 0.6, // 60% of screen height
  },
  scrollContent: {
    paddingBottom: screenHeight * 0.01, // 1% of screen height
  },
  menuHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: screenHeight * 0.02, // 2% of screen height
    paddingBottom: screenHeight * 0.015, // 1.5% of screen height
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  menuTitle: {
    fontSize: screenWidth * 0.045, // 4.5% of screen width
    fontWeight: '500',
    color: '#000000',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: screenHeight * 0.015, // 1.5% of screen height
    paddingHorizontal: screenWidth * 0.02, // 2% of screen width
    borderRadius: screenWidth * 0.02, // 2% of screen width
  },
  menuItemText: {
    fontSize: screenWidth * 0.04, // 4% of screen width
    fontWeight: '400',
    color: '#000000',
    marginLeft: screenWidth * 0.03, // 3% of screen width
  },
  tripleTapDetector: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 999,
  },
  specialMenuItem: {
    backgroundColor: '#f0f0f0',
  },
  skipMenuItem: {
    backgroundColor: '#fff5f0',
  },
  skipText: {
    color: '#FF6B35',
  },
  physicalFlowMenuItem: {
    backgroundColor: '#f0f8f0',
  },
  physicalFlowText: {
    color: '#4CAF50',
  },
  sectionDivider: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginVertical: screenHeight * 0.01, // 1% of screen height
  },
  testButton: {
    backgroundColor: '#f8f4ff',
  },
  testText: {
    color: '#8B5CF6',
  },
  resetButton: {
    backgroundColor: '#fff5f5',
  },
  resetText: {
    color: '#FF4444',
  },
  resetAIButton: {
    backgroundColor: '#f0f4ff',
  },
  resetAIText: {
    color: '#8B5CF6',
  },
});

export default PagesMenu;
