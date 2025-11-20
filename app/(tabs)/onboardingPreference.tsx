import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { aiService } from '@/services/aiService';
import { router } from 'expo-router';
import React from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import Svg, { ClipPath, Defs, G, LinearGradient, Path, Rect, Stop } from 'react-native-svg';
import BackButton from '../../components/ui/BackButton';
import LargeButton from '../../components/ui/LargeButton';
import AIAssistButton from '../../components/ui/AIAssistButton';
import { Globals } from '../../constants/globals';

export default function OnboardingPreferenceScreen() {
  const handleStartManualFlow = () => {
    router.push('/(tabs)/workTaskSelection');
  };

  const handleAIAssist = () => {
    aiService.resetConversation();
    router.push('/(tabs)/aiQuestion1');
  };

  const handleBackPress = () => {
    // Always go to homePage from onboarding preference
    router.push('/(tabs)/homePage');
  };

  return (
    <ThemedView style={styles.container}>
      <BackButton style={styles.backButton} onPress={handleBackPress} />
      <View style={styles.content}>
        <View style={styles.illustrationWrapper}>
          <PersonalizeIllustration />
        </View>

        <View style={styles.heroCard}>
          <ThemedText style={styles.heroTitle}>Let’s personalize your exercises</ThemedText>
          <ThemedText style={styles.heroBody}>
            Answer two quick questions or tap Solly to describe things in your own words.
          </ThemedText>
        </View>

        <View style={styles.aiRow}>
          <AIAssistButton onPress={handleAIAssist} showLabel animateAttention disabled />
          <ThemedText style={styles.aiHint}>Solly is always here if you want to talk.</ThemedText>
        </View>

        <View style={styles.stepsRow}>
          <View style={styles.stepBox}>
            <ThemedText style={styles.stepLabel}>1</ThemedText>
            <ThemedText style={styles.stepText}>Pick work tasks</ThemedText>
          </View>
          <View style={styles.stepBox}>
            <ThemedText style={styles.stepLabel}>2</ThemedText>
            <ThemedText style={styles.stepText}>Share pain areas</ThemedText>
          </View>
        </View>

        <View style={styles.actions}>
          <LargeButton label="Start survey" onPress={handleStartManualFlow} />
        </View>
      </View>
    </ThemedView>
  );
}

