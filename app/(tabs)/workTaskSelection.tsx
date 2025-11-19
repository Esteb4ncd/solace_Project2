import { router } from 'expo-router';
import React, { useState } from 'react';
import { Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import BackButton from '../../components/ui/BackButton';
import LargeButton from '../../components/ui/LargeButton';
import ProgressIndicator from '../../components/ui/ProgressIndicator';
import SelectableCard from '../../components/ui/SelectableCard';
import { Globals } from '../../constants/globals';

interface WorkTask {
  id: string;
  label: string;
  icon: any; // Image source
}

const workTasks: WorkTask[] = [
  {
    id: 'kneeling',
    label: 'Kneeling',
    icon: require('../../assets/SollyStates/kneeling.png'),
  },
  {
    id: 'overhead',
    label: 'Overhead Work',
    icon: require('../../assets/SollyStates/overheadwork.png'),
  },
  {
    id: 'repetitive',
    label: 'Repetitive Tool Use',
    icon: require('../../assets/SollyStates/repetitivetool.png'),
  },
  {
    id: 'heavy',
    label: 'Heavy Lifting',
    icon: require('../../assets/SollyStates/heavylifting.png'),
  },
  {
    id: 'standing',
    label: 'Standing Long Hours',
    icon: require('../../assets/SollyStates/standinglong.png'),
  },
  {
    id: 'awkward',
    label: 'Awkward Postures',
    icon: require('../../assets/SollyStates/awkwardposture.png'),
  },
];

export default function WorkTaskSelectionScreen() {
  const [selectedTasks, setSelectedTasks] = useState<Set<string>>(new Set());

  const handleTaskPress = (taskId: string) => {
    setSelectedTasks((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(taskId)) {
        newSet.delete(taskId);
      } else {
        newSet.add(taskId);
      }
      return newSet;
    });
  };

  const handleNext = () => {
    // Convert selected tasks to array and map to AI service format
    const selectedTasksArray = Array.from(selectedTasks);
    const mappedTasks = selectedTasksArray.map(taskId => {
      // Map manual selection IDs to AI service work task format
      const taskMap: { [key: string]: string } = {
        'kneeling': 'kneeling',
        'overhead': 'overhead work',
        'repetitive': 'repetitive tool use',
        'heavy': 'heavy lifting',
        'standing': 'standing long hours',
        'awkward': 'awkward postures'
      };
      return taskMap[taskId] || taskId;
    });
    
    // Navigate to pain area selection with selected tasks
    router.push({
      pathname: '/(tabs)/painAreaSelection',
      params: { 
        selectedWorkTasks: JSON.stringify(mappedTasks)
      }
    });
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <View style={styles.container}>
      {/* Status Bar Space */}
      <View style={styles.statusBarSpace} />
      
      {/* Header */}
      <View style={styles.header}>
        <BackButton style={styles.backButton} onPress={handleBack} />
        <View style={styles.progressContainer}>
          <ProgressIndicator currentStep={1} totalSteps={2} />
        </View>
      </View>

      {/* Content */}
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Title */}
        <View style={styles.titleContainer}>
          <Text style={styles.title}>What tasks do you do most?</Text>
          <Text style={styles.subtitle}>(Select all that apply)</Text>
        </View>

        {/* Cards Grid */}
        <View style={styles.cardsContainer}>
          {workTasks.map((task) => (
            <SelectableCard
              key={task.id}
              label={task.label}
              icon={task.icon}
              isSelected={selectedTasks.has(task.id)}
              onPress={() => handleTaskPress(task.id)}
            />
          ))}
        </View>
      </ScrollView>

      {/* Next Button */}
      <View style={styles.buttonContainer}>
        <LargeButton label="Next" onPress={handleNext} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Globals.colors.white,
  },
  statusBarSpace: {
    height: Platform.OS === 'ios' ? 44 : 0,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 30,
    paddingBottom: Globals.spacing.medium,
    position: 'relative',
  },
  backButton: {
    position: 'absolute',
    top: Platform.OS === 'web' ? 30 : 60,
    left: 20,
    zIndex: 10,
  },
  progressContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 30,
  },
  content: {
    paddingHorizontal: 30,
    paddingBottom: Globals.spacing.large,
  },
  titleContainer: {
    marginBottom: Globals.spacing.large,
  },
  title: {
    ...Globals.fonts.styles.header2Bold,
    textAlign: 'left',
    marginBottom: Globals.spacing.small,
  },
  subtitle: {
    ...Globals.fonts.styles.body,
    textAlign: 'left',
    color: Globals.colors.black,
  },
  cardsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    justifyContent: 'flex-start',
    width: 332, // 2 cards (158px each) + 1 gap (16px) = 332px
    alignSelf: 'center',
  },
  buttonContainer: {
    paddingHorizontal: 30,
    paddingBottom: Globals.spacing.large,
    alignItems: 'center',
  },
});

