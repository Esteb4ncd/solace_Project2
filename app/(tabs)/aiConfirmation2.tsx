import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { router, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { Image, Platform, Pressable, StyleSheet, View } from 'react-native';
import BackButton from '../../components/ui/BackButton';
import LargeButton from '../../components/ui/LargeButton';
import { Globals } from '../../constants/globals';

export default function AIConfirmation2Screen() {
  const { secondAnswer } = useLocalSearchParams();

  const handleYesPress = () => {
    // Navigate to homepage or next step
    router.push('/(tabs)/homePage');
  };

  const handleNoPress = () => {
    // Go back to question 2
    router.back();
  };

  const handleBackPress = () => {
    router.back();
  };

  return (
    <ThemedView style={styles.container}>
      {/* Back Button */}
      <BackButton style={styles.backButton} onPress={handleBackPress} />

      {/* Confirmation Text */}
      <View style={styles.textContainer}>
        <ThemedText style={styles.subText}>
          Just to make sure I got it right
        </ThemedText>
      </View>

      {/* Data Display */}
      <View style={styles.dataContainer}>
        <ThemedText style={styles.dataText}>
          {secondAnswer as string}
        </ThemedText>
      </View>

      {/* Mascot - positioned lower-left/central, reflected */}
      <Image
        source={require('../../assets/onboarding/aiOnboarding02.png')}
        style={styles.mascotImage}
        resizeMode="contain"
      />

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
  textContainer: {
    marginTop: Platform.OS === 'web' ? 220 : 240,
    marginBottom: 30,
    alignItems: 'center',
    paddingHorizontal: 20,
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
  mascotImage: {
    position: 'absolute',
    bottom: 140,
    right: -20,
    width: 280,
    height: 360,
    zIndex: 1,
    transform: [{ scaleX: -1 }], // Reflect horizontally
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

