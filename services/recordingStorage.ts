// Service to store and save voice recordings and transcriptions to JSON

import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';
import { Platform } from 'react-native';

export interface QuestionRecording {
  question: string;
  transcription: string;
  audioUri: string | null;
  timestamp: string;
}

class RecordingStorage {
  private question1Data: QuestionRecording | null = null;
  private question2Data: QuestionRecording | null = null;

  // Store recording data for question 1
  storeQuestion1(question: string, transcription: string, audioUri: string | null) {
    this.question1Data = {
      question,
      transcription,
      audioUri,
      timestamp: new Date().toISOString(),
    };
  }

  // Store recording data for question 2
  storeQuestion2(question: string, transcription: string, audioUri: string | null) {
    this.question2Data = {
      question,
      transcription,
      audioUri,
      timestamp: new Date().toISOString(),
    };
  }

  // Save question 1 to a JSON file
  async saveQuestion1ToJSON(): Promise<string> {
    console.log('💾 Attempting to save question 1...');
    console.log('📦 Question 1 data:', this.question1Data);
    
    if (!this.question1Data) {
      const error = 'Question 1 must be answered before saving';
      console.error('❌', error);
      throw new Error(error);
    }

    try {
      const jsonString = JSON.stringify(this.question1Data, null, 2);
      const fileName = `question1-recording-${Date.now()}.json`;
      
      console.log('📝 JSON string length:', jsonString.length);
      console.log('📁 File name:', fileName);
      
      return await this.saveJSONFile(jsonString, fileName);
    } catch (error) {
      console.error('❌ Error in saveQuestion1ToJSON:', error);
      throw error;
    }
  }

  // Save question 2 to a JSON file
  async saveQuestion2ToJSON(): Promise<string> {
    console.log('💾 Attempting to save question 2...');
    console.log('📦 Question 2 data:', this.question2Data);
    
    if (!this.question2Data) {
      const error = 'Question 2 must be answered before saving';
      console.error('❌', error);
      throw new Error(error);
    }

    try {
      const jsonString = JSON.stringify(this.question2Data, null, 2);
      const fileName = `question2-recording-${Date.now()}.json`;
      
      console.log('📝 JSON string length:', jsonString.length);
      console.log('📁 File name:', fileName);
      
      return await this.saveJSONFile(jsonString, fileName);
    } catch (error) {
      console.error('❌ Error in saveQuestion2ToJSON:', error);
      throw error;
    }
  }

  // Helper method to save JSON file
  private async saveJSONFile(jsonString: string, fileName: string): Promise<string> {
    console.log('🌐 Platform:', Platform.OS);
    
    if (Platform.OS === 'web') {
      try {
        // For web, create a download link
        console.log('🌍 Saving on web platform...');
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        console.log('✅ Web download successful');
        return `Downloaded ${fileName}`;
      } catch (error) {
        console.error('❌ Web save error:', error);
        throw new Error(`Failed to save on web: ${error}`);
      }
    } else {
      try {
        // For iOS/Android, save to document directory (with cacheDirectory fallback)
        console.log('📱 Saving on mobile platform...');
        
        // Try documentDirectory first, then cacheDirectory as fallback
        let directory = FileSystem.documentDirectory || FileSystem.cacheDirectory;
        console.log('📂 Document directory:', FileSystem.documentDirectory);
        console.log('📂 Cache directory:', FileSystem.cacheDirectory);
        console.log('📂 Using directory:', directory);
        
        if (!directory) {
          // Last resort: use AsyncStorage to store as JSON string
          console.log('⚠️ No file system directory available, using AsyncStorage fallback');
          const storageKey = `recording_${fileName}`;
          await AsyncStorage.setItem(storageKey, jsonString);
          console.log('✅ Saved to AsyncStorage with key:', storageKey);
          return `AsyncStorage:${storageKey}`;
        }
        
        // Ensure directory exists
        const dirInfo = await FileSystem.getInfoAsync(directory);
        if (!dirInfo.exists) {
          console.log('📁 Creating directory...');
          await FileSystem.makeDirectoryAsync(directory, { intermediates: true });
        }
        
        const fileUri = `${directory}${fileName}`;
        console.log('📄 Full file URI:', fileUri);
        
        await FileSystem.writeAsStringAsync(fileUri, jsonString, {
          encoding: FileSystem.EncodingType.UTF8,
        });
        
        console.log('✅ Saved recording to:', fileUri);
        
        // Verify the file was created
        const fileInfo = await FileSystem.getInfoAsync(fileUri);
        console.log('📊 File info:', fileInfo);
        
        if (!fileInfo.exists) {
          throw new Error('File was not created successfully');
        }
        
        return fileUri;
      } catch (error: any) {
        console.error('❌ Mobile save error:', error);
        // Try AsyncStorage as final fallback
        try {
          console.log('🔄 Attempting AsyncStorage fallback...');
          const storageKey = `recording_${fileName}`;
          await AsyncStorage.setItem(storageKey, jsonString);
          console.log('✅ Saved to AsyncStorage with key:', storageKey);
          return `AsyncStorage:${storageKey}`;
        } catch (fallbackError) {
          console.error('❌ AsyncStorage fallback also failed:', fallbackError);
          throw new Error(`Failed to save on mobile: ${error?.message || error}`);
        }
      }
    }
  }

  // Get the stored data (for debugging or display)
  getQuestion1Data(): QuestionRecording | null {
    return this.question1Data;
  }

  getQuestion2Data(): QuestionRecording | null {
    return this.question2Data;
  }

  // Clear stored data
  clear() {
    this.question1Data = null;
    this.question2Data = null;
  }
}

export const recordingStorage = new RecordingStorage();

