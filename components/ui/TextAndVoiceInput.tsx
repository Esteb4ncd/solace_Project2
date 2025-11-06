import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Dimensions, Pressable, StyleSheet, TextInput, View } from 'react-native';
import { Globals } from '../../constants/globals';
import VoiceRecordingVisual from './VoiceRecordingVisual';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

interface TextAndVoiceInputProps {
  placeholder?: string;
  value?: string;
  onChangeText?: (text: string) => void;
  onVoicePress?: () => void;
  onStartRecording?: () => void;
  onSend?: () => void;
  isKeyboardVisible?: boolean;
  multiline?: boolean;
  autoFocus?: boolean;
  blurOnSubmit?: boolean;
}

const TextAndVoiceInput: React.FC<TextAndVoiceInputProps> = ({
  placeholder = "Type something...",
  value = "",
  onChangeText,
  onVoicePress,
  onStartRecording,
  onSend,
  isKeyboardVisible = false,
  multiline = false,
  autoFocus = false,
  blurOnSubmit = false,
}) => {
  const [isRecording, setIsRecording] = useState(false);

  const handleVoicePress = () => {
    if (isKeyboardVisible) {
      // When keyboard is visible, call the original onVoicePress (for send functionality)
      onVoicePress?.();
    } else {
      // When keyboard is not visible, start recording
      if (onStartRecording) {
        // Parent handles recording view
        onStartRecording();
      } else {
        // Fallback to internal recording
        setIsRecording(true);
      }
    }
  };

  const handleSendRecording = () => {
    setIsRecording(false);
    // Call the onSend function to navigate to next page
    onSend?.();
  };

  // If recording (internal), show the voice recording visual
  if (isRecording) {
    return (
      <VoiceRecordingVisual
        onSend={handleSendRecording}
      />
    );
  }

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.textInput}
        placeholder={placeholder}
        placeholderTextColor="#999"
        value={value}
        onChangeText={onChangeText}
        multiline={multiline}
        autoFocus={autoFocus}
        blurOnSubmit={blurOnSubmit}
      />
      <Pressable style={styles.voiceButton} onPress={handleVoicePress}>
        <Ionicons 
          name={isKeyboardVisible ? "play" : "mic"} 
          size={20} 
          color="#fff" 
        />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  textInput: {
    flex: 1,
    backgroundColor: Globals.colors.white,
    borderRadius: 30, // Pill-like appearance
    borderWidth: 1,
    borderColor: Globals.colors.accentNormal,
    paddingHorizontal: 20,
    paddingVertical: 14,
    ...Globals.fonts.styles.caption,
    color: '#000',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
    marginRight: 12,
  },
  voiceButton: {
    backgroundColor: Globals.colors.accentNormal,
    width: 48,
    height: 48,
    borderRadius: 24, // Perfect circle
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
});

export default TextAndVoiceInput;

