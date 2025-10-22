import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';
import { Globals } from '../../constants/globals';
import VoiceRecordingVisual from './VoiceRecordingVisual';

interface TextInputWithVoiceProps {
  placeholder?: string;
  value?: string;
  onChangeText?: (text: string) => void;
  onVoicePress?: () => void;
  onStopRecording?: () => void;
  onSendRecording?: () => void;
  isKeyboardVisible?: boolean;
  isRecording?: boolean;
  isPaused?: boolean;
  multiline?: boolean;
  autoFocus?: boolean;
  blurOnSubmit?: boolean;
}

const TextInputWithVoice: React.FC<TextInputWithVoiceProps> = ({
  placeholder = "Type something...",
  value = "",
  onChangeText,
  onVoicePress,
  onStopRecording,
  onSendRecording,
  isKeyboardVisible = false,
  isRecording = false,
  isPaused = false,
  multiline = false,
  autoFocus = false,
  blurOnSubmit = false,
}) => {
  // If recording, show the voice recording visual
  if (isRecording) {
    return (
      <VoiceRecordingVisual
        onStop={onStopRecording || (() => {})}
        onSend={onSendRecording || (() => {})}
        isPaused={isPaused}
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
      <Pressable style={styles.voiceButton} onPress={onVoicePress}>
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
    maxWidth: 350,
    backgroundColor: Globals.colors.white,
    borderRadius: 24,
    paddingLeft: 16,
    paddingRight: 4,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: Globals.colors.accentNormal,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  textInput: {
    flex: 1,
    ...Globals.fonts.styles.caption,
    color: '#000',
    paddingVertical: 4,
  },
  voiceButton: {
    backgroundColor: Globals.colors.accentNormal,
    borderRadius: 24,
    width: 52,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12,
  },
});

export default TextInputWithVoice;
