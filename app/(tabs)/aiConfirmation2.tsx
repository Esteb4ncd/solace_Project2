import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { router, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { Dimensions, Image, Platform, StyleSheet, View } from 'react-native';
import BackButton from '../../components/ui/BackButton';
import LargeButton from '../../components/ui/LargeButton';
import { Globals } from '../../constants/globals';

const { width: screenWidth } = Dimensions.get('window');
const BUTTON_WIDTH = 352;

export default function AIConfirmation2Screen() {
  const { secondAnswer, firstAnswer } = useLocalSearchParams();

  const handleYesPress = () => {
    // Navigate to homepage or next step
    router.push('/(tabs)/homePage');
  };

  const handleNoPress = () => {
    // Go back to question 2
    router.back();
  };

  const handleBackPress = () => {
    // Go back to question 2
    router.push({
      pathname: '/(tabs)/aiQuestion2',
      params: { firstAnswer: firstAnswer as string }
    });
  };

  const answerText = (secondAnswer as string) || '';

  return (
    <ThemedView style={styles.container}>
      {/* Back Button */}
      <BackButton style={styles.backButton} onPress={handleBackPress} />

      {/* Mascot with Speech Bubble */}
      <View style={styles.mascotBubbleContainer}>
        <Image
          source={require('../../assets/onboarding/aiOnboarding01.png')}
          style={styles.mascotImage}
          resizeMode="contain"
        />
        <View style={styles.speechBubble}>
          <ThemedText style={styles.speechBubbleText}>
            Thanks for sharing! Just to make sure I got it right.
          </ThemedText>
          {/* Speech bubble tail pointing to mascot */}
          <View style={styles.speechBubbleTailBorder} />
          <View style={styles.speechBubbleTail} />
        </View>
      </View>

      {/* Confirmation Message */}
      <View style={styles.confirmationContainer}>
        <ThemedText style={styles.confirmationLabel}>You usually feel pain or discomfort in</ThemedText>
        <ThemedText style={styles.confirmationText}>{answerText}</ThemedText>
      </View>

      {/* Buttons Container */}
      <View style={styles.buttonContainer}>
        <LargeButton 
          label="Yes"
          onPress={handleYesPress}
          style={styles.yesButton}
        />
        <LargeButton 
          label="No"
          onPress={handleNoPress}
          style={styles.noButton}
        />
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
    top: Platform.OS === 'web' ? 30 : 60,
    left: 20,
    zIndex: 10,
  },
  mascotBubbleContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: Platform.OS === 'web' ? 100 : 120,
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  mascotImage: {
    width: 120,
    height: 150,
    marginRight: 5,
  },
  speechBubble: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 16,
    borderWidth: 3,
    borderColor: '#E0E0E0',
    padding: 16,
    marginTop: 0,
    marginLeft: -15,
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  speechBubbleText: {
    ...Globals.fonts.styles.header3,
    fontSize: 18,
    color: '#000',
    textAlign: 'center',
    lineHeight: 26,
  },
  speechBubbleTail: {
    position: 'absolute',
    left: -10,
    bottom: 10,
    width: 0,
    height: 0,
    borderStyle: 'solid',
    borderRightWidth: 10,
    borderTopWidth: 8,
    borderBottomWidth: 8,
    borderRightColor: '#fff',
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
    zIndex: 2,
  },
  speechBubbleTailBorder: {
    position: 'absolute',
    left: -13,
    bottom: 8.5,
    width: 0,
    height: 0,
    borderStyle: 'solid',
    borderRightWidth: 13,
    borderTopWidth: 11,
    borderBottomWidth: 11,
    borderRightColor: '#E0E0E0',
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
    zIndex: 1,
  },
  confirmationContainer: {
    alignItems: 'center',
    marginBottom: 60,
    paddingHorizontal: 20,
  },
  confirmationLabel: {
    ...Globals.fonts.styles.body,
    fontSize: 16,
    color: '#000',
    textAlign: 'center',
    marginBottom: 8,
  },
  confirmationText: {
    ...Globals.fonts.styles.header2Bold,
    fontSize: 20,
    fontWeight: '700',
    color: '#000',
    textAlign: 'center',
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 54,
    left: (screenWidth - BUTTON_WIDTH) / 2,
    width: BUTTON_WIDTH,
    alignItems: 'center',
  },
  yesButton: {
    marginBottom: 20,
  },
  noButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
});
