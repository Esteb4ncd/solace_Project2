import React from 'react';
import { Dimensions, Image, Pressable, StyleSheet, View } from 'react-native';
import Svg, { Circle, Defs, RadialGradient, Stop } from 'react-native-svg';
import { Globals } from '../../constants/globals';
import { ThemedText } from '../themed-text';

const { width: screenWidth } = Dimensions.get('window');

interface VoiceConversationViewProps {
  question: string;
  transcribedText?: string;
  isRecording?: boolean;
  onSend: () => void;
  onPlay?: () => void;
  onStopRecording?: () => void;
}

const VoiceConversationView: React.FC<VoiceConversationViewProps> = ({
  question,
  transcribedText,
  isRecording = false,
  onSend,
  onPlay,
  onStopRecording,
}) => {
  return (
    <View style={styles.container}>
      {/* Mascot with Speech Bubble */}
      <View style={styles.mascotBubbleContainer}>
        <Image
          source={require('../../assets/onboarding/aiOnboarding02.png')}
          style={styles.mascotImage}
          resizeMode="contain"
        />
        <View style={styles.speechBubble}>
          <ThemedText style={styles.questionText}>{question}</ThemedText>
        </View>
      </View>

      {/* Voice Recording Circle */}
      <View style={styles.voiceCircleContainer}>
        <Pressable 
          onPress={isRecording && onStopRecording ? onStopRecording : undefined}
          disabled={!isRecording || !onStopRecording}
        >
          <View style={styles.voiceCircle}>
            <Svg width={200} height={200}>
              <Defs>
                <RadialGradient id="voiceGradient" cx="50%" cy="50%">
                  <Stop offset="0%" stopColor="#D3D0F3" stopOpacity="1" />
                  <Stop offset="100%" stopColor="#A8D5E2" stopOpacity="1" />
                </RadialGradient>
              </Defs>
              <Circle cx="100" cy="100" r="100" fill="url(#voiceGradient)" />
            </Svg>
            <View style={styles.voiceCircleDot} />
          </View>
        </Pressable>
      </View>

      {/* Transcribed Text */}
      {transcribedText && (
        <View style={styles.transcribedContainer}>
          <ThemedText style={styles.transcribedText}>{transcribedText}</ThemedText>
        </View>
      )}

      {/* Play Button */}
      {transcribedText && (
        <View style={styles.playButtonContainer}>
          <Pressable style={styles.playButton} onPress={onPlay || onSend}>
            <View style={styles.playButtonGradient}>
              <Svg width={80} height={80}>
                <Defs>
                  <RadialGradient id="playGradient" cx="50%" cy="50%">
                    <Stop offset="0%" stopColor="#D3D0F3" stopOpacity="1" />
                    <Stop offset="100%" stopColor="#A8D5E2" stopOpacity="1" />
                  </RadialGradient>
                </Defs>
                <Circle cx="40" cy="40" r="40" fill="url(#playGradient)" />
              </Svg>
              <View style={styles.playIcon} />
            </View>
          </Pressable>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  mascotBubbleContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 40,
  },
  mascotImage: {
    width: 120,
    height: 150,
    marginRight: 15,
  },
  speechBubble: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginTop: 10,
  },
  questionText: {
    ...Globals.fonts.styles.body,
    color: '#000',
  },
  voiceCircleContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  voiceCircle: {
    width: 200,
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  voiceCircleDot: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#fff',
    zIndex: 1,
  },
  transcribedContainer: {
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  transcribedText: {
    ...Globals.fonts.styles.body,
    color: '#000',
    textAlign: 'left',
  },
  playButtonContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  playButton: {
    width: 80,
    height: 80,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  playButtonGradient: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  playIcon: {
    position: 'absolute',
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 20,
    borderTopWidth: 12,
    borderBottomWidth: 12,
    borderLeftColor: '#fff',
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
    marginLeft: 6,
    zIndex: 1,
  },
});

export default VoiceConversationView;

