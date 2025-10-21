import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';
import { View } from 'react-native';

import PagesMenu from '@/components/PagesMenu';
import { HapticTab } from '@/components/haptic-tab';

import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';


export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <View style={{ flex: 1 }}>
      <PagesMenu />
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
          headerShown: false,
          tabBarButton: HapticTab,
          tabBarStyle: { display: 'none' }, // Hide the bottom tab bar
        }}>
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
            tabBarIcon: ({ color }) => <Ionicons name="home" size={24} color={color} />,
          }}
        />
        <Tabs.Screen
          name="startQuestions"
          options={{
            title: 'Start Questions',
            tabBarIcon: ({ color }) => <Ionicons name="person" size={24} color={color} />,
          }}
        />
        <Tabs.Screen
          name="onboardingQuestions"
          options={{
            title: 'Questions',
            tabBarIcon: ({ color }) => <Ionicons name="help-circle" size={24} color={color} />,
          }}
        />
        <Tabs.Screen
          name="ai_onboarding"
          options={{
            title: 'AI Onboarding',
            tabBarIcon: ({ color }) => <Ionicons name="chatbubbles" size={24} color={color} />,
          }}
        />
        <Tabs.Screen
          name="homePage"
          options={{
            title: 'Home Page',
            tabBarIcon: ({ color }) => <Ionicons name="home" size={24} color={color} />,
          }}
        />
        <Tabs.Screen
          name="confirmation"
          options={{
            title: 'Confirmation',
            tabBarIcon: ({ color }) => <Ionicons name="checkmark-circle" size={24} color={color} />,
          }}
        />
        <Tabs.Screen
          name="tutorial"
          options={{
            title: 'Tutorial',
            tabBarIcon: ({ color }) => <Ionicons name="school" size={24} color={color} />,
          }}
        />
        <Tabs.Screen
          name="signInPage"
          options={{
            title: 'Sign In',
            tabBarIcon: ({ color }) => <Ionicons name="log-in" size={24} color={color} />,
          }}
        />
      </Tabs>
    </View>
  );
}
