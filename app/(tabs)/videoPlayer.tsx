import VideoPlayer from '@/components/videoComponents/VideoPlayer';
import { useLocalSearchParams } from 'expo-router';
import React from 'react';
import { View } from 'react-native';

const VideoPlayerScreen = () => {
  const { videoId, type } = useLocalSearchParams<{ videoId: string; type: string }>();

  return (
    <View style={{ flex: 1 }}>
      <VideoPlayer 
        videoId={videoId || "dQw4w9WgXcQ"} // Default video ID if none provided
      />
    </View>
  );
};

export default VideoPlayerScreen;
