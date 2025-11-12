import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import BackButton from "../../components/ui/BackButton";
import { Globals } from "../../constants/globals";

export default function whiteNoise() {
  const router = useRouter();
  const { soundType } = useLocalSearchParams();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);

  const tracks = [
    {
      name: "Rain Sounds",
      duration: "3:24",
      image: require("../../assets/images/Breathing01.png"),
    },
    {
      name: "Plane Sounds",
      duration: "5:12",
      image: require("../../assets/images/Breathing02.png"),
    },
    {
      name: "Ocean Waves",
      duration: "2:48",
      image: require("../../assets/images/Breathing03.png"),
    },
  ];

  // Find current track index based on soundType or default to first track
  const initialIndex = soundType
    ? tracks.findIndex((track) => track.name === soundType)
    : 0;
  const [trackIndex, setTrackIndex] = useState(
    initialIndex >= 0 ? initialIndex : 0
  );

  const currentTrack = tracks[trackIndex];

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handlePrevious = () => {
    setTrackIndex((prevIndex) =>
      prevIndex > 0 ? prevIndex - 1 : tracks.length - 1
    );
  };

  const handleNext = () => {
    setTrackIndex((prevIndex) =>
      prevIndex < tracks.length - 1 ? prevIndex + 1 : 0
    );
  };

  return (
    <View style={styles.container}>
      <BackButton />

      <View style={styles.playerContainer}>
        <Text style={styles.heading}>{currentTrack.name}</Text>

        {/* Circular Image */}
        <View style={styles.imageContainer}>
          <Image
            source={currentTrack.image}
            style={styles.trackImage}
            resizeMode="cover"
          />
        </View>

        {/* Bottom Section with Controls and Progress */}
        <View style={styles.bottomSection}>
          {/* All Controls in One Row */}
          <View style={styles.controlsContainer}>
            <TouchableOpacity
              style={styles.controlButton}
              onPress={handlePrevious}
            >
              <Ionicons name="play-skip-back" size={30} color="#7267D9" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.playButton}
              onPress={handlePlayPause}
            >
              <Ionicons
                name={isPlaying ? "stop" : "play"}
                size={40}
                color="#FFFFFF"
              />
            </TouchableOpacity>

            <TouchableOpacity style={styles.controlButton} onPress={handleNext}>
              <Ionicons name="play-skip-forward" size={30} color="#7267D9" />
            </TouchableOpacity>
          </View>

          {/* Progress Bar with Time */}
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View style={styles.progressFill} />
            </View>
            <View style={styles.timeContainer}>
              <Text style={styles.currentTime}>1:12</Text>
              <Text style={styles.durationText}>{currentTrack.duration}</Text>
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
  },
  trackImage: {
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 4,
    borderColor: "#7267D9",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
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
    backgroundColor: "#F3F2FF",
    borderRadius: 3,
    overflow: "hidden",
    marginBottom: 10,
  },
  progressFill: {
    width: "35%", // This would be dynamic based on current playback position
    height: "100%",
    backgroundColor: "#7267D9",
    borderRadius: 3,
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
