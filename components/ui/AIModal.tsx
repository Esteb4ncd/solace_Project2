import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { getExerciseXpReward, recommendExercises } from '@/constants/exercises';
import { useExerciseContext } from '@/contexts/ExerciseContext';
import { aiService } from '@/services/aiService';
import React, { useEffect, useState } from 'react';
import { Dimensions, Image, Keyboard, KeyboardAvoidingView, Modal, Platform, Pressable, StyleSheet, TouchableWithoutFeedback, View } from 'react-native';
import { Globals } from '../../constants/globals';
import { recordingStorage } from '../../services/recordingStorage';
import { speechService } from '../../services/speechService';
import TextAndVoiceInput from './TextAndVoiceInput';
import VoiceConversationView from './VoiceConversationView';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

interface AIModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function AIModal({ visible, onClose }: AIModalProps) {
  const { setRecommendedExercises, updateDailyTasks } = useExerciseContext();
  const [inputValue, setInputValue] = useState('');
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [transcribedText, setTranscribedText] = useState('');

  useEffect(() => {
    if (!visible) {
      // Reset state when modal closes
      setInputValue('');
      setIsRecording(false);
      setTranscribedText('');
      setIsKeyboardVisible(false);
    }
  }, [visible]);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
      setIsKeyboardVisible(true);
    });
    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      setIsKeyboardVisible(false);
    });

    return () => {
      keyboardDidShowListener?.remove();
      keyboardDidHideListener?.remove();
    };
  }, []);

  const handleStartRecording = async () => {
    try {
      await speechService.startRecording();
      setIsRecording(true);
    } catch (error) {
      console.error('Error starting recording:', error);
      setIsRecording(true);
    }
  };

  const handleVoicePress = async () => {
    if (isKeyboardVisible) {
      handleSend();
    } else {
      await handleStartRecording();
    }
  };

  const extractTasksFromText = (text: string): string[] => {
    const lowerAnswer = text.toLowerCase();
    const extractedTasks: string[] = [];
    
    if (lowerAnswer.includes('lift') || lowerAnswer.includes('heavy') || lowerAnswer.includes('weight')) {
      extractedTasks.push('heavy lifting');
    }
    if (lowerAnswer.includes('overhead') || lowerAnswer.includes('above') || lowerAnswer.includes('reach')) {
      extractedTasks.push('overhead work');
    }
    if (lowerAnswer.includes('tool') || lowerAnswer.includes('repetitive') || lowerAnswer.includes('hammer') || lowerAnswer.includes('drill')) {
      extractedTasks.push('repetitive tool use');
    }
    if (lowerAnswer.includes('kneel') || lowerAnswer.includes('crouch') || lowerAnswer.includes('squat')) {
      extractedTasks.push('kneeling');
    }
    if (lowerAnswer.includes('stand') || lowerAnswer.includes('long hours')) {
      extractedTasks.push('standing long hours');
    }
    if (lowerAnswer.includes('awkward') || lowerAnswer.includes('twist')) {
      extractedTasks.push('awkward postures');
    }
    return extractedTasks;
  };

  const extractPainAreasFromText = (text: string): string[] => {
    const lowerAnswer = text.toLowerCase();
    const extractedAreas: string[] = [];
    
    if (lowerAnswer.includes('shoulder') || lowerAnswer.includes('arm')) {
      extractedAreas.push('shoulder');
    }
    if (lowerAnswer.includes('knee') || lowerAnswer.includes('leg')) {
      extractedAreas.push('knee');
    }
    if (lowerAnswer.includes('back') || lowerAnswer.includes('spine')) {
      extractedAreas.push('back');
    }
    if (lowerAnswer.includes('neck')) {
      extractedAreas.push('neck');
    }
    if (lowerAnswer.includes('wrist') || lowerAnswer.includes('hand')) {
      extractedAreas.push('wrist');
    }
    if (lowerAnswer.includes('hip')) {
      extractedAreas.push('hip');
    }
    if (lowerAnswer.includes('chest')) {
      extractedAreas.push('chest');
    }
    return extractedAreas;
  };

  const handleSend = async () => {
    let finalText = inputValue.trim();
    
    if (isRecording) {
      try {
        const { transcription, audioUri } = await speechService.stopAndTranscribeWithUri();
        if (transcription) {
          finalText = transcription;
          setTranscribedText(transcription);
          setInputValue(transcription);
          recordingStorage.storeQuestion1(
            'What iron work tasks do you typically do, and where do you usually feel pain or discomfort?',
            transcription,
            audioUri
          );
        }
      } catch (error) {
        console.error('Error transcribing audio:', error);
      }
      setIsRecording(false);
    }
    
    // Process with AI service
    if (finalText) {
      try {
        await aiService.sendMessage(finalText, isRecording);
      } catch (error) {
        console.error('❌ Error processing with AI:', error);
      }
    }
    
    // Process answer and update checklist
    processAnswerAndUpdateChecklist(finalText);
  };

  const handleStopRecording = async () => {
    try {
      const { transcription, audioUri } = await speechService.stopAndTranscribeWithUri();
      if (transcription) {
        setTranscribedText(transcription);
        setInputValue(transcription);
        recordingStorage.storeQuestion1(
          'What iron work tasks do you typically do, and where do you usually feel pain or discomfort?',
          transcription,
          audioUri
        );
      }
      setIsRecording(false);
    } catch (error) {
      console.error('Error stopping recording:', error);
      setIsRecording(false);
    }
  };

  const processAnswerAndUpdateChecklist = (answer: string) => {
    // Get context from AI service
    const context = aiService.getCurrentContext();
    let workTasks = [...context.workTasks];
    let painAreas = [...context.painAreas];

    // Extract from answer if context is empty
    if (workTasks.length === 0 && answer) {
      workTasks = extractTasksFromText(answer);
    }
    
    if (painAreas.length === 0 && answer) {
      painAreas = extractPainAreasFromText(answer);
    }

    // Use defaults if still empty
    if (workTasks.length === 0) {
      workTasks = ['heavy lifting'];
      console.log('⚠️ No work tasks extracted, using default: heavy lifting');
    }
    
    if (painAreas.length === 0) {
      painAreas = ['back'];
      console.log('⚠️ No pain areas extracted, using default: back');
    }

    console.log('📋 Final context for recommendations:', { painAreas, workTasks });
    
    // Generate recommendations and update checklist directly
    try {
      const recommendedExercises = recommendExercises(
        painAreas,
        workTasks,
        [],
        3 // Get top 3 recommendations for daily checklist
      );
      
      if (recommendedExercises.length > 0) {
        setRecommendedExercises(recommendedExercises);
        
        // Convert to daily tasks format
        const dailyTasks = recommendedExercises.map((recEx) => ({
          id: recEx.exercise.id,
          title: recEx.exercise.name,
          xpAmount: getExerciseXpReward(recEx.exercise, recEx.isRecommended),
          xpColor: '#7267D9',
          isCompleted: false,
        }));
        
        updateDailyTasks(dailyTasks);
        console.log('✅ Generated recommendations and updated checklist:', dailyTasks);
      } else {
        console.warn('⚠️ No exercises found for context:', { painAreas, workTasks });
      }
      
      // Close modal after updating checklist
      onClose();
    } catch (error) {
      console.error('Error generating recommendations:', error);
      onClose();
    }
  };

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  if (!visible) return null;

  // Show conversation view when recording
  if (isRecording) {
    return (
      <Modal
        visible={visible}
        transparent={true}
        animationType="slide"
        onRequestClose={onClose}
      >
        <View style={styles.modalOverlay}>
          <TouchableWithoutFeedback onPress={dismissKeyboard}>
            <KeyboardAvoidingView 
              style={styles.keyboardAvoidingView}
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
              keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
            >
              <Pressable style={styles.modalOverlayPressable} onPress={onClose}>
                <ThemedView style={styles.modalContent} onStartShouldSetResponder={() => true}>
                  <Pressable style={styles.closeButton} onPress={onClose}>
                    <ThemedText style={styles.closeButtonText}>×</ThemedText>
                  </Pressable>
                  
                  <View style={styles.voiceHeaderContainer}>
                    <Pressable style={styles.voiceButton}>
                      <ThemedText style={styles.voiceButtonText}>Voice</ThemedText>
                    </Pressable>
                  </View>

                  <View style={styles.voiceContentContainer}>
                    <VoiceConversationView
                      question="What iron work tasks do you typically do, and where do you usually feel pain or discomfort?"
                      transcribedText={transcribedText}
                      isRecording={isRecording}
                      onSend={handleSend}
                      onPlay={() => processAnswerAndUpdateChecklist(transcribedText)}
                      onStopRecording={handleStopRecording}
                    />
                  </View>
                </ThemedView>
              </Pressable>
            </KeyboardAvoidingView>
          </TouchableWithoutFeedback>
        </View>
      </Modal>
    );
  }

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <TouchableWithoutFeedback onPress={dismissKeyboard}>
          <KeyboardAvoidingView 
            style={styles.keyboardAvoidingView}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
          >
            <Pressable style={styles.modalOverlayPressable} onPress={onClose}>
              <ThemedView style={styles.modalContent} onStartShouldSetResponder={() => true}>
              <Pressable style={styles.closeButton} onPress={onClose}>
                <ThemedText style={styles.closeButtonText}>×</ThemedText>
              </Pressable>

              {isKeyboardVisible ? (
                <View style={styles.keyboardQuestionContainer}>
                  <Image
                    source={require('../../assets/onboarding/aiOnboarding02.png')}
                    style={styles.keyboardMascotImage}
                    resizeMode="contain"
                  />
                  <View style={styles.speechBubble}>
                    <ThemedText style={styles.speechBubbleText}>
                      What iron work tasks do you typically do, and where do you usually feel pain or discomfort?
                    </ThemedText>
                    <View style={styles.speechBubbleTailBorder} />
                    <View style={styles.speechBubbleTail} />
                  </View>
                </View>
              ) : (
                <>
                  <View style={styles.questionContainer}>
                    <ThemedText style={styles.questionText}>
                      What iron work tasks do you typically do, and where do you usually feel pain or discomfort?
                    </ThemedText>
                  </View>

                  <Image
                    source={require('../../assets/onboarding/aiOnboarding02.png')}
                    style={styles.mascotImage}
                    resizeMode="contain"
                  />
                </>
              )}

              <View style={styles.inputSection}>
                <TextAndVoiceInput
                  placeholder="Ask Solly anything!"
                  value={inputValue}
                  onChangeText={setInputValue}
                  onVoicePress={handleVoicePress}
                  onStartRecording={handleStartRecording}
                  onSend={handleSend}
                  isKeyboardVisible={isKeyboardVisible}
                  autoFocus={false}
                  multiline={true}
                />
              </View>
            </ThemedView>
            </Pressable>
          </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 0,
    padding: 0,
  },
  keyboardAvoidingView: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalOverlayPressable: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 24,
    paddingTop: 8,
    paddingBottom: 20,
    paddingHorizontal: 20,
    width: screenWidth * 0.9,
    maxWidth: 400,
    height: 500,
    minHeight: 500,
    maxHeight: 500,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
    overflow: 'hidden',
    justifyContent: 'space-between',
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  closeButtonText: {
    fontSize: 28,
    color: '#000',
    fontWeight: '300',
    lineHeight: 28,
  },
  questionContainer: {
    marginTop: 16,
    marginBottom: 16,
    alignItems: 'center',
    paddingHorizontal: 16,
    zIndex: 2,
  },
  questionText: {
    ...Globals.fonts.styles.header2Bold,
    textAlign: 'center',
    color: '#000',
  },
  mascotImage: {
    width: 150,
    height: 180,
    alignSelf: 'center',
    marginTop: 20,
    marginBottom: 20,
    zIndex: 0,
  },
  keyboardQuestionContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: -8,
    marginBottom: 8,
    paddingHorizontal: 16,
    zIndex: 2,
  },
  keyboardMascotImage: {
    width: 80,
    height: 100,
    marginRight: 8,
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
    marginLeft: -10,
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
  inputSection: {
    marginTop: 'auto',
    marginBottom: 0,
    zIndex: 2,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 120,
    flexGrow: 1,
  },
  voiceContentContainer: {
    width: '100%',
    marginTop: 16,
    paddingBottom: 20,
    height: 400,
    maxHeight: 400,
  },
  voiceHeaderContainer: {
    width: '100%',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 16,
  },
  voiceButton: {
    backgroundColor: '#D3D0F3',
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 8,
    width: 160,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  voiceButtonText: {
    ...Globals.fonts.styles.header2Bold,
    fontSize: 20,
    fontWeight: '700',
    color: '#564DA3',
    textAlign: 'center',
  },
});

