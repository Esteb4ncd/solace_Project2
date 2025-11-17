// Service to store and retrieve username from AsyncStorage

import AsyncStorage from '@react-native-async-storage/async-storage';

const USERNAME_KEY = 'user_username';

export const saveUsername = async (username: string): Promise<void> => {
  try {
    await AsyncStorage.setItem(USERNAME_KEY, username);
    console.log('✅ Username saved:', username);
  } catch (error) {
    console.error('❌ Error saving username:', error);
    throw error;
  }
};

export const getUsername = async (): Promise<string | null> => {
  try {
    const username = await AsyncStorage.getItem(USERNAME_KEY);
    return username;
  } catch (error) {
    console.error('❌ Error retrieving username:', error);
    return null;
  }
};

export const clearUsername = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(USERNAME_KEY);
    console.log('✅ Username cleared');
  } catch (error) {
    console.error('❌ Error clearing username:', error);
    throw error;
  }
};

