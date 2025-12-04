import BackButton from '@/components/ui/BackButton';
import LargeButton from '@/components/ui/LargeButton';
import React from 'react';
import {
  Image,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  View
} from 'react-native';

interface ExercisePageProps {
  title: string;
  subtitle?: string;
  characterImage: any; // require() or { uri: string }
  bottomText?: string;
  buttonLabel: string;
  onButtonPress: () => void;
  onBack?: () => void;
  showBackButton?: boolean;
}

const ExercisePage: React.FC<ExercisePageProps> = ({
  title,
  subtitle,
  characterImage,
  bottomText,
  buttonLabel,
  onButtonPress,
  onBack,
  showBackButton = true
}) => {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="white" />
      
      {/* Back Button */}
      {showBackButton && (
        <BackButton style={styles.backButton} onPress={onBack} />
      )}

      {/* Title */}
      <Text style={styles.title}>{title}</Text>
      
      {/* Subtitle */}
      {subtitle && (
        <Text style={styles.subtitle}>{subtitle}</Text>
      )}

      {/* Character Illustration */}
      <View style={styles.characterContainer}>
        <Image 
          source={characterImage}
          style={styles.characterImage}
          resizeMode="contain"
        />
      </View>

      {/* Bottom Text */}
      {bottomText && (
        <Text style={styles.bottomText}>{bottomText}</Text>
      )}

      {/* Action Button */}
      <View style={styles.buttonContainer}>
        <LargeButton 
          label={buttonLabel} 
          onPress={onButtonPress}
          style={undefined}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingTop: 60, // Account for status bar
  },
  backButton: {
    position: 'absolute',
    top: Platform.OS === 'web' ? 30 : 60,
    left: 20,
    zIndex: 10,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "black",
    textAlign: "center",
    marginTop: 180,
    marginBottom: 40,
  },
  subtitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "black",
    textAlign: "center",
    marginBottom: 40,
  },
  characterContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 40,
  },
  characterImage: {
    width: 200,
    height: 200,
  },
  bottomText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "black",
    textAlign: "center",
    marginBottom: 80,
  },
  buttonContainer: {
    position: "absolute",
    bottom: 40,
    left: 0,
    right: 0,
    alignItems: "center",
    paddingHorizontal: 20,
  },
});

export default ExercisePage;
