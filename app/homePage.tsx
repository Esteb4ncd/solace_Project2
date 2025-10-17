import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import StatusBar from '@/components/ui/StatusBar';
import Header from '@/components/ui/Header';
import ProgressBar from '@/components/ui/ProgressBar';
import TaskCard from '@/components/ui/TaskCard';
import BottomNavigation from '@/components/ui/BottomNavigation';
import { colors, spacing, typography } from '@/constants/styles';

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
    <SafeAreaView style={styles.container}>
      <StatusBar />
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <Header 
          userName="Weenie"
          streakCount={1}
          onEditPress={() => console.log('Edit pressed')}
        />

        {/* Avatar Section */}
        <View style={styles.avatarSection}>
          <View style={styles.avatar}>
            <View style={styles.avatarBody} />
            <View style={styles.avatarEyes}>
              <View style={styles.eye} />
              <View style={styles.eye} />
            </View>
            <View style={styles.avatarBase}>
              <View style={styles.basePart} />
              <View style={styles.basePart} />
            </View>
          </View>
        </View>

        <ProgressBar 
          currentProgress={0}
          totalProgress={50}
          level={1}
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
      </ScrollView>

      <BottomNavigation onItemPress={handleNavPress} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  avatarSection: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
  avatar: {
    width: 80,
    height: 80,
    position: 'relative',
  },
  avatarBody: {
    width: 60,
    height: 40,
    backgroundColor: colors.primary,
    borderRadius: spacing.sm,
    position: 'absolute',
    top: 20,
    left: 10,
  },
  avatarEyes: {
    flexDirection: 'row',
    position: 'absolute',
    top: 30,
    left: 20,
    gap: spacing.md,
  },
  eye: {
    width: 6,
    height: 6,
    backgroundColor: colors.background,
    borderRadius: 3,
  },
  avatarBase: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 0,
    left: 15,
    gap: spacing.sm,
  },
  basePart: {
    width: 20,
    height: 20,
    backgroundColor: colors.primary,
    borderRadius: spacing.sm,
  },
  section: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  sectionTitle: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold,
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  bottomSpacing: {
    height: spacing.xxxl,
  },
});

export default HomePage;
