import { ResizeMode, Video } from 'expo-av';
import React, { useRef, useState } from "react";
import {
  Dimensions,
  Image,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import LargeButton from '../ui/LargeButton';

interface LocalVideoPlayerProps {
  videoSource: any; // require() or { uri: string }
  videoTitle?: string;
  onBack?: () => void;
  onEnd?: () => void;
  onError?: (error: any) => void;
  onDone?: () => void;
}

export default function LocalVideoPlayer({ 
  videoSource, 
  videoTitle = "Hand Warm Up",
  onBack,
  onEnd,
  onError,
  onDone
}: LocalVideoPlayerProps) {
  const videoRef = useRef<Video>(null);
  const screenHeight = Dimensions.get('window').height;
  const screenWidth = Dimensions.get('window').width;
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isVideoEnded, setIsVideoEnded] = useState(false);
  
  const handlePlayPause = async () => {
    if (videoRef.current && !isVideoEnded) {
      if (isPlaying) {
        await videoRef.current.pauseAsync();
      } else {
        await videoRef.current.playAsync();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleReplay = async () => {
    if (videoRef.current) {
      await videoRef.current.replayAsync();
      setIsVideoEnded(false);
      setIsPlaying(true);
    }
  };

  const handleDone = () => {
    if (onDone) {
      onDone();
    } else if (onBack) {
      onBack();
    }
  };

  const handlePlaybackStatusUpdate = (status: any) => {
    if (status.isLoaded) {
      setCurrentTime(status.positionMillis / 1000);
      setDuration(status.durationMillis / 1000);
      setIsLoading(false);
      
      if (status.didJustFinish) {
        setIsVideoEnded(true);
        setIsPlaying(false);
        if (onEnd) {
          onEnd();
        }
      }
    } else if (status.error && onError) {
      console.error('Video error:', status.error);
      onError(status.error);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      
      {/* Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={onBack}>
        <Text style={styles.backButtonText}>‹</Text>
      </TouchableOpacity>

      {/* Video */}
      <View style={styles.videoContainer}>
        <Video
          ref={videoRef}
          source={videoSource}
          style={styles.video}
          resizeMode={ResizeMode.COVER}
          shouldPlay={isPlaying}
          onPlaybackStatusUpdate={handlePlaybackStatusUpdate}
          onLoad={() => setIsLoading(false)}
        />
        
        {isLoading && (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Loading...</Text>
          </View>
        )}

        {/* Play/Pause Button Overlay */}
        {!isVideoEnded && (
          <TouchableOpacity 
            style={styles.playButtonOverlay}
            onPress={handlePlayPause}
            activeOpacity={0.7}
          >
            {!isPlaying && (
              <Image 
                source={require('@/assets/physicalFlowAssets/PlayButton.png')}
                style={styles.playButtonImage}
                resizeMode="contain"
              />
            )}
          </TouchableOpacity>
        )}

        {/* Replay Overlay */}
        {isVideoEnded && (
          <View style={styles.replayOverlay}>
            <TouchableOpacity 
              style={styles.replayButton}
              onPress={handleReplay}
              activeOpacity={0.7}
            >
              <Image 
                source={require('@/assets/physicalFlowAssets/ReplayButton.png')}
                style={styles.replayButtonImage}
                resizeMode="contain"
              />
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Bottom Controls */}
      <View style={styles.bottomControls}>
        <Text style={styles.videoTitle}>{videoTitle}</Text>
        
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill, 
                { width: `${(currentTime / duration) * 100}%` }
              ]} 
            />
          </View>
          <Text style={styles.timeText}>{formatTime(currentTime)}</Text>
        </View>
      </View>

      {/* Done Button - Only show when video has ended */}
      {isVideoEnded && (
        <View style={styles.doneButtonContainer}>
          <LargeButton 
            label="Done" 
            onPress={handleDone}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  backButton: {
    position: "absolute",
    top: 60,
    left: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  backButtonText: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
  },
  videoContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  video: {
    width: "100%",
    height: "100%",
  },
  loadingContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  loadingText: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
  },
  playButtonOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  playButtonImage: {
    width: 80,
    height: 80,
  },
  bottomControls: {
    position: "absolute",
    bottom: 120, // Moved up to make room for Done button
    left: 20,
    right: 20,
    // No background - transparent overlay
  },
  videoTitle: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
    textShadowColor: "rgba(0, 0, 0, 0.8)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  progressContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  progressBar: {
    width: 350,
    height: 16,
    backgroundColor: "#D9D9D9", // Light grey background
    borderRadius: 5,
    marginRight: 12,
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#B0E06F", // Green progress
    borderRadius: 5,
  },
  timeText: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
    minWidth: 40,
    textAlign: "right",
    textShadowColor: "rgba(0, 0, 0, 0.8)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  replayOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.7)", // Transparent black overlay
    justifyContent: "center",
    alignItems: "center",
  },
  replayButton: {
    justifyContent: "center",
    alignItems: "center",
  },
  replayButtonImage: {
    width: 100,
    height: 100,
  },
  doneButtonContainer: {
    position: "absolute",
    bottom: 40, // Positioned below the progress bar
    left: 0,
    right: 0,
    alignItems: "center",
  },
});
