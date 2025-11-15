import { Ionicons } from "@expo/vector-icons";
import { Audio } from "expo-av";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  Animated,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import BackButton from "../../components/ui/BackButton";
import ExercisePage from "../../components/ui/ExercisePage";
import { Globals } from "../../constants/globals";
import { useExerciseContext } from "../../contexts/ExerciseContext";

export default function whiteNoise() {
  const router = useRouter();
  const { soundType } = useLocalSearchParams();
  const { markExerciseComplete } = useExerciseContext();

  // Audio and playback state
  const [sound, setSound] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPosition, setCurrentPosition] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  // Track management

  // Progress bar interaction
  const progressWidth = useRef(new Animated.Value(0)).current;
  const [progressBarWidth, setProgressBarWidth] = useState(280);

  // LP spinning animation
  const spinValue = useRef(new Animated.Value(0)).current;
  const spinAnimation = useRef(null);

  const tracks = [
    {
      name: "Rain Sounds",
      duration: "3:24",
      image: require("../../assets/whiteNoiseAssets/LP.png"),
      audio: require("../../assets/whiteNoiseAssets/rain-sounds.mp3"),
    },
    {
      name: "Soft Piano",
      duration: "5:12",
      image: require("../../assets/whiteNoiseAssets/LP.png"),
      audio: require("../../assets/whiteNoiseAssets/soft-piano-72454.mp3"),
    },
    {
      name: "Sea Waves",
      duration: "2:48",
      image: require("../../assets/whiteNoiseAssets/LP.png"),
      audio: require("../../assets/whiteNoiseAssets/sea-waves.mp3"),
    },
  ];

  // Find current track index based on soundType or default to first track
  const initialIndex = soundType
    ? tracks.findIndex((track) => track.name === soundType)
    : 0;

  // Use initialIndex directly instead of state to avoid stale state issues
  const currentTrackIndex = initialIndex >= 0 ? initialIndex : 0;
  const [trackIndex, setTrackIndex] = useState(currentTrackIndex);

  console.log("Sound type from params:", soundType);
  console.log("Initial track index:", initialIndex);
  console.log("Current track index:", trackIndex);
  console.log("Current track index (direct):", currentTrackIndex);

  const currentTrack = tracks[trackIndex];

  // Reset completion state when screen comes into focus and stop music when leaving
  useFocusEffect(
    useCallback(() => {
      // Reset state when focusing
      setIsCompleted(false);
      setIsPlaying(false);
      setCurrentPosition(0);
      setDuration(0);
      progressWidth.setValue(0);

      // Return cleanup function that runs when leaving the screen
      return () => {
        console.log("Leaving white noise page, stopping audio...");
        if (sound) {
          // Check if sound is loaded before trying to pause
          sound
            .getStatusAsync()
            .then((status) => {
              if (status.isLoaded && status.isPlaying) {
                return sound.pauseAsync();
              }
            })
            .catch((error) => {
              console.log(
                "Sound cleanup error (expected during navigation):",
                error.message
              );
            });
          setIsPlaying(false);
        }
      };
    }, [sound])
  );

  // Update track index when soundType parameter changes
  useEffect(() => {
    const newIndex = soundType
      ? tracks.findIndex((track) => track.name === soundType)
      : 0;
    const validIndex = newIndex >= 0 ? newIndex : 0;
    console.log(
      "Setting track index from soundType:",
      soundType,
      "to index:",
      validIndex
    );
    setTrackIndex(validIndex);
  }, [soundType]);

  // Test audio file access
  useEffect(() => {
    console.log("Current track:", currentTrack);
    console.log("Audio file path:", currentTrack.audio);
  }, [currentTrack]);

  // Reset completion state when component mounts or track changes
  useEffect(() => {
    setIsCompleted(false);
    setCurrentPosition(0);
    setDuration(0);
    progressWidth.setValue(0);
    loadAudio();
    return () => {
      if (sound) {
        // Check if sound exists and unload safely
        sound
          .getStatusAsync()
          .then((status) => {
            if (status.isLoaded) {
              return sound.unloadAsync();
            }
          })
          .catch((error) => {
            console.log(
              "Sound unload error (expected during cleanup):",
              error.message
            );
          });
      }
    };
  }, [trackIndex]);

  // Update progress
  useEffect(() => {
    let interval = null;
    if (isPlaying && sound) {
      interval = setInterval(async () => {
        try {
          const status = await sound.getStatusAsync();
          if (status.isLoaded) {
            setCurrentPosition(status.positionMillis);
            setDuration(status.durationMillis);

            // Update progress bar
            const progress =
              (status.positionMillis / status.durationMillis) *
              progressBarWidth;
            progressWidth.setValue(progress);

            // Check if completed
            if (status.didJustFinish) {
              handleTrackComplete();
              // Reset to beginning
              sound.setPositionAsync(0);
              setCurrentPosition(0);
              progressWidth.setValue(0);
            }
          }
        } catch (error) {
          console.log(
            "Progress update error (sound may be unloaded):",
            error.message
          );
          // Clear interval if sound is no longer valid
          if (interval) {
            clearInterval(interval);
          }
          setIsPlaying(false);
        }
      }, 100);
    }
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isPlaying, sound]);

  // LP spinning animation effect - continuous smooth spinning
  useEffect(() => {
    // Reset spin value to 0 and start continuous animation
    spinValue.setValue(0);

    const startSpinning = () => {
      spinAnimation.current = Animated.loop(
        Animated.timing(spinValue, {
          toValue: 1,
          duration: 3000, // 3 seconds for one full rotation
          useNativeDriver: true,
        }),
        { iterations: -1 } // Infinite loop
      );
      spinAnimation.current.start();
    };

    startSpinning();

    // Cleanup function
    return () => {
      if (spinAnimation.current) {
        spinAnimation.current.stop();
      }
    };
  }, []);

  // Component unmounting cleanup - ensure audio is properly cleaned up
  useEffect(() => {
    return () => {
      console.log("Component unmounting, cleaning up audio...");
      if (sound) {
        sound
          .getStatusAsync()
          .then((status) => {
            if (status.isLoaded) {
              return sound.unloadAsync();
            }
          })
          .catch((error) => {
            console.log("Final cleanup error (expected):", error.message);
          })
          .finally(() => {
            setSound(null);
            setIsPlaying(false);
          });
      }
    };
  }, []); // Empty dependency array - runs only on unmount

  const loadAudio = async () => {
    try {
      setIsLoading(true);
      console.log("Loading audio for track:", currentTrack.name);
      console.log("Audio file required:", currentTrack.audio);

      // Unload previous sound
      if (sound) {
        console.log("Unloading previous sound...");
        try {
          const status = await sound.getStatusAsync();
          if (status.isLoaded) {
            await sound.unloadAsync();
          }
        } catch (unloadError) {
          console.log(
            "Error unloading previous sound (expected):",
            unloadError.message
          );
        }
        setSound(null);
      }

      // Set audio mode first
      console.log("Setting audio mode...");
      await Audio.setAudioModeAsync({
        playsInSilentModeIOS: true,
      });

      console.log("Audio mode set successfully");
      console.log("Creating audio from file...");

      // Load new sound without auto-play first
      const { sound: newSound, status } = await Audio.Sound.createAsync(
        currentTrack.audio,
        {
          shouldPlay: false,
          isLooping: false,
          volume: 1.0,
        }
      );

      console.log("Sound created with status:", status);
      console.log("NewSound object:", newSound);

      if (newSound && status.isLoaded) {
        // Set the status callback after creation
        newSound.setOnPlaybackStatusUpdate(onPlaybackStatusUpdate);

        setSound(newSound);
        console.log("Sound set in state and is loaded");

        // Try to play immediately since it's loaded
        try {
          console.log("Starting playback...");
          const playResult = await newSound.playAsync();
          console.log("Play result:", playResult);
          setIsPlaying(true);
        } catch (playError) {
          console.error("Error starting playback:", playError);
        }
      } else if (newSound) {
        // If not loaded immediately, wait for it to load
        setSound(newSound);
        newSound.setOnPlaybackStatusUpdate((status) => {
          onPlaybackStatusUpdate(status);
          // Auto-play when loaded
          if (status.isLoaded && !isPlaying) {
            console.log("Sound loaded, auto-playing...");
            newSound
              .playAsync()
              .then(() => {
                setIsPlaying(true);
              })
              .catch(console.error);
          }
        });
        console.log("Sound set in state, waiting for load...");
      }

      setIsLoading(false);
    } catch (error) {
      console.error("Error loading audio:", error);
      console.error("Error stack:", error.stack);
      console.error("Error name:", error.name);
      console.error("Error message:", error.message);
      setIsLoading(false);
    }
  };

  const onPlaybackStatusUpdate = (status) => {
    try {
      console.log("Playback status update:", {
        isLoaded: status.isLoaded,
        isPlaying: status.isPlaying,
        positionMillis: status.positionMillis,
        durationMillis: status.durationMillis,
        error: status.error,
      });

      if (status.isLoaded) {
        setCurrentPosition(status.positionMillis || 0);
        setDuration(status.durationMillis || 0);

        if (status.didJustFinish) {
          console.log("Track finished");
          handleTrackComplete();
          // Reset track position
          setCurrentPosition(0);
        }
      } else if (status.error) {
        console.error("Playback error:", status.error);
      }
    } catch (error) {
      console.error("Error in playback status update:", error);
    }
  };

  const handlePlayPause = async () => {
    if (!sound) {
      console.log("No sound object available");
      return;
    }

    try {
      const status = await sound.getStatusAsync();
      console.log("Current sound status in handlePlayPause:", status);

      if (!status.isLoaded) {
        console.log("Sound is not loaded, cannot play/pause");
        return;
      }

      if (isPlaying) {
        await sound.pauseAsync();
        setIsPlaying(false);
        console.log("Audio paused");
      } else {
        await sound.playAsync();
        setIsPlaying(true);
        console.log("Audio started playing");
      }
    } catch (error) {
      console.log(
        "Error playing/pausing audio (sound may be unloaded):",
        error.message
      );
      // Reset state if sound is no longer valid
      setIsPlaying(false);
    }
  };

  // Removed track switching - each audio task is separate

  const handleSkip = async (seconds) => {
    if (!sound) return;

    try {
      const status = await sound.getStatusAsync();
      if (status.isLoaded) {
        const newPosition = Math.max(
          0,
          Math.min(currentPosition + seconds * 1000, duration)
        );
        await sound.setPositionAsync(newPosition);
        setCurrentPosition(newPosition);
      }
    } catch (error) {
      console.log("Error skipping (sound may be unloaded):", error.message);
    }
  };

  const handleProgressBarPress = async (event) => {
    if (!sound || !duration) return;

    const { locationX } = event.nativeEvent;
    const newPosition = (locationX / progressBarWidth) * duration;

    try {
      await sound.setPositionAsync(newPosition);
      setCurrentPosition(newPosition);
    } catch (error) {
      console.error("Error seeking:", error);
    }
  };

  const handleTrackComplete = () => {
    setIsPlaying(false);
    setIsCompleted(true);
    // Award XP for completing the track
    markExerciseComplete("1", `${currentTrack.name} Session`, 1);
    console.log(`${currentTrack.name} completed! 1 XP awarded.`);
  };

  const formatTime = (millis) => {
    if (!millis) return "0:00";
    const totalSeconds = Math.floor(millis / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const handleBackToHome = () => {
    if (sound) {
      sound.unloadAsync();
    }
    router.push("/(tabs)/mentalHomePage");
  };

  // Show completion page
  if (isCompleted) {
    return (
      <ExercisePage
        title="Congratulations!"
        characterImage={require("../../assets/SollyStates/SollyXPGain.png")}
        bottomText="You've earned 1 XP for completing your relaxation session!"
        buttonLabel="Back to Home"
        onButtonPress={handleBackToHome}
        showBackButton={false}
      />
    );
  }

  return (
    <View style={styles.container}>
      <BackButton />

      <View style={styles.playerContainer}>
        <Text style={styles.heading}>{currentTrack.name}</Text>

        {/* Circular Image */}
        <View style={styles.imageContainer}>
          <Animated.Image
            source={currentTrack.image}
            style={[
              styles.trackImage,
              {
                transform: [
                  {
                    rotate: spinValue.interpolate({
                      inputRange: [0, 1],
                      outputRange: ["0deg", "360deg"],
                    }),
                  },
                ],
              },
            ]}
            resizeMode="cover"
          />
          {/* LP Play icon positioned in top right corner */}
          <View style={styles.lpPlayContainer}>
            <Image
              source={require("../../assets/whiteNoiseAssets/lp-play.png")}
              style={styles.lpPlayIcon}
              resizeMode="contain"
            />
          </View>
        </View>

        {/* Bottom Section with Controls and Progress */}
        <View style={styles.bottomSection}>
          {/* All Controls in One Row */}
          <View style={styles.controlsContainer}>
            <TouchableOpacity
              style={styles.controlButton}
              onPress={() => handleSkip(-10)}
            >
              <Ionicons name="play-back" size={30} color="#7267D9" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.playButton}
              onPress={handlePlayPause}
              disabled={isLoading}
            >
              {isLoading ? (
                <Ionicons name="refresh" size={40} color="#FFFFFF" />
              ) : (
                <Ionicons
                  name={isPlaying ? "pause" : "play"}
                  size={40}
                  color="#FFFFFF"
                />
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.controlButton}
              onPress={() => handleSkip(10)}
            >
              <Ionicons name="play-forward" size={30} color="#7267D9" />
            </TouchableOpacity>
          </View>

          {/* Progress Bar with Time */}
          <View style={styles.progressContainer}>
            <TouchableOpacity
              style={styles.progressBar}
              onPress={handleProgressBarPress}
              onLayout={(event) =>
                setProgressBarWidth(event.nativeEvent.layout.width)
              }
              activeOpacity={0.8}
            >
              <View style={styles.progressBackground} />
              <Animated.View
                style={[styles.progressFill, { width: progressWidth }]}
              />
            </TouchableOpacity>
            <View style={styles.timeContainer}>
              <Text style={styles.currentTime}>
                {formatTime(currentPosition)}
              </Text>
              <Text style={styles.durationText}>{formatTime(duration)}</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingTop: 0,
    paddingHorizontal: 0,
  },
  playerContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 60,
  },
  heading: {
    ...Globals.fonts.styles.header1,
    textAlign: "center",
    color: "#443E82",
    marginTop: 45,
  },
  imageContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 30,
    position: "relative", // Enable absolute positioning for child elements
  },
  trackImage: {
    width: 286,
    height: 286,
    borderRadius: 143,
  },
  lpPlayContainer: {
    position: "absolute",
    top: 0,
    right: -20, // Allow it to extend beyond the LP image boundary
    zIndex: 10,
  },
  lpPlayIcon: {
    width: 161,
    height: 95,
    transform: [{ rotate: "150deg" }],
  },
  bottomSection: {
    alignItems: "center",
    marginTop: 20,
  },
  controlsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: 240,
    marginBottom: 30,
  },
  progressContainer: {
    width: 280,
    alignItems: "center",
    marginBottom: 15,
  },
  progressBar: {
    width: "100%",
    height: 6,
    borderRadius: 3,
    marginBottom: 10,
    position: "relative",
  },
  progressBackground: {
    position: "absolute",
    width: "100%",
    height: "100%",
    backgroundColor: "#F3F2FF",
    borderRadius: 3,
  },
  progressFill: {
    position: "absolute",
    height: "100%",
    backgroundColor: "#7267D9",
    borderRadius: 3,
    minWidth: 2,
  },
  timeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: 5,
  },
  currentTime: {
    ...Globals.fonts.styles.body,
    color: "#666",
    fontSize: 14,
  },
  controlButton: {
    backgroundColor: "#F3F2FF",
    borderRadius: 30,
    width: 60,
    height: 60,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  playButton: {
    backgroundColor: "#7267D9",
    borderRadius: 40,
    width: 80,
    height: 80,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
  durationText: {
    ...Globals.fonts.styles.body,
    color: "#666",
    fontSize: 14,
  },
});
