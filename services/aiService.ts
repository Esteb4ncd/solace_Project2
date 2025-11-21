// Real AI service for handling conversations and voice processing

import { getSecondaryExercises, RecommendedExercise, recommendExercises } from '@/constants/exercises';
import Constants from 'expo-constants';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  isVoice?: boolean;
}

export interface AIResponse {
  message: string;
  recommendations?: {
    targetAreas: string[];
    exerciseTypes: string[];
    description: string;
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    recommendedExercises?: RecommendedExercise[]; // AI-assigned exercises (10 XP)
    allExercises?: RecommendedExercise[]; // All exercises with assignment status (10 XP if recommended, 5 XP if secondary)
  };
  nextAction?: 'continue' | 'confirm' | 'complete';
}

class AIService {
  private conversationHistory: ChatMessage[] = [];
  private currentContext: {
    painAreas: string[];
    workTasks: string[];
    userPreferences: string[];
  } = {
    painAreas: [],
    workTasks: [],
    userPreferences: []
  };

  // Get OpenAI API key from environment
  private getOpenAIApiKey(): string | undefined {
    return (
      Constants.expoConfig?.extra?.openaiApiKey ||
      Constants.expoConfig?.extra?.EXPO_PUBLIC_OPENAI_API_KEY ||
      (typeof process !== 'undefined' && process.env?.EXPO_PUBLIC_OPENAI_API_KEY) ||
      undefined
    );
  }

  // Call OpenAI API for chat completion
  async sendMessage(userMessage: string, isVoice: boolean = false): Promise<AIResponse> {
    try {
      // Add user message to conversation
      const userChatMessage: ChatMessage = {
        id: Date.now().toString(),
        role: 'user',
        content: userMessage,
        timestamp: new Date(),
        isVoice
      };
      
      this.conversationHistory.push(userChatMessage);
      
      // Process the message and extract information
      this.extractContextFromMessage(userMessage);
      
      // Get API key
      const apiKey = this.getOpenAIApiKey();
      
      console.log('🔑 AI Service API Key check:', {
        hasKey: !!apiKey,
        keyLength: apiKey?.length || 0,
        keyPrefix: apiKey?.substring(0, 7) || 'none',
        fromConstants: !!Constants.expoConfig?.extra?.openaiApiKey,
        fromProcessEnv: !!(typeof process !== 'undefined' && process.env?.EXPO_PUBLIC_OPENAI_API_KEY),
      });
      
      if (!apiKey || apiKey === 'your-api-key-here') {
        console.warn('⚠️ OpenAI API key not found, using simulated AI response');
        console.warn('   Make sure EXPO_PUBLIC_OPENAI_API_KEY is set in .env and restart the app');
        // Fallback to simulated response
        const aiResponse = await this.generateSimulatedAIResponse(userMessage);
        this.addAIResponseToHistory(aiResponse.message);
        return aiResponse;
      }
      
      console.log('✅ Using OpenAI API for AI responses');

      // Call OpenAI API
      try {
        const aiResponse = await this.callOpenAIAPI(userMessage);
        this.addAIResponseToHistory(aiResponse.message);
        console.log('✅ AI Response generated:', {
          messageLength: aiResponse.message.length,
          hasRecommendations: !!aiResponse.recommendations,
          nextAction: aiResponse.nextAction
        });
        return aiResponse;
      } catch (apiError: any) {
        console.error('❌ OpenAI API error:', apiError);
        // Fallback to simulated response if API fails
        console.warn('⚠️ Falling back to simulated AI response');
        const aiResponse = await this.generateSimulatedAIResponse(userMessage);
        this.addAIResponseToHistory(aiResponse.message);
        console.log('✅ Simulated AI Response generated:', {
          messageLength: aiResponse.message.length,
          hasRecommendations: !!aiResponse.recommendations,
          nextAction: aiResponse.nextAction
        });
        return aiResponse;
      }
    } catch (error) {
      console.error('Error in AI service:', error);
      // Fallback to simulated response
      const aiResponse = await this.generateSimulatedAIResponse(userMessage);
      this.addAIResponseToHistory(aiResponse.message);
      return aiResponse;
    }
  }

