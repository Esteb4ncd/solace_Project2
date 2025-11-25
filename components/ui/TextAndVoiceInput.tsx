import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Dimensions, Pressable, StyleSheet, TextInput, View } from 'react-native';
import Svg, { Defs, LinearGradient, Path, Rect, Stop } from 'react-native-svg';
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
      // When keyboard is visible, prioritize sending the message if handler exists
      if (onSend) {
        onSend();
        return;
      }
      // Fallback to legacy behaviour
      onVoicePress?.();
      return;
    }

    // When keyboard is not visible, start recording (voice mode)
    if (onStartRecording) {
      onStartRecording();
    } else {
      // Fallback to internal recording visual
      setIsRecording(true);
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
      <Pressable 
        style={[
          styles.voiceButton,
          isKeyboardVisible && { backgroundColor: 'transparent' }
        ]} 
        onPress={handleVoicePress}
      >
        {isKeyboardVisible ? (
          <View style={styles.sendButtonWrapper}>
            <Svg width="100%" height="100%" viewBox="0 0 72 72" fill="none" style={styles.sendButtonSvg}>
              <Defs>
                <LinearGradient id="paint0_linear_1959_6921" x1="-37.3658" y1="-113.171" x2="-86.7761" y2="32.6539" gradientUnits="userSpaceOnUse">
                  <Stop offset="0.0373392" stopColor="#D3D0F3"/>
                  <Stop offset="0.490004" stopColor="#B9D5F1"/>
                  <Stop offset="1" stopColor="#7267D9"/>
                </LinearGradient>
              </Defs>
              <Rect x="4" y="0" width="64" height="64" rx="32" fill="url(#paint0_linear_1959_6921)"/>
              <Path d="M28.3316 27.9133L30.0998 31.0077C30.3767 31.4922 30.5151 31.7344 30.5151 32C30.5151 32.2655 30.3767 32.5078 30.0998 32.9922L28.3316 36.0866C27.0933 38.2536 26.4742 39.3371 26.957 39.8745C27.4398 40.4118 28.5831 39.9116 30.8697 38.9112L42.4787 33.8323C44.2742 33.0467 45.1719 32.654 45.1719 32C45.1719 31.3459 44.2742 30.9532 42.4787 30.1676L30.8697 25.0887C28.5831 24.0883 27.4398 23.5881 26.957 24.1255C26.4742 24.6628 27.0933 25.7463 28.3316 27.9133Z" fill="white"/>
            </Svg>
          </View>
        ) : (
          <Ionicons 
            name="mic" 
            size={20} 
            color="#fff" 
          />
        )}
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
    overflow: 'hidden',
    backgroundColor: Globals.colors.accentNormal,
  },
  sendButtonWrapper: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonSvg: {
    width: '100%',
    height: '100%',
  },
});

export default TextAndVoiceInput;

