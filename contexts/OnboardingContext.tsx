import React, { createContext, ReactNode, useContext, useState } from 'react';
import { AIResponse, ChatMessage } from '../services/aiService';

interface OnboardingContextType {
  conversationHistory: ChatMessage[];
  currentAIResponse: AIResponse | null;
  isLoading: boolean;
  error: string | null;
  isListening: boolean;
  addMessage: (message: ChatMessage) => void;
  setCurrentAIResponse: (response: AIResponse | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setIsListening: (listening: boolean) => void;
  resetConversation: () => void;
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

export const useOnboarding = () => {
  const context = useContext(OnboardingContext);
  if (!context) {
    throw new Error('useOnboarding must be used within an OnboardingProvider');
  }
  return context;
};

interface OnboardingProviderProps {
  children: ReactNode;
}

export const OnboardingProvider: React.FC<OnboardingProviderProps> = ({ children }) => {
  const [conversationHistory, setConversationHistory] = useState<ChatMessage[]>([]);
  const [currentAIResponse, setCurrentAIResponse] = useState<AIResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isListening, setIsListening] = useState(false);

  const addMessage = (message: ChatMessage) => {
    setConversationHistory(prev => [...prev, message]);
  };

  const setLoading = (loading: boolean) => {
    setIsLoading(loading);
  };

  const resetConversation = () => {
    setConversationHistory([]);
    setCurrentAIResponse(null);
    setIsLoading(false);
    setError(null);
    setIsListening(false);
  };

  const value: OnboardingContextType = {
    conversationHistory,
    currentAIResponse,
    isLoading,
    error,
    isListening,
    addMessage,
    setCurrentAIResponse,
    setLoading,
    setError,
    setIsListening,
    resetConversation,
  };

  return (
    <OnboardingContext.Provider value={value}>
      {children}
    </OnboardingContext.Provider>
  );
};
