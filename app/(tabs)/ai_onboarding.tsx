import { router } from 'expo-router';
import { useEffect } from 'react';

export default function AIOnboardingScreen() {
  useEffect(() => {
    // Redirect to startAiOnboarding
    router.replace('/(tabs)/startAiOnboarding');
  }, []);

  return null;
}

