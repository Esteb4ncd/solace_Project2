import React, { useState } from 'react';
import { Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
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
    // Navigate to next screen (pain area selection)
    router.push('/(tabs)/painAreaSelection');
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
        <ProgressIndicator currentStep={1} totalSteps={3} />
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
    paddingHorizontal: Globals.spacing.medium,
    paddingTop: Platform.OS === 'web' ? 20 : 10,
    paddingBottom: Globals.spacing.medium,
    gap: Globals.spacing.medium,
  },
  backButton: {
    // Position is handled by BackButton component's internal style
  },
  content: {
    paddingHorizontal: Globals.spacing.medium,
    paddingBottom: Globals.spacing.large,
  },
  titleContainer: {
    marginBottom: Globals.spacing.large,
    paddingHorizontal: Globals.spacing.small,
  },
  title: {
    ...Globals.fonts.styles.header1,
    textAlign: 'center',
    marginBottom: Globals.spacing.small,
  },
  subtitle: {
    ...Globals.fonts.styles.body,
    textAlign: 'center',
    color: Globals.colors.black,
  },
  cardsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  buttonContainer: {
    paddingHorizontal: Globals.spacing.medium,
    paddingBottom: Globals.spacing.large,
    alignItems: 'center',
  },
});

