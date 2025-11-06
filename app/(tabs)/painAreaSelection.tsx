import React, { useState } from 'react';
import { Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import BackButton from '../../components/ui/BackButton';
import LargeButton from '../../components/ui/LargeButton';
import ProgressIndicator from '../../components/ui/ProgressIndicator';
import SelectableCard from '../../components/ui/SelectableCard';
import { Globals } from '../../constants/globals';

interface PainArea {
  id: string;
  label: string;
  icon: any; // Image source (already includes starburst overlay)
}

const painAreas: PainArea[] = [
  {
    id: 'back',
    label: 'Back',
    icon: require('../../assets/SollyStates/backpain.png'),
  },
  {
    id: 'shoulder',
    label: 'Shoulder',
    icon: require('../../assets/SollyStates/shoulderpain.png'),
  },
  {
    id: 'chest',
    label: 'Chest',
    icon: require('../../assets/SollyStates/chestpain.png'),
  },
  {
    id: 'hand',
    label: 'Hand',
    icon: require('../../assets/SollyStates/handpain.png'),
  },
  {
    id: 'hip',
    label: 'Hip',
    icon: require('../../assets/SollyStates/hippain.png'),
  },
  {
    id: 'legs',
    label: 'Legs',
    icon: require('../../assets/SollyStates/legpain.png'),
  },
];

export default function PainAreaSelectionScreen() {
  const [selectedAreas, setSelectedAreas] = useState<Set<string>>(new Set());

  const handleAreaPress = (areaId: string) => {
    setSelectedAreas((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(areaId)) {
        newSet.delete(areaId);
      } else {
        newSet.add(areaId);
      }
      return newSet;
    });
  };

  const handleNext = () => {
    // Navigate to next screen (you can customize this)
    router.push('/(tabs)/homePage');
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
        <ProgressIndicator currentStep={2} totalSteps={3} />
      </View>

      {/* Content */}
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Title */}
        <View style={styles.titleContainer}>
          <Text style={styles.title}>
            Where do you usually feel pain or discomfort?
          </Text>
          <Text style={styles.subtitle}>(Select all that apply)</Text>
        </View>

        {/* Cards Grid */}
        <View style={styles.cardsContainer}>
          {painAreas.map((area) => (
            <SelectableCard
              key={area.id}
              label={area.label}
              icon={area.icon}
              isSelected={selectedAreas.has(area.id)}
              onPress={() => handleAreaPress(area.id)}
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

