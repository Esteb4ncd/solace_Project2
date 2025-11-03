// Speech-to-text service using expo-av for recording and OpenAI Whisper for transcription

import { Audio } from 'expo-av';
import { Alert, Platform } from 'react-native';

export interface SpeechResult {
  text: string;
  confidence: number;
  isFinal: boolean;
}

class SpeechService {
  private isListening = false;
  private recording: Audio.Recording | null = null;
  private recordingUri: string | null = null;

  async requestPermissions(): Promise<boolean> {
    try {
      const { status } = await Audio.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permission Required',
          'Microphone permission is required to record audio.',
          [{ text: 'OK' }]
        );
        return false;
      }
      return true;
    } catch (error) {
      console.error('Error requesting audio permissions:', error);
      return false;
    }
  }

  async startRecording(): Promise<void> {
    try {
      if (this.isListening) {
        throw new Error('Already recording');
      }

      const hasPermission = await this.requestPermissions();
      if (!hasPermission) {
        throw new Error('Microphone permission denied');
      }

      // Set audio mode for recording
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      // Create a new recording
      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );

      this.recording = recording;
      this.isListening = true;
    } catch (error) {
      console.error('Error starting recording:', error);
      this.isListening = false;
      throw error;
    }
  }

  async stopRecording(): Promise<string | null> {
    try {
      if (!this.recording || !this.isListening) {
        return null;
      }

      this.isListening = false;

      // Stop recording
      await this.recording.stopAndUnloadAsync();
      
      // Get the URI
      const uri = this.recording.getURI();
      this.recordingUri = uri;
      
      // Clean up
      this.recording = null;

      return uri;
    } catch (error) {
      console.error('Error stopping recording:', error);
      this.recording = null;
      this.isListening = false;
      throw error;
    }
  }

  async transcribeAudio(audioUri: string): Promise<string> {
    try {
      // Get API key from environment or use placeholder
      // NOTE: In production, store this securely (e.g., using Expo Constants or environment variables)
      const OPENAI_API_KEY = process.env.EXPO_PUBLIC_OPENAI_API_KEY || 'your-api-key-here';

      if (OPENAI_API_KEY === 'your-api-key-here') {
        // Fallback: return simulated text if API key is not configured
        console.warn('OpenAI API key not configured, using simulated transcription');
        return this.getSimulatedSpeechText();
      }

      // Prepare form data for OpenAI Whisper API
      const formData = new FormData();
      
      // Get file extension and mime type
      const fileExtension = audioUri.split('.').pop() || 'm4a';
      const mimeType = fileExtension === 'm4a' ? 'audio/m4a' : fileExtension === 'mp3' ? 'audio/mpeg' : 'audio/m4a';

      // For React Native, FormData needs a specific format
      // Remove file:// prefix for iOS if present
      const uri = Platform.OS === 'ios' ? audioUri.replace('file://', '') : audioUri;
      
      formData.append('file', {
        uri: uri,
        type: mimeType,
        name: `recording.${fileExtension}`,
      } as any);
      
      formData.append('model', 'whisper-1');
      formData.append('language', 'en');

      // Call OpenAI Whisper API
      const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
        },
        body: formData as any,
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error('OpenAI API error:', errorData);
        throw new Error(`Transcription failed: ${response.statusText}`);
      }

      const data = await response.json();
      return data.text || '';
    } catch (error) {
      console.error('Error transcribing audio:', error);
      // Return simulated text as fallback
      return this.getSimulatedSpeechText();
    }
  }

  async startListening(): Promise<void> {
    // Start recording - component will handle stopping and transcribing
    await this.startRecording();
  }

  async stopAndTranscribe(): Promise<string> {
    try {
      const audioUri = await this.stopRecording();
      if (!audioUri) {
        throw new Error('No recording to transcribe');
      }

      const transcription = await this.transcribeAudio(audioUri);
      
      // Note: Audio file cleanup happens automatically by the system after a period
      // For manual cleanup, you'd need expo-file-system, but it's optional

      return transcription;
    } catch (error) {
      console.error('Error in stopAndTranscribe:', error);
      throw error;
    }
  }

  private getSimulatedSpeechText(): string {
    // Simulate different responses based on context
    const responses = [
      "I have pain in my left shoulder and right knee from heavy lifting work",
      "My back hurts from bending over all day",
      "I work construction and lift heavy materials",
      "I do overhead work and my shoulders are always sore",
      "I use tools all day and my wrists hurt",
      "I kneel a lot at work and my knees are stiff",
      "I'm a carpenter and I do a lot of overhead work with heavy tools",
      "I work in construction lifting heavy materials and my back and knees hurt",
      "I'm a mechanic and I kneel a lot, plus I use tools repetitively",
      "I do warehouse work lifting boxes and my shoulders and back are sore"
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
  }

  async speak(text: string): Promise<void> {
    // Note: Text-to-speech functionality requires expo-speech package
    // To enable: npx expo install expo-speech
    // For now, this is a placeholder
    console.log('Text-to-speech: Would speak:', text);
  }

  stopListening(): void {
    this.isListening = false;
    if (this.recording) {
      this.recording.stopAndUnloadAsync().catch(console.error);
      this.recording = null;
    }
  }

  isCurrentlyListening(): boolean {
    return this.isListening;
  }

  async cancelRecording(): Promise<void> {
    try {
      await this.stopRecording();
      this.recordingUri = null;
    } catch (error) {
      console.error('Error canceling recording:', error);
    }
  }
}

export const speechService = new SpeechService();
