import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Dimensions, Image, Modal, Platform, Pressable, StyleSheet, View } from 'react-native';
import Svg, { Defs, LinearGradient, Path, Stop } from 'react-native-svg';
import BackButton from '../../components/ui/BackButton';
import LargeButton from '../../components/ui/LargeButton';
import TextAndVoiceInput from '../../components/ui/TextAndVoiceInput';
import { Globals } from '../../constants/globals';
import { recordingStorage } from '../../services/recordingStorage';
import { aiService } from '@/services/aiService';

const { width: screenWidth } = Dimensions.get('window');
const BUTTON_WIDTH = 352;

export default function AIConfirmation1Screen() {
  const { answer } = useLocalSearchParams();
  const [showModal, setShowModal] = useState(false);
  const [inputValue, setInputValue] = useState('');

  const handleYesPress = async () => {
    // Save question 1 recording to JSON file before navigating
    try {
      // If data wasn't stored yet, store it now from the answer parameter
      const storedData = recordingStorage.getQuestion1Data();
      if (!storedData && answer) {
        console.log('📝 Storing question 1 data from answer parameter...');
        recordingStorage.storeQuestion1(
          'What iron work tasks do you typically do?',
          answer as string,
          null
        );
      }
      
      const filePath = await recordingStorage.saveQuestion1ToJSON();
      console.log('✅ Question 1 recording saved to:', filePath);
      
      // Show success message (optional)
      if (Platform.OS === 'web') {
        Alert.alert('Success', 'Question 1 recording saved! Check your downloads folder.');
      } else {
        Alert.alert('Success', `Question 1 recording saved to:\n${filePath}`);
      }
    } catch (error: any) {
      console.error('Error saving question 1 recording:', error);
      const errorMessage = error?.message || String(error);
      Alert.alert('Error', `Failed to save recording:\n${errorMessage}\n\nContinuing anyway...`);
    }
    
    // Navigate to question 2
    router.push({
      pathname: '/(tabs)/aiQuestion2',
      params: { firstAnswer: answer as string }
    });
  };

  const handleNoPress = () => {
    // Show overlay modal
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleBackPress = () => {
    // Go back to question 1
    router.push('/(tabs)/aiQuestion1');
  };

  // Format the answer text - split into parts for styling
  const answerText = (answer as string) || '';
  const answerParts = answerText.split(' ');

  // Get AI summary of what was picked up
  const getAISummary = () => {
    const context = aiService.getCurrentContext();
    if (context.workTasks.length > 0) {
      const tasks = context.workTasks.join(', ');
      return `${tasks}.`;
    }
    return '';
  };

  const aiSummary = getAISummary();

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
        <ThemedText style={styles.confirmationLabel}>
          Your tasks involve {aiSummary || answerText}
        </ThemedText>
        {aiSummary && (
          <ThemedText style={styles.summarySubtext}>
            Is this what you meant?
          </ThemedText>
        )}
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

      {/* Overlay Modal */}
      <Modal
        visible={showModal}
        transparent={true}
        animationType="fade"
        onRequestClose={handleCloseModal}
      >
        <Pressable style={styles.modalOverlay} onPress={handleCloseModal}>
          <Pressable style={styles.modalCard} onPress={(e) => e.stopPropagation()}>
            {/* Close Button */}
            <Pressable style={styles.closeButton} onPress={handleCloseModal}>
              <ThemedText style={styles.closeButtonText}>×</ThemedText>
            </Pressable>

            {/* Avatar and Greeting */}
            <View style={styles.modalHeader}>
              <View style={styles.avatarContainer}>
                <Svg width={89} height={102} viewBox="0 0 89 102" fill="none">
                  <Defs>
                    <LinearGradient id="paint0_linear_2079_2995" x1="45.2175" y1="42.0566" x2="85.3677" y2="8.88927" gradientUnits="userSpaceOnUse">
                      <Stop stopColor="#7267D9" />
                      <Stop offset="0.39" stopColor="#B9D5F1" />
                      <Stop offset="0.84" stopColor="#D3D0F3" />
                    </LinearGradient>
                  </Defs>
                  <Path d="M53.8977 20.4069C61.532 20.4069 67.5258 27.2069 66.8703 35.1197L62.0161 93.5873C61.5185 98.374 57.6493 102 53.0404 102H13.8804C9.27159 102 5.40232 98.374 4.90479 93.5873L0.0505504 35.1197C-0.604974 27.2069 5.38887 20.4069 13.0232 20.4069H53.901H53.8977Z" fill="#7267D9"/>
                  <Path d="M20.1095 59.5428C22.447 59.5428 24.3419 57.6128 24.3419 55.232C24.3419 52.8513 22.447 50.9213 20.1095 50.9213C17.7721 50.9213 15.8772 52.8513 15.8772 55.232C15.8772 57.6128 17.7721 59.5428 20.1095 59.5428Z" fill="#F6F6F6"/>
                  <Path d="M46.8112 59.5428C49.1486 59.5428 51.0435 57.6128 51.0435 55.232C51.0435 52.8513 49.1486 50.9213 46.8112 50.9213C44.4737 50.9213 42.5789 52.8513 42.5789 55.232C42.5789 57.6128 44.4737 59.5428 46.8112 59.5428Z" fill="#F6F6F6"/>
                  <Path d="M16.7613 64.5178H50.156C53.7026 64.5178 56.5802 67.4487 56.5802 71.061C56.5802 81.9116 47.9306 90.7214 37.2775 90.7214H29.6398C18.9867 90.7214 10.3372 81.9116 10.3372 71.061C10.3372 67.4487 13.2147 64.5178 16.7613 64.5178Z" fill="#F6F6F6"/>
                  <Path d="M60.9165 56.0983C60.4627 56.0983 60.0559 55.8107 59.8979 55.3758L53.383 37.4445C53.1847 36.9035 52.7678 36.4755 52.2367 36.2769L34.6317 29.6413C34.2047 29.4804 33.9224 29.0661 33.9224 28.6038C33.9224 28.1416 34.2047 27.7273 34.6317 27.5664L52.2367 20.9307C52.7678 20.7287 53.188 20.3041 53.383 19.7632L59.8979 1.83183C60.0559 1.39699 60.4627 1.10938 60.9165 1.10938C61.3703 1.10938 61.7771 1.39699 61.9351 1.83183L68.45 19.7632C68.6483 20.3041 69.0652 20.7321 69.5963 20.9307L87.2047 27.5664C87.6316 27.7273 87.914 28.1416 87.914 28.6038C87.914 29.0661 87.6316 29.4804 87.2047 29.6413L69.5963 36.2769C69.0652 36.479 68.645 36.9035 68.45 37.4445L61.9351 55.3758C61.7771 55.8107 61.3703 56.0983 60.9165 56.0983Z" fill="url(#paint0_linear_2079_2995)"/>
                  <Path d="M60.9166 2.21188L67.4315 20.1432C67.7374 20.9855 68.393 21.6532 69.2199 21.9648L86.825 28.6004L69.2199 35.2361C68.393 35.5476 67.7374 36.2153 67.4315 37.0576L60.9166 54.9889L54.4017 37.0576C54.0958 36.2153 53.4403 35.5476 52.6133 35.2361L35.0083 28.6004L52.6133 21.9648C53.4403 21.6532 54.0958 20.9855 54.4017 20.1432L60.9166 2.21188ZM60.9166 0C60.009 0 59.1955 0.575227 58.8795 1.44491L52.3646 19.3762C52.2772 19.6159 52.0923 19.8008 51.8603 19.8898L34.2553 26.5255C33.4014 26.8473 32.8367 27.6759 32.8367 28.6004C32.8367 29.5249 33.4014 30.3535 34.2553 30.6753L51.8603 37.311C52.0956 37.4 52.2772 37.5883 52.3646 37.8246L58.8795 55.7559C59.1955 56.6256 60.009 57.2008 60.9166 57.2008C61.8243 57.2008 62.6378 56.6256 62.9538 55.7559L69.4687 37.8246C69.5561 37.5849 69.741 37.4 69.9729 37.311L87.578 30.6753C88.4318 30.3535 88.9966 29.5249 88.9966 28.6004C88.9966 27.6759 88.4318 26.8473 87.578 26.5255L69.9729 19.8898C69.7376 19.8008 69.5561 19.6125 69.4687 19.3762L62.9538 1.44491C62.6378 0.575227 61.8243 0 60.9166 0Z" fill="white"/>
                </Svg>
              </View>
              <View style={styles.greetingContainer}>
                <ThemedText style={styles.greetingText}>Hey, Let me know</ThemedText>
                <ThemedText style={styles.greetingText}>anything!</ThemedText>
              </View>
            </View>

            {/* Text Input with Voice Button */}
            <View style={styles.modalInputContainer}>
              <TextAndVoiceInput
                placeholder="Ask Solly anything!"
                value={inputValue}
                onChangeText={setInputValue}
                onVoicePress={() => {}}
                autoFocus={false}
                multiline={false}
              />
            </View>
          </Pressable>
        </Pressable>
      </Modal>
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
    zIndex: 0,
  },
  mascotImage: {
    width: 120,
    height: 150,
    marginRight: 5,
    zIndex: 0,
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
    zIndex: 2,
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
    zIndex: 2,
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
    marginBottom: 16,
  },
  summaryText: {
    ...Globals.fonts.styles.body,
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 12,
    fontStyle: 'italic',
    lineHeight: 22,
  },
  summarySubtext: {
    ...Globals.fonts.styles.body,
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    marginTop: 8,
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 24,
    width: screenWidth * 0.9,
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    left: 16,
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  closeButtonText: {
    fontSize: 28,
    fontWeight: '300',
    color: '#000',
    lineHeight: 28,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 20,
    marginBottom: 24,
  },
  avatarContainer: {
    marginRight: 16,
  },
  greetingContainer: {
    flex: 1,
    marginTop: 8,
  },
  greetingText: {
    ...Globals.fonts.styles.header2Bold,
    fontSize: 20,
    fontWeight: '700',
    color: '#000',
    lineHeight: 28,
  },
  modalInputContainer: {
    marginTop: 8,
  },
});
