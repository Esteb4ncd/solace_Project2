import TaskCard from '@/components/taskCards/TaskCard';
import BottomNavigation from '@/components/ui/BottomNavigation';
import CompletedTask from '@/components/ui/CompletedTask';
import Header from '@/components/ui/Header';
import StatusBar from '@/components/ui/StatusBar';
import XPBar from '@/components/ui/XPBar';
import { Colors } from '@/constants/theme';
import { useExerciseContext } from '@/contexts/ExerciseContext';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Dimensions, Image, Keyboard, ScrollView, StyleSheet, Text, TouchableWithoutFeedback, View } from 'react-native';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const HomePage = () => {
  const [userName, setUserName] = useState("Solly");
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempUserName, setTempUserName] = useState("Solly");
  
  const { completedExercises } = useExerciseContext();
  
  const dailyTasks = [
    { id: '1', title: 'Hand Warm Up', xpAmount: 10, xpColor: '#7267D9', isCompleted: false },
    { id: '2', title: 'Shoulder Warm Up', xpAmount: 10, xpColor: '#7267D9', isCompleted: false },
    { id: '3', title: 'Upper Back Stretch', xpAmount: 10, xpColor: '#7267D9', isCompleted: false },
  ];

  const additionalTasks = [
    { id: '4', title: 'Stress Relief', xpAmount: 5, xpColor: '#7267D9', isCompleted: false },
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
              streakCount={1}
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

          {/* Daily Checklist Section */}
          <TaskCard 
            tasks={dailyTasks}
            exerciseType="physical"
            isDaily={true}
          />

          {/* Additional XP Section */}
          <TaskCard 
            tasks={additionalTasks}
            exerciseType="mental"
            isDaily={false}
          />

          {/* Completed Exercises Section */}
          {completedExercises.length > 0 && (
            <View style={styles.completedSection}>
              <Text style={styles.completedSectionTitle}>Completed Today</Text>
              {completedExercises.map((exercise) => (
                <CompletedTask
                  key={exercise.id}
                  taskName={exercise.name}
                  xpGained={exercise.xpGained}
                />
              ))}
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
  completedSection: {
    marginTop: screenHeight * 0.025, // 2.5% of screen height
  },
  completedSectionTitle: {
    fontSize: screenWidth * 0.05, // 5% of screen width
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: screenHeight * 0.015, // 1.5% of screen height
  },
});

export default HomePage;