const PersonalizeIllustration = () => (
  <Svg width={160} height={240} viewBox="0 0 133 244" fill="none">
    <Path
      d="M107.044 0C121.924 0 133.606 13.0842 132.328 28.3095L122.867 140.81C121.897 150.02 114.356 156.997 105.374 156.997H29.0509C20.0683 156.997 12.5271 150.02 11.5575 140.81L2.09656 28.3095C0.812395 13.0842 12.5009 0 27.3737 0H107.044Z"
      fill="#7267D9"
    />
    <Path
      d="M41.1892 75.3033C45.7449 75.3033 49.438 71.5897 49.438 67.0088C49.438 62.4278 45.7449 58.7142 41.1892 58.7142C36.6335 58.7142 32.9404 62.4278 32.9404 67.0088C32.9404 71.5897 36.6335 75.3033 41.1892 75.3033Z"
      fill="#F6F6F6"
    />
    <Path
      d="M93.2312 75.3033C97.7869 75.3033 101.48 71.5897 101.48 67.0088C101.48 62.4278 97.7869 58.7142 93.2312 58.7142C88.6755 58.7142 84.9824 62.4278 84.9824 67.0088C84.9824 71.5897 88.6755 75.3033 93.2312 75.3033Z"
      fill="#F6F6F6"
    />
    <G clipPath="url(#clip0)">
      <Path
        d="M122.904 204.578L115.194 199.094C118.02 197.158 119.958 194.662 120.385 191.521C122.343 177.214 100.054 162.906 94.1943 158.541L93.6932 153.257H43.6228L43.1417 158.361L43.1217 158.248C37.9235 162.241 14.5386 176.881 16.543 191.521C16.984 194.735 19.0018 197.278 21.9349 199.227L14.4117 204.571C5.57886 210.853 3.52767 223.078 9.83491 231.875L14.0576 237.765C18.8481 244.446 28.1687 245.996 34.8835 241.225L62.2171 221.793H75.1055L102.439 241.225C109.147 245.996 118.475 244.446 123.265 237.765L127.488 231.875C133.795 223.078 131.744 210.853 122.911 204.571L122.904 204.578Z"
        fill="url(#paint0)"
      />
      <Path
        d="M44.705 169.92L42.2328 179.297L41.9589 178.904C44.725 179.104 47.431 179.663 50.0501 180.588C55.4153 182.391 60.2726 186.803 60.2927 192.832C60.3194 195.727 59.8717 198.668 58.0945 201.097C51.3329 209.442 35.0971 198.901 25.9235 199.939L25.8901 199.74C28.5761 199.054 31.4223 199.234 34.1417 199.587C36.8744 199.966 39.5536 200.552 42.2061 201.104C46.7829 201.863 53.2772 203.872 56.6981 199.993C58.1947 198.136 58.7626 195.401 58.796 192.866C58.8963 184.234 49.2817 180.355 41.9188 179.516L41.538 179.47L41.6449 179.124L44.5179 169.867L44.7116 169.92H44.705Z"
        fill="#443E82"
      />
      <Path
        d="M107.123 0C122.296 0 134.209 13.2162 132.906 28.5951L123.258 142.23C122.269 151.533 114.579 158.581 105.419 158.581H27.5872C18.427 158.581 10.7367 151.533 9.74788 142.23L0.0999349 28.5951C-1.20962 13.2162 10.71 0 25.8768 0H107.123Z"
        fill="url(#paint1)"
      />
      <Path
        d="M39.968 76.0628C44.6138 76.0628 48.3799 72.3118 48.3799 67.6846C48.3799 63.0575 44.6138 59.3064 39.968 59.3064C35.3223 59.3064 31.5562 63.0575 31.5562 67.6846C31.5562 72.3118 35.3223 76.0628 39.968 76.0628Z"
        fill="#F6F6F6"
      />
      <Path
        d="M93.0383 76.0628C97.6841 76.0628 101.45 72.3118 101.45 67.6846C101.45 63.0575 97.6841 59.3064 93.0383 59.3064C88.3926 59.3064 84.6265 63.0575 84.6265 67.6846C84.6265 72.3118 88.3926 76.0628 93.0383 76.0628Z"
        fill="#F6F6F6"
      />
      <Path
        d="M90.3859 169.867L93.2589 179.124L93.3658 179.47L92.9849 179.516C85.6287 180.348 76.0008 184.234 76.1077 192.866C76.1411 195.401 76.709 198.136 78.2057 199.993C81.6266 203.872 88.1209 201.863 92.6976 201.111C95.3502 200.558 98.0294 199.973 100.762 199.593C103.481 199.234 106.328 199.061 109.014 199.746L108.98 199.946C99.8067 198.908 83.5775 209.449 76.8093 201.104C75.0253 198.682 74.5777 195.734 74.6111 192.839C74.6311 186.81 79.4885 182.398 84.8537 180.594C87.4728 179.669 90.1788 179.11 92.9449 178.911L92.6709 179.303L90.1988 169.927L90.3926 169.874L90.3859 169.867Z"
        fill="#443E82"
      />
    </G>
    <Path
      d="M122.518 202.535L114.957 197.106C117.729 195.189 119.629 192.718 120.048 189.609C121.968 175.444 100.111 161.279 94.3648 156.957L93.8734 151.726H44.7737L44.302 156.78L44.2823 156.668C39.185 160.621 16.2534 175.115 18.219 189.609C18.6514 192.791 20.6301 195.307 23.5064 197.238L16.129 202.528C7.46738 208.747 5.45596 220.85 11.6409 229.56L15.7817 235.39C20.4794 242.005 29.6192 243.54 36.2039 238.816L63.0076 219.578H75.6461L102.45 238.816C109.028 243.54 118.174 242.005 122.872 235.39L127.013 229.56C133.198 220.85 131.186 208.747 122.525 202.528L122.518 202.535Z"
      fill="#7267D9"
    />
    <Path
      d="M45.8358 168.223L43.4116 177.506L43.143 177.117C45.8555 177.315 48.509 177.868 51.0773 178.784C56.3384 180.57 61.1016 184.938 61.1213 190.906C61.1475 193.772 60.7085 196.684 58.9657 199.089C52.3352 207.351 36.4142 196.915 27.4185 197.943L27.3857 197.745C30.0196 197.066 32.8107 197.244 35.4773 197.594C38.157 197.969 40.7843 198.549 43.3854 199.096C47.8734 199.847 54.2418 201.836 57.5964 197.995C59.064 196.157 59.6209 193.45 59.6537 190.939C59.752 182.395 50.3238 178.554 43.1037 177.724L42.7302 177.677L42.835 177.335L45.6523 168.171L45.8423 168.223H45.8358Z"
      fill="#443E82"
    />
    <Path
      d="M90.6298 168.171L93.4471 177.335L93.5519 177.677L93.1785 177.724C85.9649 178.547 76.5236 182.395 76.6285 190.939C76.6612 193.45 77.2181 196.157 78.6858 197.995C82.0403 201.836 88.4087 199.847 92.8968 199.102C95.4979 198.555 98.1251 197.976 100.805 197.6C103.471 197.244 106.263 197.073 108.896 197.752L108.864 197.949C99.8679 196.922 83.9535 207.357 77.3164 199.096C75.5671 196.698 75.1281 193.779 75.1609 190.913C75.1805 184.944 79.9437 180.576 85.2049 178.791C87.7732 177.875 90.4267 177.322 93.1392 177.124L92.8705 177.513L90.4464 168.23L90.6364 168.177L90.6298 168.171Z"
      fill="#443E82"
    />
    <Path
      d="M48.4629 157.32C55.4079 156.279 62.3856 156.035 69.383 156.002C76.3804 156.029 83.3516 156.272 90.3031 157.32C83.3581 158.367 76.3804 158.611 69.383 158.637C62.3856 158.605 55.4144 158.361 48.4629 157.32Z"
      fill="#443E82"
    />
    <Defs>
      <LinearGradient id="paint0" x1="67.0678" y1="158.554" x2="69.4407" y2="251.54" gradientUnits="userSpaceOnUse">
        <Stop stopColor="#443E82" />
        <Stop offset="0.25" stopColor="#7065D6" />
        <Stop offset="0.51" stopColor="#7267D9" />
        <Stop offset="0.92" stopColor="#453F84" />
      </LinearGradient>
      <LinearGradient id="paint1" x1="-12.6549" y1="79.2904" x2="147.358" y2="79.2904" gradientUnits="userSpaceOnUse">
        <Stop offset="0.1" stopColor="#443E83" />
        <Stop offset="0.5" stopColor="#7267D9" />
        <Stop offset="0.89" stopColor="#443E82" />
      </LinearGradient>
      <ClipPath id="clip0">
        <Rect width="133" height="244" fill="white" />
      </ClipPath>
    </Defs>
  </Svg>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F6F6F9',
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingHorizontal: 24,
  },
  backButton: {
    position: 'absolute',
    top: Platform.OS === 'web' ? 30 : 60,
    left: 20,
    zIndex: 10,
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 32,
    paddingBottom: 32,
  },
  illustrationWrapper: {
    width: '100%',
    alignItems: 'center',
  },
  heroCard: {
    width: '100%',
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 18,
    gap: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 3,
  },
  heroTitle: {
    ...Globals.fonts.styles.header2Bold,
  },
  heroBody: {
    ...Globals.fonts.styles.body,
    color: '#505050',
  },
  aiRow: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#EFE9FF',
    borderRadius: 20,
    paddingHorizontal: 18,
    paddingVertical: 12,
    gap: 16,
  },
  aiHint: {
    flex: 1,
    fontFamily: 'Poppins_500Medium',
    fontSize: 13,
    color: '#4C3F91',
  },
  stepsRow: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  stepBox: {
    flex: 1,
    backgroundColor: '#FFF',
    borderRadius: 18,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ECE9FF',
  },
  stepLabel: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 18,
    color: '#7267D9',
    marginBottom: 4,
  },
  stepText: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 13,
    color: '#1E1E1E',
    textAlign: 'center',
  },
  actions: {
    width: '100%',
    alignItems: 'center',
    gap: 10,
  },
});

