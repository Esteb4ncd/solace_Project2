import { Alert, Platform, StyleSheet, View } from 'react-native';
import { Link } from 'expo-router';
import React from 'react';

import { HelloWave } from '@/components/hello-wave';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import LargeButton from '../../components/ui/LargeButton';

export default function HomeScreen() {
  const handlePress = () => {
    Alert.alert('Button pressed!', 'You clicked the large button.');
  };

  return (
    <ThemedView style={styles.container}>
      <View style={styles.content}>
        <ThemedView style={styles.titleContainer}>
          <ThemedText type="title">Welcome!</ThemedText>
          <HelloWave />
        </ThemedView>

        <LargeButton label="Next" onPress={handlePress} />

        <ThemedView style={styles.stepContainer}>
          <Link href="/homePage">
            <ThemedText type="subtitle">View New Home Page</ThemedText>
          </Link>
        </ThemedView>

        <ThemedView style={styles.stepContainer}>
          <ThemedText type="subtitle">Step 1: Try it</ThemedText>
          <ThemedText>
            Edit <ThemedText type="defaultSemiBold">app/(tabs)/index.tsx</ThemedText> to see changes. Press{' '}
            <ThemedText type="defaultSemiBold">
              {Platform.select({ ios: 'cmd + d', android: 'cmd + m', web: 'F12' })}
            </ThemedText>{' '}
            to open developer tools.
          </ThemedText>
        </ThemedView>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  titleContainer: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: 8,
    marginVertical: 10,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
});
