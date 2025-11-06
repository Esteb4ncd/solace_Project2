import React, { useEffect, useRef } from 'react';
import { Animated, Dimensions, Platform, Pressable, StyleSheet, View } from 'react-native';
import Svg, { Circle, Defs, LinearGradient, Path, Rect, Stop } from 'react-native-svg';
import { Globals } from '../../constants/globals';
import { ThemedText } from '../themed-text';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
// Send button positioned very close to bottom
const sendButtonBottom = -10; // Lower than bottom

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
  // Animation values for the 3 dots
  const dot1Anim = useRef(new Animated.Value(0)).current;
  const dot2Anim = useRef(new Animated.Value(0)).current;
  const dot3Anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isRecording) {
      // Create staggered animations for the 3 dots
      const createAnimation = (animValue: Animated.Value, delay: number) => {
        return Animated.loop(
          Animated.sequence([
            Animated.delay(delay),
            Animated.timing(animValue, {
              toValue: 1,
              duration: 600,
              useNativeDriver: true,
            }),
            Animated.timing(animValue, {
              toValue: 0,
              duration: 600,
              useNativeDriver: true,
            }),
          ])
        );
      };

      const anim1 = createAnimation(dot1Anim, 0);
      const anim2 = createAnimation(dot2Anim, 200);
      const anim3 = createAnimation(dot3Anim, 400);

      Animated.parallel([anim1, anim2, anim3]).start();
    } else {
      // Reset animations when not recording
      dot1Anim.setValue(0);
      dot2Anim.setValue(0);
      dot3Anim.setValue(0);
    }
  }, [isRecording, dot1Anim, dot2Anim, dot3Anim]);

  // Interpolate scale and opacity for each dot
  const dot1Scale = dot1Anim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.5],
  });
  const dot1Opacity = dot1Anim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.5, 1],
  });

  const dot2Scale = dot2Anim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.5],
  });
  const dot2Opacity = dot2Anim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.5, 1],
  });

  const dot3Scale = dot3Anim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.5],
  });
  const dot3Opacity = dot3Anim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.5, 1],
  });

  return (
    <View style={styles.container}>
      {/* Mascot with Speech Bubble */}
      <View style={styles.mascotBubbleContainer}>
        <View style={styles.mascotImage}>
          <Svg width={96} height={169} viewBox="0 0 96 169" fill="none">
            <Defs>
              <LinearGradient id="paint0_linear_2171_12364" x1="47.1034" y1="45.2166" x2="90.4327" y2="8.67845" gradientUnits="userSpaceOnUse">
                <Stop stopColor="#7267D9" />
                <Stop offset="0.39" stopColor="#B9D5F1" />
                <Stop offset="0.84" stopColor="#D3D0F3" />
              </LinearGradient>
            </Defs>
            <Path d="M54.8001 24.2288C62.7842 23.2641 69.9005 29.4732 70.198 37.6649L72.3942 98.1874C72.4686 103.156 68.8733 107.358 64.0523 107.941L23.0867 112.892C18.2657 113.475 13.7671 110.249 12.6513 105.407L0.30321 46.1146C-1.36871 38.089 4.05795 30.3638 12.0421 29.399L54.8036 24.2288H54.8001Z" fill="#7267D9"/>
            <Path d="M23.7883 68.6363C26.2512 68.6363 28.2479 66.6443 28.2479 64.187C28.2479 61.7298 26.2512 59.7378 23.7883 59.7378C21.3253 59.7378 19.3286 61.7298 19.3286 64.187C19.3286 66.6443 21.3253 68.6363 23.7883 68.6363Z" fill="#F6F6F6"/>
            <Path d="M51.7189 65.2581C54.1819 65.2581 56.1786 63.2661 56.1786 60.8089C56.1786 58.3516 54.1819 56.3596 51.7189 56.3596C49.2559 56.3596 47.2593 58.3516 47.2593 60.8089C47.2593 63.2661 49.2559 65.2581 51.7189 65.2581Z" fill="#F6F6F6"/>
            <Path d="M21.4441 74.1238L56.3768 69.9001C60.0867 69.4516 63.4616 72.0907 63.9112 75.792C65.2617 86.9097 57.3103 97.0305 46.1666 98.3779L38.1772 99.3438C27.0334 100.691 16.889 92.7584 15.5385 81.6406C15.0889 77.9394 17.7342 74.5723 21.4441 74.1238Z" fill="#F6F6F6"/>
            <Path d="M46.7843 148.182H49.5047C50.5142 148.182 51.3325 148.998 51.3325 150.006V158.77C51.3325 164.05 55.6221 168.326 60.9106 168.326H65.9476C71.0271 168.326 74.7748 163.601 73.6094 158.667L61.6049 107.895H34.6841L22.6795 158.667C21.5142 163.597 25.2618 168.326 30.3413 168.326H35.3784C40.6704 168.326 44.9565 164.046 44.9565 158.77V150.006C44.9565 148.998 45.7747 148.182 46.7843 148.182Z" fill="#7267D9"/>
            <Path d="M34.6837 107.895C22.286 116.377 13.7847 120.971 13.7847 125.565C13.7847 130.159 21.5775 144.295 27.0679 138.817C32.5584 133.339 32.2041 128.745 28.3077 124.858C31.4957 120.617 36.809 116.377 36.809 116.377L34.6837 107.895Z" fill="#7267D9"/>
            <Path d="M52.3525 113.415C66.1849 119.288 74.6366 123.971 78.5188 121.501C82.4011 119.03 88.7806 107.867 82.5817 103.202C77.5447 99.4134 71.3069 104.294 70.1167 109.662C64.8176 109.259 58.3778 107.068 58.3778 107.068L52.3525 113.415Z" fill="#7267D9"/>
            <Path d="M60.8893 108.358C50.7692 110.408 40.2595 111.673 29.9446 112.097L29.9375 112.026C37.6099 111.136 53.3409 109.026 60.8929 108.354L60.8893 108.358Z" fill="#443E82"/>
            <Path d="M30.1285 127.155C29.7176 131 28.8249 134.789 27.4683 138.407C27.8756 134.562 28.7753 130.774 30.1285 127.155Z" fill="#443E82"/>
            <Path d="M64.3363 60.3137C63.8368 60.3137 63.3905 60.0027 63.2169 59.5362L56.0439 40.1984C55.842 39.6507 55.4099 39.2231 54.8644 39.0216L35.4814 31.8654C35.0139 31.6922 34.7021 31.2469 34.7021 30.7486C34.7021 30.2504 35.0139 29.8051 35.4814 29.6319L54.8644 22.4757C55.4099 22.2742 55.842 21.8431 56.0439 21.2989L63.2169 1.96106C63.3905 1.49458 63.8368 1.18359 64.3363 1.18359C64.8357 1.18359 65.282 1.49458 65.4556 1.96106L72.6286 21.2989C72.8305 21.8466 73.2626 22.2742 73.8081 22.4757L93.1911 29.6319C93.6586 29.8051 93.9704 30.2504 93.9704 30.7486C93.9704 31.2469 93.6586 31.6922 93.1911 31.8654L73.8081 39.0216C73.2591 39.2231 72.8305 39.6542 72.6286 40.1984L65.4556 59.5362C65.282 60.0027 64.8357 60.3137 64.3363 60.3137Z" fill="url(#paint0_linear_2171_12364)"/>
            <Path d="M64.3359 2.37835L71.5089 21.7161C71.8312 22.5855 72.5184 23.2746 73.3933 23.5962L92.7763 30.7525L73.3933 37.9087C72.5219 38.2303 71.8312 38.9194 71.5089 39.7888L64.3359 59.1266L57.1629 39.7888C56.8406 38.9194 56.1498 38.2303 55.2785 37.9087L35.8955 30.7525L55.2785 23.5962C56.1498 23.2746 56.8406 22.5855 57.1629 21.7161L64.3359 2.37835ZM64.3359 0C63.337 0 62.4479 0.618442 62.1007 1.5514L54.9278 20.8892C54.8463 21.1083 54.6727 21.2815 54.4531 21.3627L35.0702 28.519C34.135 28.8653 33.5151 29.7559 33.5151 30.7489C33.5151 31.742 34.135 32.6325 35.0702 32.9788L54.4531 40.1351C54.6727 40.2164 54.8463 40.3895 54.9278 40.6086L62.1007 59.9464C62.4479 60.8794 63.3405 61.4978 64.3359 61.4978C65.3312 61.4978 66.2239 60.8794 66.571 59.9464L73.744 40.6086C73.8255 40.3895 73.999 40.2164 74.2186 40.1351L93.6016 32.9788C94.5367 32.6325 95.1566 31.742 95.1566 30.7489C95.1566 29.7559 94.5367 28.8653 93.6016 28.519L74.2186 21.3627C73.999 21.2815 73.8255 21.1083 73.744 20.8892L66.571 1.5514C66.2239 0.618442 65.3312 0 64.3359 0Z" fill="white"/>
          </Svg>
        </View>
        <View style={styles.speechBubble}>
          <ThemedText style={styles.questionText}>{question}</ThemedText>
          {/* Speech bubble tail pointing left towards mascot */}
          <View style={styles.speechBubbleTailBorder} />
          <View style={styles.speechBubbleTail} />
        </View>
      </View>

      {/* Voice Recording Circle */}
      <View style={styles.voiceCircleContainer}>
        <Pressable 
          onPress={isRecording && onStopRecording ? onStopRecording : undefined}
          disabled={!isRecording || !onStopRecording}
        >
          <View style={styles.voiceCircle}>
            <Svg width={108} height={108} viewBox="0 0 108 108" fill="none">
              <Defs>
                <LinearGradient id="paint0_linear_2446_3898" x1="-60.6341" y1="-176.829" x2="-137.838" y2="51.0218" gradientUnits="userSpaceOnUse">
                  <Stop offset="0.0373392" stopColor="#D3D0F3"/>
                  <Stop offset="0.490004" stopColor="#B9D5F1"/>
                  <Stop offset="1" stopColor="#7267D9"/>
                </LinearGradient>
              </Defs>
              <Circle cx="54" cy="50" r="50" fill="url(#paint0_linear_2446_3898)"/>
            </Svg>
            {/* Animated dots indicator */}
            {isRecording && (
              <View style={styles.dotsContainer}>
                <Animated.View
                  style={[
                    styles.recordingDot,
                    {
                      transform: [{ scale: dot1Scale }],
                      opacity: dot1Opacity,
                    },
                  ]}
                />
                <Animated.View
                  style={[
                    styles.recordingDot,
                    {
                      transform: [{ scale: dot2Scale }],
                      opacity: dot2Opacity,
                    },
                  ]}
                />
                <Animated.View
                  style={[
                    styles.recordingDot,
                    {
                      transform: [{ scale: dot3Scale }],
                      opacity: dot3Opacity,
                    },
                  ]}
                />
              </View>
            )}
          </View>
        </Pressable>
      </View>

      {/* Send Button - Always visible when in voice conversation view */}
      <View style={styles.playButtonContainer}>
        <Pressable 
          style={styles.playButton} 
          onPress={onSend}
        >
          <View style={styles.sendButtonWrapper}>
            <Svg width={72} height={72} viewBox="0 0 72 72" fill="none">
              <Defs>
                <LinearGradient id="paint0_linear_1959_6921" x1="-37.3658" y1="-113.171" x2="-86.7761" y2="32.6539" gradientUnits="userSpaceOnUse">
                  <Stop offset="0.0373392" stopColor="#D3D0F3"/>
                  <Stop offset="0.490004" stopColor="#B9D5F1"/>
                  <Stop offset="1" stopColor="#7267D9"/>
                </LinearGradient>
              </Defs>
              <Rect x="4" y="0" width="64" height="64" rx="32" fill="url(#paint0_linear_1959_6921)" shapeRendering="crispEdges"/>
              <Path d="M28.3316 27.9133L30.0998 31.0077C30.3767 31.4922 30.5151 31.7344 30.5151 32C30.5151 32.2655 30.3767 32.5078 30.0998 32.9922L28.3316 36.0866C27.0933 38.2536 26.4742 39.3371 26.957 39.8745C27.4398 40.4118 28.5831 39.9116 30.8697 38.9112L42.4787 33.8323C44.2742 33.0467 45.1719 32.654 45.1719 32C45.1719 31.3459 44.2742 30.9532 42.4787 30.1676L30.8697 25.0887C28.5831 24.0883 27.4398 23.5881 26.957 24.1255C26.4742 24.6628 27.0933 25.7463 28.3316 27.9133Z" fill="white"/>
            </Svg>
          </View>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 100, // Add padding to ensure button is visible
  },
  mascotBubbleContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: Platform.OS === 'web' ? 180 : 200,
    marginBottom: 40,
  },
  mascotImage: {
    width: 120,
    height: 150,
    marginRight: 8,
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
  questionText: {
    ...Globals.fonts.styles.header3,
    fontSize: 18,
    color: '#000',
    textAlign: 'center',
    lineHeight: 26,
  },
  voiceCircleContainer: {
    alignItems: 'center',
    marginTop: 100,
    marginBottom: 30,
  },
  voiceCircle: {
    width: 108,
    height: 108,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 2,
    elevation: 5,
  },
  voiceCircleDot: {
    position: 'absolute',
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#fff',
    zIndex: 1,
  },
  dotsContainer: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  recordingDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#fff',
    marginHorizontal: 4,
  },
  transcribedContainer: {
    marginBottom: 50, // Increased spacing
    paddingHorizontal: 20,
  },
  transcribedText: {
    ...Globals.fonts.styles.body,
    color: '#000',
    textAlign: 'left',
  },
  playButtonContainer: {
    position: 'absolute',
    bottom: sendButtonBottom, // Very close to bottom
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 10, // Ensure it's on top
  },
  playButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  playButtonGradient: {
    width: 80,
    height: 80,
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
  sendButtonWrapper: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 2,
    elevation: 5,
  },
});

export default VoiceConversationView;