  private addAIResponseToHistory(message: string): void {
    const aiChatMessage: ChatMessage = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: message,
      timestamp: new Date()
    };
    this.conversationHistory.push(aiChatMessage);
  }

  private async callOpenAIAPI(userMessage: string): Promise<AIResponse> {
    const apiKey = this.getOpenAIApiKey();
    if (!apiKey) {
      throw new Error('API key not available');
    }

    // Prepare conversation history for OpenAI (last 10 messages to stay within token limits)
    const recentHistory = this.conversationHistory.slice(-10).map(msg => ({
      role: msg.role,
      content: msg.content
    }));

    // Create system prompt for the AI
    const systemPrompt = `You are Solly, a helpful AI assistant helping users set up their personalized exercise plan. 
You ask about their work tasks and pain areas, then provide personalized exercise recommendations.
Be friendly, concise, and conversational. Extract information about:
- Work tasks: heavy lifting, overhead work, repetitive tool use, kneeling
- Pain areas: shoulder, knee, back, neck, wrist

After gathering enough information, provide exercise recommendations.`;

    const messages = [
      { role: 'system', content: systemPrompt },
      ...recentHistory
    ];

    console.log('📤 Calling OpenAI API...');
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini', // Using cost-effective model
        messages: messages,
        temperature: 0.7,
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ OpenAI API error:', response.status, errorText);
      throw new Error(`OpenAI API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    const aiMessage = data.choices[0]?.message?.content || 'I apologize, but I had trouble processing that. Could you try again?';
    console.log('✅ OpenAI API response received:', aiMessage.substring(0, 100) + '...');

    // Check if we have enough information to generate recommendations
    if (this.currentContext.workTasks.length > 0 && this.currentContext.painAreas.length > 0) {
      const recommendations = this.generateRecommendations();
      return {
        message: aiMessage,
        recommendations,
        nextAction: 'confirm'
      };
    }

    return {
      message: aiMessage,
      nextAction: 'continue'
    };
  }

  private async generateSimulatedAIResponse(userMessage: string): Promise<AIResponse> {
    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    return this.generateAIResponse(userMessage);
  }

  private extractContextFromMessage(message: string): void {
    const lowerMessage = message.toLowerCase();
    
    // Extract pain areas with more comprehensive keyword matching
    const painKeywords = {
      'shoulder': ['shoulder', 'shoulders', 'arm', 'arms', 'upper body', 'upper arm', 'deltoid', 'rotator'],
      'knee': ['knee', 'knees', 'leg', 'legs', 'lower body', 'patella', 'knee cap'],
      'back': ['back', 'spine', 'lower back', 'upper back', 'lumbar', 'spine', 'spinal'],
      'neck': ['neck', 'cervical', 'cervical spine', 'neck pain'],
      'wrist': ['wrist', 'wrists', 'hand', 'hands', 'forearm', 'forearms', 'carpal']
    };
    
    Object.entries(painKeywords).forEach(([area, keywords]) => {
      if (keywords.some(keyword => lowerMessage.includes(keyword))) {
        if (!this.currentContext.painAreas.includes(area)) {
          this.currentContext.painAreas.push(area);
          console.log(`✅ Extracted pain area: ${area}`);
        }
      }
    });
    
    // Extract work tasks with more comprehensive keyword matching
    const workKeywords = {
      'heavy lifting': ['lift', 'lifting', 'heavy', 'weight', 'weights', 'carry', 'carrying', 'load', 'loading', 'move', 'moving objects'],
      'overhead work': ['overhead', 'above', 'reach up', 'reaching up', 'upward', 'above head', 'ceiling', 'high'],
      'repetitive tool use': ['tool', 'tools', 'repetitive', 'hammer', 'hammers', 'drill', 'drills', 'screwdriver', 'wrench', 'repetitive motion', 'repeating'],
      'kneeling': ['kneel', 'kneeling', 'knee', 'crouch', 'crouching', 'squat', 'squatting', 'on knees', 'down on']
    };
    
    Object.entries(workKeywords).forEach(([task, keywords]) => {
      if (keywords.some(keyword => lowerMessage.includes(keyword))) {
        if (!this.currentContext.workTasks.includes(task)) {
          this.currentContext.workTasks.push(task);
          console.log(`✅ Extracted work task: ${task}`);
        }
      }
    });
    
    // Log current context for debugging
    console.log('📊 Current AI Context:', {
      painAreas: this.currentContext.painAreas,
      workTasks: this.currentContext.workTasks,
      conversationLength: this.conversationHistory.length
    });
  }

  private generateAIResponse(userMessage: string): AIResponse {
    const lowerMessage = userMessage.toLowerCase();
    
    // Determine response based on conversation stage
    if (this.conversationHistory.length <= 2) {
      // First interaction - provide summary of what was picked up
      const summary = this.generateSummary();
      return {
        message: `Thanks for sharing! Here's what I picked up from what you said: ${summary}. Is this correct?`,
        nextAction: 'continue'
      };
    } else if (this.currentContext.workTasks.length > 0 && this.currentContext.painAreas.length > 0) {
      // We have enough information - generate recommendations
      const recommendations = this.generateRecommendations();
      const summary = this.generateSummary();
      return {
        message: `Perfect! Based on what you told me: ${summary}, I've created a personalized exercise plan for you.`,
        recommendations,
        nextAction: 'confirm'
      };
    } else {
      // Need more information
      const summary = this.generateSummary();
      if (this.currentContext.painAreas.length === 0) {
        return {
          message: `I picked up: ${summary}. I'd like to understand where you feel discomfort. Can you describe the areas where you experience pain or stiffness?`,
          nextAction: 'continue'
        };
      } else {
        return {
          message: `I picked up: ${summary}. Can you tell me more about your work activities? This helps me understand what might be causing the discomfort.`,
          nextAction: 'continue'
        };
      }
    }
  }

  private generateSummary(): string {
    const painSummary = this.currentContext.painAreas.length > 0 
      ? `you have pain in your ${this.currentContext.painAreas.join(' and ')}` 
      : 'you experience some discomfort';
    
    const workSummary = this.currentContext.workTasks.length > 0 
      ? ` and you work with ${this.currentContext.workTasks.join(' and ')}` 
      : '';
    
    return `${painSummary}${workSummary}`;
  }

  private generateRecommendations() {
    // Use the exercise database to find matching exercises (AI-assigned, worth 10 XP)
    const recommendedExercises = recommendExercises(
      this.currentContext.painAreas,
      this.currentContext.workTasks,
      [], // Additional keywords can be extracted from conversation
      5 // Get top 5 recommendations
    );
    
    // Get IDs of recommended exercises
    const recommendedIds = recommendedExercises.map(ex => ex.exercise.id);
    
    // Get all other exercises as secondary (worth 5 XP)
    const secondaryExercises = getSecondaryExercises(recommendedIds);
    
    // Combine recommended and secondary exercises (all videos will show)
    const allExercises = [...recommendedExercises, ...secondaryExercises];
    
    // Extract unique exercise types from recommended exercises
    const exerciseTypes = [...new Set(
      recommendedExercises.flatMap(ex => ex.exercise.exerciseTypes)
    )];
    
    // Determine overall difficulty (use most common difficulty from recommendations)
    const difficulties = recommendedExercises.map(ex => ex.exercise.difficulty);
    const difficulty = difficulties.length > 0 
      ? (difficulties.filter(d => d === 'intermediate').length >= difficulties.length / 2 
          ? 'intermediate' 
          : difficulties[0] || 'beginner')
      : 'beginner';
    
    return {
      targetAreas: this.currentContext.painAreas,
      exerciseTypes,
      description: `Your exercises will target your ${this.currentContext.painAreas.join(' and ')}.\n\nYour exercises will help you with ${this.currentContext.workTasks.join(' and ')}.`,
      difficulty: difficulty as 'beginner' | 'intermediate' | 'advanced',
      recommendedExercises, // AI-assigned exercises (10 XP)
      allExercises // All exercises with assignment status (for displaying all videos)
    };
  }

  getConversationHistory(): ChatMessage[] {
    return this.conversationHistory;
  }

  getCurrentContext() {
    return this.currentContext;
  }

  resetConversation(): void {
    this.conversationHistory = [];
    this.currentContext = {
      painAreas: [],
      workTasks: [],
      userPreferences: []
    };
  }

  // Generate personalized speech bubble message
  async generateSpeechBubbleMessage(context: {
    completedExercises: number;
    dailyCompleted: number;
    totalDaily: number;
    streakDays: number;
    hasStreak: boolean;
    painAreas?: string[];
    workTasks?: string[];
  }): Promise<string> {
    try {
      const apiKey = this.getOpenAIApiKey();
      
      // Build context string for AI
      const contextParts: string[] = [];
      
      if (context.painAreas && context.painAreas.length > 0) {
        contextParts.push(`The user experiences pain in their ${context.painAreas.join(' and ')}.`);
      }
      
      if (context.workTasks && context.workTasks.length > 0) {
        contextParts.push(`Their work involves ${context.workTasks.join(' and ')}.`);
      }
      
      if (context.dailyCompleted === context.totalDaily && context.totalDaily > 0) {
        contextParts.push(`They've completed all ${context.totalDaily} daily exercises today.`);
      } else if (context.dailyCompleted > 0) {
        const remaining = context.totalDaily - context.dailyCompleted;
        contextParts.push(`They've completed ${context.dailyCompleted} of ${context.totalDaily} daily exercises, with ${remaining} remaining.`);
      } else {
        contextParts.push(`They haven't started their daily exercises yet.`);
      }
      
      if (context.hasStreak && context.streakDays > 0) {
        contextParts.push(`They have a ${context.streakDays} day streak going.`);
      }
      
      if (context.completedExercises > 0) {
        contextParts.push(`They've completed ${context.completedExercises} exercise(s) total.`);
      }

      const systemPrompt = `You are Solly, a friendly and encouraging AI assistant. Generate a SHORT, PERSONALIZED message (max 15 words) for a speech bubble that:
- Shows you know about the user's work life and pain points
- Is encouraging and motivational
- References their specific situation naturally
- Is conversational and friendly
- Uses emojis sparingly (1-2 max)
- Never mentions "I" or "you" directly - be more subtle

Context: ${contextParts.join(' ')}

Generate ONLY the message text, nothing else.`;

      if (!apiKey || apiKey === 'your-api-key-here') {
        // Fallback to rule-based message
        return this.generateFallbackSpeechMessage(context);
      }

      const messages = [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: 'Generate a personalized speech bubble message based on the context.' }
      ];

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: messages,
          temperature: 0.9, // Higher temperature for more variety
          max_tokens: 50, // Short messages only
        }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      const message = data.choices[0]?.message?.content?.trim() || this.generateFallbackSpeechMessage(context);
      
      // Ensure message is short (truncate if needed)
      const maxLength = 80;
      return message.length > maxLength ? message.substring(0, maxLength) + '...' : message;
    } catch (error) {
      console.error('Error generating AI speech bubble message:', error);
      return this.generateFallbackSpeechMessage(context);
    }
  }

  private generateFallbackSpeechMessage(context: {
    completedExercises: number;
    dailyCompleted: number;
    totalDaily: number;
    streakDays: number;
    hasStreak: boolean;
    painAreas?: string[];
    workTasks?: string[];
  }): string {
    const messages: string[] = [];
    
    // Work/pain context messages
    if (context.workTasks && context.workTasks.length > 0) {
      if (context.workTasks.includes('heavy lifting')) {
        messages.push('Those heavy lifts can be tough on your back 💪');
      }
      if (context.workTasks.includes('overhead work')) {
        messages.push('Overhead work can strain those shoulders 🏗️');
      }
      if (context.workTasks.includes('repetitive tool use')) {
        messages.push('Repetitive motions need regular breaks 🔧');
      }
      if (context.workTasks.includes('kneeling')) {
        messages.push('Kneeling all day? Let\'s help those knees 🦵');
      }
    }
    
    if (context.painAreas && context.painAreas.length > 0) {
      if (context.painAreas.includes('back')) {
        messages.push('Back pain from work? Time for some stretches 🧘');
      }
      if (context.painAreas.includes('shoulder')) {
        messages.push('Shoulder tension? Let\'s work it out 💆');
      }
      if (context.painAreas.includes('wrist')) {
        messages.push('Wrist pain? These exercises will help ✋');
      }
    }
    
    // Progress messages
    if (context.dailyCompleted === context.totalDaily && context.totalDaily > 0) {
      if (context.hasStreak) {
        messages.push(`${context.streakDays} day streak! Keep it going`);
      } else {
        messages.push('All done today! Great work!');
      }
    } else if (context.dailyCompleted > 0) {
      const remaining = context.totalDaily - context.dailyCompleted;
      messages.push(`${remaining} more to go! You've got this!`);
    } else if (context.hasStreak) {
      messages.push(`Don't break that ${context.streakDays} day streak!`);
    } else {
      messages.push('Ready to start your exercises?');
    }
    
    // Return a random message from the list
    return messages[Math.floor(Math.random() * messages.length)] || 'Ready to exercise? 💪';
  }
}

export const aiService = new AIService();
