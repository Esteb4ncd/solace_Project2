import TaskCard from '@/components/taskCards/TaskCard';
import BottomNavigation from '@/components/ui/BottomNavigation';
import Header from '@/components/ui/Header';
import StatusBar from '@/components/ui/StatusBar';
import TabBar from '@/components/ui/TabBar';
import XPBar from '@/components/ui/XPBar';
import { Colors } from '@/constants/theme';
import { useExerciseContext } from '@/contexts/ExerciseContext';
<<<<<<< HEAD
import { router } from 'expo-router';
import { useState } from 'react';
import { Dimensions, Image, Keyboard, ScrollView, StyleSheet, TouchableWithoutFeedback, View } from 'react-native';
=======
import { ThemedText } from '@/components/themed-text';
import { router } from 'expo-router';
import { useState } from 'react';
import { Dimensions, Image, Keyboard, Pressable, ScrollView, StyleSheet, TouchableWithoutFeedback, View } from 'react-native';
>>>>>>> origin/VideosAPI

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const HomePage = () => {
  const [userName, setUserName] = useState("Solly");
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempUserName, setTempUserName] = useState("Solly");
  const [activeTab, setActiveTab] = useState<'stretch' | 'relax' | 'complete'>('stretch');
  
<<<<<<< HEAD
  const { completedExercises } = useExerciseContext();
  
  const dailyTasks = [
    { id: '1', title: 'Hand Warm Up', xpAmount: 10, xpColor: '#7267D9', isCompleted: false },
    { id: '2', title: 'Shoulder Warm Up', xpAmount: 10, xpColor: '#7267D9', isCompleted: false },
    { id: '3', title: 'Upper Back Stretch', xpAmount: 10, xpColor: '#7267D9', isCompleted: false },
  ];
=======
  const { completedExercises, getStreakCount, dailyTasks } = useExerciseContext();
  const streakCount = getStreakCount();
>>>>>>> origin/VideosAPI

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
        router.push('/(tabs)/signInPage');
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
<<<<<<< HEAD
=======
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
>>>>>>> origin/VideosAPI
  },
});

export default HomePage;
