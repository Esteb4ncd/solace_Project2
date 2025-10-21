// Speech-to-text service using Expo Speech

import * as Speech from 'expo-speech';
import { Alert } from 'react-native';

export interface SpeechResult {
  text: string;
  confidence: number;
  isFinal: boolean;
}

class SpeechService {
  private isListening = false;
  private recognitionTimeout: NodeJS.Timeout | null = null;

  async startListening(): Promise<string> {
    return new Promise((resolve, reject) => {
      if (this.isListening) {
        reject(new Error('Already listening'));
        return;
      }

      this.isListening = true;
      
      // Simulate speech recognition
      // In a real implementation, you would use:
      // - Expo Speech Recognition (if available)
      // - Web Speech API for web
      // - Native speech recognition libraries
      
      Alert.alert(
        'Voice Input',
        'Speak now...',
        [
          {
            text: 'Cancel',
            onPress: () => {
              this.isListening = false;
              reject(new Error('User cancelled'));
            }
          },
          {
            text: 'Done',
            onPress: () => {
              this.isListening = false;
              // Simulate recognized text
              const simulatedText = this.getSimulatedSpeechText();
              resolve(simulatedText);
            }
          }
        ],
        { cancelable: false }
      );

      // Auto-timeout after 10 seconds
      this.recognitionTimeout = setTimeout(() => {
        this.isListening = false;
        reject(new Error('Speech recognition timeout'));
      }, 10000);
    });
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
    try {
      await Speech.speak(text, {
        language: 'en-US',
        pitch: 1.0,
        rate: 0.8,
      });
    } catch (error) {
      console.error('Error speaking text:', error);
      throw error;
    }
  }

  stopListening(): void {
    this.isListening = false;
    if (this.recognitionTimeout) {
      clearTimeout(this.recognitionTimeout);
      this.recognitionTimeout = null;
    }
  }

  isCurrentlyListening(): boolean {
    return this.isListening;
  }
}

export const speechService = new SpeechService();
