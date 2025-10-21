import BottomNavigation from '@/components/ui/BottomNavigation';
import Header from '@/components/ui/Header';
import StatusBar from '@/components/ui/StatusBar';
import TaskCard from '@/components/ui/TaskCard';
import XPBar from '@/components/ui/XPBar';
import { spacing } from '@/constants/styles';
import { Colors } from '@/constants/theme';
import React, { useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';

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
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Daily Checklist</Text>
            {dailyTasks.map((task) => (
              <TaskCard
                key={task.id}
                title={task.title}
                xpAmount={task.xpAmount}
                xpColor={task.xpColor}
                isCompleted={task.isCompleted}
                onPress={() => handleTaskPress(task.id)}
              />
            ))}
          </View>

          {/* Additional XP Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Need more xp? Try these</Text>
            {additionalTasks.map((task) => (
              <TaskCard
                key={task.id}
                title={task.title}
                xpAmount={task.xpAmount}
                xpColor={task.xpColor}
                isCompleted={task.isCompleted}
                onPress={() => handleTaskPress(task.id)}
              />
            ))}
          </View>

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
  section: {
    paddingVertical: 16, // 16px margin from element above
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 8, // 8px margin between checklist items
  },
  bottomSpacing: {
    height: spacing.xxxl,
  },
});

export default HomePage;
