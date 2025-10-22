import LargeButton from '@/components/ui/LargeButton';
import React from 'react';
import {
    Image,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
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
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Text style={styles.backButtonText}>‹</Text>
        </TouchableOpacity>
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
    position: "absolute",
    top: 60,
    left: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0, 0, 0, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  backButtonText: {
    color: "black",
    fontSize: 24,
    fontWeight: "bold",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "black",
    textAlign: "center",
    marginTop: 130,
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
