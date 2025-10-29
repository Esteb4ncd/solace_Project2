import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { Link } from "expo-router";
import React, { useEffect } from "react";
import { Alert, Button, Platform, StyleSheet, View } from "react-native";

import { HelloWave } from "@/components/hello-wave";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import LargeButton from "../../components/ui/LargeButton";

// Configure how notifications are handled when received
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export default function HomeScreen() {
  useEffect(() => {
    registerForPushNotificationsAsync();
  }, []);

  const handlePress = () => {
    Alert.alert("Button pressed!", "You clicked the large button.");
  };

  // Schedule a local notification after 10 seconds
  const scheduleNotification = async () => {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "⏰ HELP!",
        body: "Hi, this is Solly! Your Solly is dying right now!",
        sound: true,
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds: 3,
      },
    });

    Alert.alert("Scheduled!", "You'll get a notification in 3 seconds.");
  };

  // Request permission for notifications
  const registerForPushNotificationsAsync = async () => {
    if (!Device.isDevice) {
      Alert.alert("Must use a physical device for notifications");
      return;
    }

    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== "granted") {
      Alert.alert("Permission not granted for notifications!");
      return;
    }

    if (Platform.OS === "android") {
      await Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
      });
    }
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
          <ThemedText style={{ marginBottom: 10, fontSize: 16 }}>
            Tap below to test a local notification.
          </ThemedText>
          <Button
            title="🔔 Get notification 🔔"
            onPress={scheduleNotification}
          />
        </ThemedView>

        <ThemedView style={styles.stepContainer}>
          <Link href="/homePage">
            <ThemedText type="subtitle">View New Home Page</ThemedText>
          </Link>
        </ThemedView>

        <ThemedView style={styles.stepContainer}>
          <ThemedText type="subtitle">Step 1: Try it</ThemedText>
          <ThemedText>
            Edit{" "}
            <ThemedText type="defaultSemiBold">app/(tabs)/index.tsx</ThemedText>{" "}
            to see changes. Press{" "}
            <ThemedText type="defaultSemiBold">
              {Platform.select({
                ios: "cmd + d",
                android: "cmd + m",
                web: "F12",
              })}
            </ThemedText>{" "}
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
    backgroundColor: "#fff",
    width: 393,
    height: 852,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  titleContainer: {
    flexDirection: "column",
    alignItems: "flex-start",
    gap: 8,
    marginVertical: 10,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
});
