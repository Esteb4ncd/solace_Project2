import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { router } from 'expo-router';
import React from 'react';
import { StyleSheet } from 'react-native';
import { Globals } from '../../constants/globals';

export default function HomePageScreen() {
  const handleBackPress = () => {
    router.back();
  };

  return (
    <ThemedView style={styles.container}>
      {/* Back Button */}


      {/* Main Content */}
      
        <ThemedText style={styles.title}>
          This would be the homepage
        </ThemedText>
      
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 10,
    padding: 8,
  },
  contentContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,

  },
  title: {
    ...Globals.fonts.styles.caption,
    textAlign: 'center',
  },
});
