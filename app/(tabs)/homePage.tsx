import TaskCard from '@/components/taskCards/TaskCard';
import BottomNavigation from '@/components/ui/BottomNavigation';
import Header from '@/components/ui/Header';
import StatusBar from '@/components/ui/StatusBar';
import XPBar from '@/components/ui/XPBar';
import { spacing } from '@/constants/styles';
import { Colors } from '@/constants/theme';
import React, { useState } from 'react';
import { Image, Keyboard, ScrollView, StyleSheet, TouchableWithoutFeedback, View } from 'react-native';

const HomePage = () => {
  const [userName, setUserName] = useState("Solly");
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempUserName, setTempUserName] = useState("Solly");
  
  const dailyTasks = [
    { id: '1', title: 'Hand Warm Up', xpAmount: 10, xpColor: '#7267D9', isCompleted: false },
    { id: '2', title: 'Shoulder Relief', xpAmount: 10, xpColor: '#7267D9', isCompleted: false },
    { id: '3', title: 'Joint Relief', xpAmount: 10, xpColor: '#7267D9', isCompleted: false },
  ];

  const additionalTasks = [
    { id: '4', title: 'Stress Relief', xpAmount: 5, xpColor: '#7267D9', isCompleted: false },
  ];

  const handleNavPress = (itemId: string) => {
    console.log(`Navigating to ${itemId}`);
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
              currentProgress={0}
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
    width: 393,
    height: 852,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 16, // 16px left/right margins
  },
  avatarSection: {
    alignItems: 'center',
    paddingVertical: 8, // Reduced from 32px to 8px
  },
  avatar: {
    width: 150,
    height: 150,
    resizeMode: 'contain',
  },
  xpBarContainer: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  bottomSpacing: {
    height: spacing.xxxl,
  },
});

export default HomePage;
