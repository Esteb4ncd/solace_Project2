import {
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_700Bold,
} from "@expo-google-fonts/poppins";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { Platform } from "react-native";
import "react-native-reanimated";

import { ExerciseProvider } from "@/contexts/ExerciseContext";
import { useColorScheme } from "@/hooks/use-color-scheme";

// Prevent the splash screen from auto-hiding before asset loading is complete.
// Wrap in try-catch to handle potential errors
try {
  SplashScreen.preventAutoHideAsync();
} catch (error) {
  console.warn("SplashScreen.preventAutoHideAsync error:", error);
}

export const unstable_settings = {
  anchor: "(tabs)",
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_700Bold,
  });

  useEffect(() => {
    if (loaded) {
      // Add timeout to ensure splash screen is ready before hiding
      const hideSplashScreen = async () => {
        try {
          await SplashScreen.hideAsync();
        } catch (error) {
          console.warn("Splash screen hide error:", error);
        }
      };

      // Small delay to ensure everything is loaded
      setTimeout(hideSplashScreen, 100);
    }

    // Add web-specific styles
    if (Platform.OS === "web") {
      // Add viewport meta tag for mobile-like behavior
      const viewport = document.querySelector('meta[name="viewport"]');
      if (!viewport) {
        const meta = document.createElement("meta");
        meta.name = "viewport";
        meta.content =
          "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no";
        document.head.appendChild(meta);
      }

      // Add CSS styles
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = "/web-styles.css";
      document.head.appendChild(link);
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ExerciseProvider>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen
            name="modal"
            options={{ presentation: "modal", title: "Modal" }}
          />
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
    </ExerciseProvider>
  );
}
