import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Dimensions, Pressable, StyleSheet, TextInput, View } from 'react-native';
import { Globals } from '../../constants/globals';
import VoiceRecordingVisual from './VoiceRecordingVisual';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

interface TextInputWithVoiceProps {
  placeholder?: string;
  value?: string;
  onChangeText?: (text: string) => void;
  onVoicePress?: () => void;
  onSend?: () => void;
  isKeyboardVisible?: boolean;
  multiline?: boolean;
  autoFocus?: boolean;
  blurOnSubmit?: boolean;
}

const TextInputWithVoice: React.FC<TextInputWithVoiceProps> = ({
  placeholder = "Type something...",
  value = "",
  onChangeText,
  onVoicePress,
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
      setIsRecording(true);
    }
  };

  const handleSendRecording = () => {
    setIsRecording(false);
    // Call the onSend function to navigate to next page
    onSend?.();
  };

  // If recording, show the voice recording visual
  if (isRecording) {
    return (
      <VoiceRecordingVisual
        onSend={handleSendRecording}
      />
    );
  }

  return (
    <View style={styles.inputContainer}>
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
          size={16} 
          color="#000" 
        />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    maxWidth: screenWidth * 0.9, // 90% of screen width
    backgroundColor: Globals.colors.white,
    borderRadius: screenWidth * 0.06, // 6% of screen width
    paddingLeft: screenWidth * 0.04, // 4% of screen width
    paddingRight: screenWidth * 0.01, // 1% of screen width
    paddingVertical: screenWidth * 0.01, // 1% of screen width
    borderWidth: 1,
    borderColor: Globals.colors.accentNormal,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: screenWidth * 0.005, // 0.5% of screen width
    },
    shadowOpacity: 0.1,
    shadowRadius: screenWidth * 0.008, // 0.8% of screen width
    elevation: 3,
  },
  textInput: {
    flex: 1,
    ...Globals.fonts.styles.caption,
    color: '#000',
    paddingVertical: screenWidth * 0.01, // 1% of screen width
  },
  voiceButton: {
    backgroundColor: Globals.colors.accentNormal,
    borderRadius: screenWidth * 0.06, // 6% of screen width
    width: screenWidth * 0.13, // 13% of screen width
    height: screenWidth * 0.13, // 13% of screen width
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: screenWidth * 0.03, // 3% of screen width
  },
});

export default TextInputWithVoice;
