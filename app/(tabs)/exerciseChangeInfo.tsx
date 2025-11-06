import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { router } from 'expo-router';
import React from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import Svg, { Defs, LinearGradient, Path, Stop } from 'react-native-svg';
import LargeButton from '../../components/ui/LargeButton';
import { Globals } from '../../constants/globals';

const { width: screenWidth } = Dimensions.get('window');

export default function ExerciseChangeInfoScreen() {
  const handleGotItPress = () => {
    router.push('/(tabs)/homePage');
  };

  return (
    <ThemedView style={styles.container}>
      {/* Icon Container with AI Avatar */}
      <View style={styles.iconContainer}>
        {/* AI Avatar Icon */}
        <View style={styles.avatarContainer}>
          <Svg width={178} height={204} viewBox="0 0 89 102" fill="none">
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
      </View>

      {/* Question Text */}
      <View style={styles.textContainer}>
        <ThemedText style={styles.questionText}>
          Want to change your exercises?
        </ThemedText>
      </View>

      {/* Instruction Text */}
      <View style={styles.instructionContainer}>
        <ThemedText style={styles.instructionText}>
          Look for me on your home page!
        </ThemedText>
      </View>

      {/* Got it Button */}
      <View style={styles.buttonContainer}>
        <LargeButton
          label="Got it"
          onPress={handleGotItPress}
          style={styles.gotItButton}
        />
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
    paddingHorizontal: 20,
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 50,
    position: 'relative',
  },
  avatarContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 20,
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  questionText: {
    ...Globals.fonts.styles.header2Bold,
    textAlign: 'center',
    color: '#000',
    fontSize: 20,
    fontWeight: '700',
  },
  instructionContainer: {
    alignItems: 'center',
    marginBottom: 80,
    paddingHorizontal: 20,
  },
  instructionText: {
    ...Globals.fonts.styles.body,
    textAlign: 'center',
    color: '#000',
    fontSize: 16,
    fontWeight: '400',
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 54,
    width: '100%',
    alignItems: 'center',
  },
  gotItButton: {
    backgroundColor: Globals.colors.primaryButton,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
});

