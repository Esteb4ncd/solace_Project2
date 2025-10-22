import LocalVideoPlayer from '@/components/videoComponents/LocalVideoPlayer';
import { router, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { StyleSheet, View } from 'react-native';

const VideoPlayerScreen = () => {
  const { videoId, type } = useLocalSearchParams<{ videoId: string; type: string }>();

  console.log('VideoPlayerScreen loaded with:', { videoId, type });

  // Use the local HandWarmUp.mp4 file
  const videoSource = require('@/assets/videos/HandWarmUp.mp4');

  const handleBack = () => {
    console.log('Back button pressed');
    router.back();
  };

  const handleVideoEnd = () => {
    console.log('Video ended');
    // You can add logic here for when the video ends
  };

  const handleVideoError = (error: any) => {
    console.log('Video error:', error);
  };

  return (
    <View style={styles.container}>
      <LocalVideoPlayer 
        videoSource={videoSource}
        videoTitle="Hand Warm Up"
        onBack={handleBack}
        onEnd={handleVideoEnd}
        onError={handleVideoError}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
});

export default VideoPlayerScreen;
