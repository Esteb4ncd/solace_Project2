import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { router, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { Platform, Pressable, StyleSheet, View } from 'react-native';
import BackButton from '../../components/ui/BackButton';
import LargeButton from '../../components/ui/LargeButton';
import OnboardingMascot from '../../components/ui/OnboardingMascot';
import { Globals } from '../../constants/globals';

export default function AIConfirmation1Screen() {
  const { answer } = useLocalSearchParams();

  const handleYesPress = () => {
    // Navigate to question 2
    router.push({
      pathname: '/(tabs)/aiQuestion2',
      params: { firstAnswer: answer as string }
    });
  };

  const handleNoPress = () => {
    // Go back to question 1
    router.back();
  };

  const handleBackPress = () => {
    router.back();
  };

  return (
    <ThemedView style={styles.container}>
      {/* Back Button */}
      <BackButton style={styles.backButton} onPress={handleBackPress} />

      {/* Mascot */}
      <View style={styles.mascotContainer}>
        <OnboardingMascot />
      </View>

      {/* Confirmation Text */}
      <View style={styles.textContainer}>
        <ThemedText style={styles.subText}>
          Just to make sure I got it right
        </ThemedText>
      </View>

      {/* Data Display */}
      <View style={styles.dataContainer}>
        <ThemedText style={styles.dataText}>
          {answer as string}
        </ThemedText>
      </View>

      {/* Buttons Container */}
      <View style={styles.buttonContainer}>
        <LargeButton 
          label="Yes" 
          onPress={handleYesPress} 
        />
        <Pressable 
          style={styles.noButton}
          onPress={handleNoPress}
        >
          <ThemedText style={styles.noButtonText}>No</ThemedText>
        </Pressable>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
    paddingHorizontal: 20,
  },
  backButton: {
    position: 'absolute',
    top: Platform.OS === 'web' ? 20 : 50,
    left: 20,
    zIndex: 10,
  },
  mascotContainer: {
    marginBottom: 20,
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  subText: {
    ...Globals.fonts.styles.body,
    textAlign: 'center',
  },
  dataContainer: {
    alignItems: 'center',
    marginBottom: 60,
    paddingHorizontal: 20,
  },
  dataText: {
    ...Globals.fonts.styles.header2Bold,
    textAlign: 'center',
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 54,
    width: '100%',
    alignItems: 'center',
  },
  noButton: {
    marginTop: 20,
    paddingVertical: 10,
  },
  noButtonText: {
    ...Globals.fonts.styles.body,
    textAlign: 'center',
    color: '#666',
  },
});

