import React, { useRef } from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import YoutubePlayer from "react-native-youtube-iframe";

interface VideoPlayerProps {
  videoId: string;
  height?: number;
  play?: boolean;
  style?: any;
  onReady?: () => void;
  onChangeState?: (state: string) => void;
}

export default function VideoPlayer({ 
  videoId, 
  height, 
  play = false, 
  style,
  onReady,
  onChangeState 
}: VideoPlayerProps) {
  const playerRef = useRef(null);
  const screenHeight = Dimensions.get('window').height;
  const screenWidth = Dimensions.get('window').width;

  return (
    <View style={[styles.container, style]}>
      <YoutubePlayer
        ref={playerRef}
        height={height || screenHeight}
        width={screenWidth}
        play={play}
        videoId={videoId}
        onReady={onReady}
        onChangeState={onChangeState}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});