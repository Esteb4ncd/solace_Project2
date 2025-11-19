import { ResizeMode, Video } from 'expo-av';
import { useEffect, useRef, useState } from "react";
import {
  Dimensions,
  Image,
  PanResponder,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import BackButton from '../ui/BackButton';
import LargeButton from '../ui/LargeButton';

interface LocalVideoPlayerProps {
  videoSource: any; // require() or { uri: string }
  videoTitle?: string;
  instructions?: string; // Instructions/caption to show during video
  onBack?: () => void;
  onEnd?: () => void;
  onError?: (error: any) => void;
  onDone?: () => void;
  resetTrigger?: number; // Add reset trigger prop
}

export default function LocalVideoPlayer({ 
  videoSource, 
  videoTitle = "Hand Warm Up",
  instructions = "",
  onBack,
  onEnd,
  onError,
  onDone,
  resetTrigger
}: LocalVideoPlayerProps) {
  const videoRef = useRef<Video>(null);
  const screenHeight = Dimensions.get('window').height;
  const screenWidth = Dimensions.get('window').width;
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isVideoEnded, setIsVideoEnded] = useState(false);
  const [isSeeking, setIsSeeking] = useState(false);
  const [seekTime, setSeekTime] = useState(0);

  // Reset video when resetTrigger changes
  useEffect(() => {
    if (resetTrigger !== undefined && videoRef.current) {
      const resetVideo = async () => {
        try {
          await videoRef.current?.setPositionAsync(0);
          setCurrentTime(0);
          setIsPlaying(false);
          setIsVideoEnded(false);
        } catch (error) {
          console.log('Error resetting video:', error);
        }
      };
      resetVideo();
    }
  }, [resetTrigger]);
  
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
      // Only update current time if not seeking (to avoid conflicts)
      if (!isSeeking) {
        setCurrentTime(status.positionMillis / 1000);
      }
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

  const handleSeek = async (time: number) => {
    if (videoRef.current && duration > 0) {
      const clampedTime = Math.max(0, Math.min(time, duration));
      try {
        await videoRef.current.setPositionAsync(clampedTime * 1000);
        setCurrentTime(clampedTime);
        setIsVideoEnded(false);
      } catch (error) {
        console.error('Error seeking video:', error);
      }
    }
  };


  // Handle touch on progress bar for scrubbing
  const handleProgressBarPress = (evt: any) => {
    if (duration > 0) {
      const touchX = evt.nativeEvent.locationX;
      const percentage = Math.max(0, Math.min(1, touchX / progressBarWidth));
      const newTime = percentage * duration;
      handleSeek(newTime);
    }
  };

  // Pan responder for scrubbing the progress bar
  const progressBarRef = useRef<View>(null);
  const [progressBarWidth, setProgressBarWidth] = useState(350);
  
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (evt) => {
        setIsSeeking(true);
        if (videoRef.current) {
          videoRef.current.pauseAsync();
        }
        setIsPlaying(false);
        // Calculate initial seek position
        if (duration > 0) {
          const touchX = evt.nativeEvent.locationX;
          const percentage = Math.max(0, Math.min(1, touchX / progressBarWidth));
          const newTime = percentage * duration;
          setSeekTime(newTime);
          setCurrentTime(newTime);
        }
      },
      onPanResponderMove: (evt) => {
        if (duration > 0) {
          const touchX = evt.nativeEvent.locationX;
          const percentage = Math.max(0, Math.min(1, touchX / progressBarWidth));
          const newTime = percentage * duration;
          setSeekTime(newTime);
          setCurrentTime(newTime);
        }
      },
      onPanResponderRelease: async () => {
        setIsSeeking(false);
        await handleSeek(seekTime);
      },
    })
  ).current;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      
      {/* Back Button */}
      <BackButton style={styles.backButton} onPress={onBack} />

      {/* Video */}
      <View style={styles.videoContainer}>
        <Video
          ref={videoRef}
          source={videoSource}
          style={styles.video}
          resizeMode={ResizeMode.COVER}
          shouldPlay={isPlaying}
          onPlaybackStatusUpdate={handlePlaybackStatusUpdate}
          onLoad={() => {
            console.log('✅ Video loaded successfully:', videoSource);
            setIsLoading(false);
          }}
          onLoadStart={() => {
            console.log('🔄 Video loading started:', videoSource);
            setIsLoading(true);
          }}
          onError={(error) => {
            console.error('❌ Video error:', error);
            console.error('❌ Video source was:', videoSource);
            setIsLoading(false);
            if (onError) {
              onError(error);
            }
          }}
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

      {/* Caption - Show when playing */}
      {isPlaying && instructions && (
        <View style={styles.captionContainer}>
          <Text style={styles.captionText}>{instructions}</Text>
        </View>
      )}

      {/* Bottom Controls */}
      <View style={styles.bottomControls}>
        {/* Title - Show when paused */}
        {!isPlaying && (
          <Text style={styles.videoTitle}>{videoTitle}</Text>
        )}
        
        <View style={styles.progressContainer}>
          <Text style={styles.currentTimeText}>
            {formatTime(currentTime)}
          </Text>
          <TouchableOpacity
            ref={progressBarRef}
            style={styles.progressBar}
            activeOpacity={1}
            onPress={handleProgressBarPress}
            onLayout={(event) => {
              const { width } = event.nativeEvent.layout;
              setProgressBarWidth(width);
            }}
            {...panResponder.panHandlers}
          >
            <View 
              style={[
                styles.progressFill, 
                { width: `${duration > 0 ? (currentTime / duration) * 100 : 0}%` }
              ]} 
            />
          </TouchableOpacity>
          <Text style={styles.totalTimeText}>
            {formatTime(duration)}
          </Text>
        </View>
      </View>

      {/* Done Button - Only show when video has ended */}
      {isVideoEnded && (
        <View style={styles.doneButtonContainer}>
          <LargeButton 
            label="Done" 
            onPress={handleDone}
            style={undefined}
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
    position: 'absolute',
    top: 55,
    left: 25.5,
    zIndex: 10,
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
  captionContainer: {
    position: "absolute",
    bottom: 160, // Closer to bottom controls
    left: 20,
    right: 20,
    alignItems: "center",
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
  captionText: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 16,
    textAlign: "center",
    textShadowColor: "rgba(0, 0, 0, 0.8)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  progressContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
  },
  progressBar: {
    flex: 1,
    height: 16,
    backgroundColor: "#D9D9D9", // Light grey background
    borderRadius: 5,
    marginRight: 0,
    marginLeft: 0,
    position: "relative",
    justifyContent: "center",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#B0E06F", // Green progress
    borderRadius: 5,
  },
  currentTimeText: {
    color: "white",
    fontSize: 12,
    fontWeight: "500",
    minWidth: 50,
    textAlign: "left",
    textShadowColor: "rgba(0, 0, 0, 0.8)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
    marginRight: 4,
  },
  totalTimeText: {
    color: "white",
    fontSize: 12,
    fontWeight: "500",
    minWidth: 50,
    textAlign: "right",
    textShadowColor: "rgba(0, 0, 0, 0.8)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
    marginLeft: 4,
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
