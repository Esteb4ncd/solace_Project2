import TaskCard from '@/components/taskCards/TaskCard';
import BottomNavigation from '@/components/ui/BottomNavigation';
import Header from '@/components/ui/Header';
import StatusBar from '@/components/ui/StatusBar';
import XPBar from '@/components/ui/XPBar';
import { spacing } from '@/constants/styles';
import { Colors } from '@/constants/theme';
import React, { useState } from 'react';
import { Image, ScrollView, StyleSheet, View } from 'react-native';

const HomePage = () => {
  const [dailyTasks, setDailyTasks] = useState([
    { id: '1', title: 'Back Relief', xpAmount: 10, xpColor: '#7267D9', isCompleted: false },
    { id: '2', title: 'Shoulder Relief', xpAmount: 10, xpColor: '#7267D9', isCompleted: false },
    { id: '3', title: 'Joint Relief', xpAmount: 10, xpColor: '#7267D9', isCompleted: false },
  ]);

  const [additionalTasks] = useState([
    { id: '4', title: 'Stress Relief', xpAmount: 5, xpColor: '#7267D9', isCompleted: false },
  ]);

  const handleTaskPress = (taskId: string) => {
    setDailyTasks(tasks =>
      tasks.map(task =>
        task.id === taskId ? { ...task, isCompleted: !task.isCompleted } : task
      )
    );
  };

  const handleNavPress = (itemId: string) => {
    console.log(`Navigating to ${itemId}`);
  };

  return (
    <View style={styles.container}>
      <StatusBar />
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.contentContainer}>
          <Header 
            userName="Solly"
            streakCount={1}
            onEditPress={() => console.log('Edit pressed')}
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
            onTaskPress={handleTaskPress}
            exerciseType="physical"
            isDaily={true}
          />

          {/* Additional XP Section */}
          <TaskCard 
            tasks={additionalTasks}
            onTaskPress={handleTaskPress}
            exerciseType="mental"
          />

          {/* Bottom spacing for navigation */}
          <View style={styles.bottomSpacing} />
        </View>
      </ScrollView>

      <BottomNavigation onItemPress={handleNavPress} />
    </View>
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