import BottomNavigation from '@/components/ui/BottomNavigation';
import Header from '@/components/ui/Header';
import ProgressBar from '@/components/ui/ProgressBar';
import StatusBar from '@/components/ui/StatusBar';
import TaskCard from '@/components/ui/TaskCard';
import { colors, spacing, typography } from '@/constants/styles';
import { Colors } from '@/constants/theme';
import React, { useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';

const HomePage = () => {
  const [dailyTasks, setDailyTasks] = useState([
    { id: '1', title: 'Back Relief', xpAmount: 10, xpColor: colors.accent.purple, isCompleted: false },
    { id: '2', title: 'Shoulder Relief', xpAmount: 10, xpColor: colors.accent.green, isCompleted: false },
    { id: '3', title: 'Joint Relief', xpAmount: 10, xpColor: colors.accent.purple, isCompleted: false },
  ]);

  const [additionalTasks] = useState([
    { id: '4', title: 'White noise', xpAmount: 10, xpColor: colors.accent.purple, isCompleted: false },
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
            userName="Weenie"
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

          <ProgressBar 
            currentProgress={90}
            totalProgress={100}
            level={1}
            isHealthBar={true}
          />

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
    paddingVertical: 32, // 32px margin from element above
  },
  avatar: {
    width: 120,
    height: 120,
    resizeMode: 'contain',
  },
  section: {
    paddingVertical: 16, // 16px margin from element above
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 8, // 8px margin between checklist items
  },
  bottomSpacing: {
    height: spacing.xxxl,
  },
});

export default HomePage;