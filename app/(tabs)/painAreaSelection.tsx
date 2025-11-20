import { router, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import BackButton from '../../components/ui/BackButton';
import LargeButton from '../../components/ui/LargeButton';
import FloatingAIAssist from '../../components/ui/FloatingAIAssist';
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
  const { selectedWorkTasks } = useLocalSearchParams();
  const [selectedAreas, setSelectedAreas] = useState<Set<string>>(new Set());
  const isNextDisabled = selectedAreas.size === 0;

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
    if (selectedAreas.size === 0) {
      return;
    }

    // Convert selected areas to array and map to AI service format
    const selectedAreasArray = Array.from(selectedAreas);
    const mappedAreas = selectedAreasArray.map(areaId => {
      // Map manual selection IDs to AI service pain area format
      const areaMap: { [key: string]: string } = {
        'back': 'back',
        'shoulder': 'shoulder',
        'chest': 'chest',
        'hand': 'wrist', // Map hand to wrist for exercises
        'hip': 'hip',
        'legs': 'knee' // Map legs to knee for exercises
      };
      return areaMap[areaId] || areaId;
    });
    
    // Navigate to onboarding complete with both selections
    router.push({
      pathname: '/(tabs)/onboardingComplete',
      params: {
        selectedWorkTasks: selectedWorkTasks as string,
        selectedPainAreas: JSON.stringify(mappedAreas)
      }
    });
  };

  const handleBack = () => {
    // Go back to work task selection (previous step in onboarding)
    router.push('/(tabs)/workTaskSelection');
  };

  return (
    <View style={styles.container}>
      {/* Status Bar Space */}
      <View style={styles.statusBarSpace} />
      
      {/* Header */}
      <View style={styles.header}>
        <BackButton style={styles.backButton} onPress={handleBack} />
        <View style={styles.progressContainer}>
          <ProgressIndicator currentStep={2} totalSteps={2} />
        </View>
      </View>

      {/* Content */}
      <View style={styles.content}>
        <View>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>
              Where do you usually feel pain or discomfort?
            </Text>
            <Text style={styles.subtitle}>(Select all that apply)</Text>
          </View>

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
        </View>
      </View>

      {/* Next Button */}
      <View style={styles.buttonContainer}>
        <LargeButton label="Next" onPress={handleNext} disabled={isNextDisabled} />
      </View>

      <FloatingAIAssist
        onPress={() => {
          let firstAnswerParam = '';
          if (typeof selectedWorkTasks === 'string') {
            try {
              const parsed = JSON.parse(selectedWorkTasks);
              if (Array.isArray(parsed) && parsed.length > 0) {
                firstAnswerParam = parsed.join(', ');
              }
            } catch (error) {
              console.warn('Failed to parse selectedWorkTasks for AI assist:', error);
            }
          }
          
          router.push({
            pathname: '/(tabs)/aiQuestion2',
            params: firstAnswerParam ? { firstAnswer: firstAnswerParam } : {},
          });
        }}
      />
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
    flex: 1,
    paddingHorizontal: 30,
    justifyContent: 'center',
    width: '100%',
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
    marginTop: 8,
  },
  buttonContainer: {
    paddingHorizontal: 30,
    paddingBottom: Globals.spacing.large,
    alignItems: 'center',
  },
});

