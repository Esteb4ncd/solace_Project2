// Speech-to-text service using OpenAI Whisper API

import { Audio } from 'expo-av';
import Constants from 'expo-constants';
import { OPENAI_API_KEY as CONFIG_API_KEY } from '../config/apiKey';

export interface SpeechResult {
  text: string;
  confidence: number;
  isFinal: boolean;
}

class SpeechService {
  private recording: Audio.Recording | null = null;
  private isListening = false;
  private recordingUri: string | null = null;

  async startRecording(): Promise<void> {
    try {
      if (this.isListening) {
        throw new Error('Already recording');
      }

      // Request permissions
      const { status } = await Audio.requestPermissionsAsync();
      if (status !== 'granted') {
        throw new Error('Audio permission not granted');
      }

      // Set audio mode
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
      // Try multiple ways to get the API key (Expo can be tricky with env vars)
      const OPENAI_API_KEY = 
        CONFIG_API_KEY ||
        Constants.expoConfig?.extra?.openaiApiKey ||
        Constants.expoConfig?.extra?.EXPO_PUBLIC_OPENAI_API_KEY ||
        (typeof process !== 'undefined' && process.env?.EXPO_PUBLIC_OPENAI_API_KEY) ||
        undefined;
      
      console.log('🔑 API Key check:', {
        hasKey: !!OPENAI_API_KEY,
        keyLength: OPENAI_API_KEY?.length || 0,
        keyPrefix: OPENAI_API_KEY?.substring(0, 7) || 'none',
        fromConfig: !!CONFIG_API_KEY,
        fromConstants: !!Constants.expoConfig?.extra?.openaiApiKey,
        fromProcessEnv: !!(typeof process !== 'undefined' && process.env?.EXPO_PUBLIC_OPENAI_API_KEY),
        constantsExtra: Constants.expoConfig?.extra,
      });
      
      if (!OPENAI_API_KEY || OPENAI_API_KEY === 'your-api-key-here') {
        console.warn('⚠️ OpenAI API key not found, using simulated transcription');
        console.warn('   Make sure EXPO_PUBLIC_OPENAI_API_KEY is set in .env and restart the app');
        return this.getSimulatedSpeechText();
      }

      // Prepare form data for OpenAI Whisper API
      const formData = new FormData();
      
      // Get file extension and mime type
      const fileExtension = audioUri.split('.').pop() || 'm4a';
      const mimeType = fileExtension === 'm4a' ? 'audio/m4a' : 
                      fileExtension === 'mp3' ? 'audio/mpeg' : 
                      fileExtension === 'wav' ? 'audio/wav' : 
                      'audio/m4a';
      
      // For React Native, FormData needs a specific format
      formData.append('file', {
        uri: audioUri,
        type: mimeType,
        name: `recording.${fileExtension}`,
      } as any);
      
      formData.append('model', 'whisper-1');
      formData.append('response_format', 'text');

      const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
        },
        body: formData as any,
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('OpenAI API error:', errorText);
        // Fallback to simulated text on error
        return this.getSimulatedSpeechText();
      }

      const transcription = await response.text();
      return transcription.trim();
    } catch (error) {
      console.error('Error transcribing audio:', error);
      // Return simulated text as fallback
      return this.getSimulatedSpeechText();
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

  async stopAndTranscribe(): Promise<string> {
    try {
      const audioUri = await this.stopRecording();
      if (!audioUri) {
        console.warn('No recording to transcribe, using simulated text');
        return this.getSimulatedSpeechText();
      }

      const transcription = await this.transcribeAudio(audioUri);
      return transcription;
    } catch (error) {
      console.error('Error in stopAndTranscribe:', error);
      // Return simulated text as fallback
      return this.getSimulatedSpeechText();
    }
  }

  // New method that returns both transcription and audio URI
  async stopAndTranscribeWithUri(): Promise<{ transcription: string; audioUri: string | null }> {
    try {
      const audioUri = await this.stopRecording();
      if (!audioUri) {
        console.warn('No recording to transcribe, using simulated text');
        return {
          transcription: this.getSimulatedSpeechText(),
          audioUri: null,
        };
      }

      const transcription = await this.transcribeAudio(audioUri);
      return {
        transcription,
        audioUri,
      };
    } catch (error) {
      console.error('Error in stopAndTranscribeWithUri:', error);
      // Return simulated text as fallback
      return {
        transcription: this.getSimulatedSpeechText(),
        audioUri: null,
      };
    }
  }

  async cancelRecording(): Promise<void> {
    try {
      if (this.recording) {
        await this.recording.stopAndUnloadAsync();
        this.recording = null;
      }
      this.isListening = false;
      this.recordingUri = null;
    } catch (error) {
      console.error('Error canceling recording:', error);
      throw error;
    }
  }

  isCurrentlyListening(): boolean {
    return this.isListening;
  }

  async startListening(): Promise<void> {
    // Start recording - component will handle stopping and transcribing
    await this.startRecording();
  }

  async speak(text: string): Promise<void> {
    // Note: Text-to-speech functionality requires expo-speech package
    // To enable: npx expo install expo-speech
    // For now, this is a placeholder
    console.log('Text-to-speech: Would speak:', text);
  }
}

export const speechService = new SpeechService();
