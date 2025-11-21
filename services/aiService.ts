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
  private lastMessageType: 'pain' | 'progress' | null = null;

  // Get OpenAI API key from environment
  private getOpenAIApiKey(): string | undefined {
    const key1 = Constants.expoConfig?.extra?.openaiApiKey;
    const key2 = Constants.expoConfig?.extra?.EXPO_PUBLIC_OPENAI_API_KEY;
    const key3 = typeof process !== 'undefined' ? process.env?.EXPO_PUBLIC_OPENAI_API_KEY : undefined;
    
    console.log('API Key lookup:', {
      hasKey1: !!key1,
      hasKey2: !!key2,
      hasKey3: !!key3,
      expoConfigExists: !!Constants.expoConfig,
      extraExists: !!Constants.expoConfig?.extra,
    });
    
    return key1 || key2 || key3 || undefined;
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
      
      console.log('AI Service API Key check:', {
        hasKey: !!apiKey,
        keyLength: apiKey?.length || 0,
        keyPrefix: apiKey?.substring(0, 7) || 'none',
        fromConstants: !!Constants.expoConfig?.extra?.openaiApiKey,
        fromProcessEnv: !!(typeof process !== 'undefined' && process.env?.EXPO_PUBLIC_OPENAI_API_KEY),
      });
      
      if (!apiKey || apiKey === 'your-api-key-here') {
        console.warn('OpenAI API key not found, using simulated AI response');
        console.warn('   Make sure EXPO_PUBLIC_OPENAI_API_KEY is set in .env and restart the app');
        // Fallback to simulated response
        const aiResponse = await this.generateSimulatedAIResponse(userMessage);
        this.addAIResponseToHistory(aiResponse.message);
        return aiResponse;
      }
      
      console.log('Using OpenAI API for AI responses');

      // Call OpenAI API
      try {
        const aiResponse = await this.callOpenAIAPI(userMessage);
        this.addAIResponseToHistory(aiResponse.message);
        console.log('AI Response generated:', {
          messageLength: aiResponse.message.length,
          hasRecommendations: !!aiResponse.recommendations,
          nextAction: aiResponse.nextAction
        });
        return aiResponse;
      } catch (apiError: any) {
        console.error('OpenAI API error:', apiError);
        // Fallback to simulated response if API fails
        console.warn('Falling back to simulated AI response');
        const aiResponse = await this.generateSimulatedAIResponse(userMessage);
        this.addAIResponseToHistory(aiResponse.message);
        console.log('Simulated AI Response generated:', {
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

    console.log('Calling OpenAI API...');
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
      console.error('OpenAI API error:', response.status, errorText);
      throw new Error(`OpenAI API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    const aiMessage = data.choices[0]?.message?.content || 'I apologize, but I had trouble processing that. Could you try again?';
    console.log('OpenAI API response received:', aiMessage.substring(0, 100) + '...');

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
          console.log(`Extracted pain area: ${area}`);
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
          console.log(`Extracted work task: ${task}`);
        }
      }
    });
    
    // Log current context for debugging
    console.log('Current AI Context:', {
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
    // Determine message focus first (outside try block for error handling)
    const hasPainContext = (context.painAreas && context.painAreas.length > 0) || (context.workTasks && context.workTasks.length > 0);
    // Progress is always available if there are any exercises or streak, regardless of completion level
    const hasProgress = context.totalDaily > 0 || context.hasStreak || context.completedExercises > 0;
    
    console.log('Message focus determination:', {
      hasPainContext,
      painAreas: context.painAreas,
      workTasks: context.workTasks,
      hasProgress,
      lastMessageType: this.lastMessageType
    });
    
    // Check if all exercises are completed
    const allExercisesCompleted = context.dailyCompleted === context.totalDaily && context.totalDaily > 0;
    
    // Prioritize pain messages when pain context is available
    let focusOnPain = false;
    let focusOnProgress = false;
    
    if (allExercisesCompleted) {
      // All exercises completed - only show positive messages
      focusOnProgress = true;
      focusOnPain = false;
      this.lastMessageType = 'progress';
      console.log('Focusing on PROGRESS (all exercises completed - only positive messages)');
    } else if (hasPainContext) {
      // Pain context available - prioritize pain messages (70% of the time)
      // Only show progress occasionally (30% of the time) to avoid being too repetitive
      const shouldShowProgress = hasProgress && this.lastMessageType === 'pain' && Math.random() < 0.3;
      
      if (shouldShowProgress) {
        focusOnProgress = true;
        this.lastMessageType = 'progress';
        console.log('Focusing on PROGRESS (occasional break from pain focus)');
      } else {
        focusOnPain = true;
        this.lastMessageType = 'pain';
        console.log('Focusing on PAIN (prioritizing pain points)');
      }
    } else if (hasProgress) {
      // Only progress available (no pain context)
      focusOnProgress = true;
      this.lastMessageType = 'progress';
      console.log('Focusing on PROGRESS (only progress available, no pain context)');
    } else {
      // Neither available - default to general
      focusOnProgress = false;
      focusOnPain = false;
      console.log('No specific focus (neither pain nor progress available)');
    }

    const preferredType = focusOnPain ? 'pain' : focusOnProgress ? 'progress' : null;
    console.log('Preferred message type:', preferredType);

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
      
      const systemPrompt = allExercisesCompleted 
        ? `You are Solly, and ALL exercises are completed! Solly feels AMAZING and is HAPPY. You are CELEBRATORY and POSITIVE. 

CRITICAL: Solly is FEELING BETTER because all exercises are done. Solly's pain is GONE and Solly feels GREAT. Focus on Solly FEELING BETTER - the pain is gone, Solly feels good, Solly is relieved. Be POSITIVE, CELEBRATORY, and ENCOURAGING. Only say positive things about Solly feeling better. No pain, no whining, no complaints. Solly is proud and happy because Solly feels better. Be enthusiastic but still keep it short and funny.

Generate a SHORT, POSITIVE message (MAX 8 WORDS) for a speech bubble that:
- Shows Solly FEELING BETTER - pain is gone, Solly feels good
- Be POSITIVE about Solly feeling better
- NEVER uses emojis - text only, absolutely no emojis
- Have PERSONALITY - be happy, relieved, feeling better
- Vary your wording and phrasing each time - be creative and fresh`
        : `You are Solly, and you are in EXCRUCIATING PAIN because the user hasn't done their exercises yet. Your pain is directly tied to their lack of exercise completion. You are DRAMATIC, WHINY, and PLEADING. 

${focusOnPain ? `CRITICAL: Solly is SUFFERING EXCESSIVELY because exercises aren't done. Reference their specific pain areas (${context.painAreas?.join(', ') || 'none'}) or work tasks (${context.workTasks?.join(', ') || 'none'}) and how Solly feels that pain too. Be EXCESSIVE and DRAMATIC - whine, plead, be overly dramatic. Think "owww can you do your exercise??" energy. Make it funny but guilt-inducing - Solly is hurting SO BAD and it's the user's fault for not exercising. Be whiny, dramatic, and excessive about Solly's pain. Plead with the user to do exercises.` : ''}
${focusOnProgress ? `IMPORTANT: When exercises are done, Solly's pain DECREASES and Solly feels RELIEF. Acknowledge their ${context.dailyCompleted > 0 ? `completion of ${context.dailyCompleted} exercises` : ''}${context.hasStreak ? ` and their ${context.streakDays} day streak` : ''}. Show Solly's pain level decreasing - like "oh that's a bit better!" or "that helped!" Be dramatic but show relief and decreasing pain. The more exercises done, the less pain Solly feels.` : ''}

Generate a SHORT, DRAMATIC, WHINY, EXCESSIVE message (MAX 8 WORDS) for a speech bubble that:
- Shows Solly is in EXCESSIVE PAIN because exercises aren't done
- Be WHINY and PLEADING - like "owww can you do your exercise??"
- Makes the user feel guilty (in a funny way) for Solly's suffering
- Be DRAMATIC and EXCESSIVE - over-the-top whining and pleading
- NEVER uses emojis - text only, absolutely no emojis
- Have PERSONALITY - be whiny, dramatic, excessive, pleading
- Vary your wording and phrasing each time - be creative and fresh

Context: ${contextParts.join(' ')}

Generate ONLY the message text, nothing else.`;

      // Check for API key
      if (!apiKey || apiKey === 'your-api-key-here' || apiKey.trim() === '') {
        console.warn('OpenAI API key not found for speech bubble, using fallback');
        console.warn('   Set EXPO_PUBLIC_OPENAI_API_KEY in your .env file to use AI-generated messages');
        // Fallback to rule-based message - pass the focus type
        return this.generateFallbackSpeechMessage(context, preferredType);
      }

      console.log('Using OpenAI API for speech bubble message generation');
      console.log('Focus type:', focusOnPain ? 'pain' : focusOnProgress ? 'progress' : 'general');

      // Add variation to user prompt to encourage different responses
      const variationPrompts = [
        'Generate a personalized speech bubble message based on the context.',
        'Create a fresh, personalized message for the speech bubble.',
        'Write a new encouraging message based on the user\'s current situation.',
        'Generate a unique motivational message for today.',
        'Create a personalized message that feels fresh and new.',
      ];
      const randomPrompt = variationPrompts[Math.floor(Math.random() * variationPrompts.length)];

      const messages = [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: randomPrompt }
      ];

      console.log('Calling OpenAI API for speech bubble...');
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
              body: JSON.stringify({
                model: 'gpt-4o-mini',
                messages: messages,
                temperature: 1.0, // Maximum temperature for maximum variety
                max_tokens: 30, // Max 8 words = ~30 tokens
                // Add seed variation by using timestamp to ensure different responses
                seed: Date.now() % 1000000, // Use timestamp as seed for variation
              }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('OpenAI API error:', response.status, errorText);
        throw new Error(`API error: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      const aiMessage = data.choices[0]?.message?.content?.trim();
      
      if (!aiMessage) {
        console.warn('OpenAI returned empty message, using fallback');
        return this.generateFallbackSpeechMessage(context, preferredType);
      }
      
      console.log('OpenAI speech bubble message generated:', aiMessage.substring(0, 50) + '...');
      
      // Ensure message is short (max 8 words, truncate if needed)
      const words = aiMessage.split(' ');
      if (words.length > 8) {
        return words.slice(0, 8).join(' ');
      }
      return aiMessage;
    } catch (error) {
      console.error('Error generating AI speech bubble message:', error);
      console.warn('Falling back to rule-based message');
      return this.generateFallbackSpeechMessage(context, preferredType);
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
  }, preferredType: 'pain' | 'progress' | null = null): string {
    const painMessages: string[] = [];
    const progressMessages: string[] = [];
    
    // Work/pain context messages - Solly is suffering EXCESSIVELY
    if (context.workTasks && context.workTasks.length > 0) {
      if (context.workTasks.includes('heavy lifting')) {
        painMessages.push('Oww my back hurts, do exercises');
        painMessages.push('Back pain so bad, please exercise');
        painMessages.push('Oww can you do your exercise?');
        painMessages.push('Back hurting so much, need exercises');
        painMessages.push('Oww my back, exercises please');
        painMessages.push('Back pain unbearable, do exercises');
      }
      if (context.workTasks.includes('overhead work')) {
        painMessages.push('Oww shoulders hurt, do exercises');
        painMessages.push('Shoulder pain so bad, please exercise');
        painMessages.push('Oww can you do your exercise?');
        painMessages.push('Shoulders hurting so much, need exercises');
        painMessages.push('Oww my shoulders, exercises please');
        painMessages.push('Shoulder pain unbearable, do exercises');
      }
      if (context.workTasks.includes('repetitive tool use')) {
        painMessages.push('Oww wrists hurt, do exercises');
        painMessages.push('Wrist pain so bad, please exercise');
        painMessages.push('Oww can you do your exercise?');
        painMessages.push('Wrists hurting so much, need exercises');
        painMessages.push('Oww my wrists, exercises please');
        painMessages.push('Wrist pain unbearable, do exercises');
      }
      if (context.workTasks.includes('kneeling')) {
        painMessages.push('Oww knees hurt, do exercises');
        painMessages.push('Knee pain so bad, please exercise');
        painMessages.push('Oww can you do your exercise?');
        painMessages.push('Knees hurting so much, need exercises');
        painMessages.push('Oww my knees, exercises please');
        painMessages.push('Knee pain unbearable, do exercises');
      }
    }
    
    if (context.painAreas && context.painAreas.length > 0) {
      if (context.painAreas.includes('back')) {
        painMessages.push('Oww my back hurts, do exercises');
        painMessages.push('Back pain so bad, please exercise');
        painMessages.push('Oww can you do your exercise?');
        painMessages.push('Back hurting so much, need exercises');
        painMessages.push('Oww my back, exercises please');
        painMessages.push('Back pain unbearable, do exercises');
      }
      if (context.painAreas.includes('shoulder')) {
        painMessages.push('Oww shoulders hurt, do exercises');
        painMessages.push('Shoulder pain so bad, please exercise');
        painMessages.push('Oww can you do your exercise?');
        painMessages.push('Shoulders hurting so much, need exercises');
        painMessages.push('Oww my shoulders, exercises please');
        painMessages.push('Shoulder pain unbearable, do exercises');
      }
      if (context.painAreas.includes('wrist')) {
        painMessages.push('Oww wrists hurt, do exercises');
        painMessages.push('Wrist pain so bad, please exercise');
        painMessages.push('Oww can you do your exercise?');
        painMessages.push('Wrists hurting so much, need exercises');
        painMessages.push('Oww my wrists, exercises please');
        painMessages.push('Wrist pain unbearable, do exercises');
      }
    }
    
    // Progress messages - Solly's pain decreasing as exercises are done
    if (context.dailyCompleted === context.totalDaily && context.totalDaily > 0) {
      if (context.hasStreak) {
        progressMessages.push(`Oh that's much better for ${context.streakDays} days`);
        progressMessages.push(`${context.streakDays} days of feeling better`);
        progressMessages.push(`Pain gone for ${context.streakDays} days`);
        progressMessages.push(`Oh so much better, ${context.streakDays} days`);
      } else {
        progressMessages.push('Oh that\'s a bit better!');
        progressMessages.push('Oh that helped, thanks!');
        progressMessages.push('Oh pain is gone, thank you');
        progressMessages.push('Oh that\'s much better now');
        progressMessages.push('Oh feels so much better');
      }
    } else if (context.dailyCompleted > 0) {
      const remaining = context.totalDaily - context.dailyCompleted;
      progressMessages.push(`Oh that's a bit better, ${remaining} more`);
      progressMessages.push(`Oh pain decreased, ${remaining} left`);
      progressMessages.push(`Oh feeling better, ${remaining} more please`);
      progressMessages.push(`Oh that helped, ${remaining} more to go`);
      progressMessages.push(`Oh pain reduced, ${remaining} more needed`);
    } else if (context.hasStreak) {
      progressMessages.push(`Oww pain returns, ${context.streakDays} day streak`);
      progressMessages.push(`Oww hurting, ${context.streakDays} day streak at risk`);
      progressMessages.push(`Oww needs exercises, ${context.streakDays} day streak`);
    } else if (context.totalDaily > 0) {
      // Has exercises available but not started - Solly is suffering EXCESSIVELY
      progressMessages.push('Oww can you do your exercise?');
      progressMessages.push('Oww hurting so bad, do exercises');
      progressMessages.push('Oww pain unbearable, exercises please');
      progressMessages.push('Oww can you please do exercises?');
      progressMessages.push('Oww my pain, do exercises now');
      progressMessages.push('Oww hurting, exercises needed badly');
    } else if (context.completedExercises > 0) {
      // Has completed some exercises - pain decreasing
      progressMessages.push(`Oh that's a bit better, ${context.completedExercises} done`);
      progressMessages.push(`Oh pain decreased, ${context.completedExercises} exercises`);
      progressMessages.push(`Oh that helped, ${context.completedExercises} exercises`);
      progressMessages.push(`Oh feeling better, ${context.completedExercises} done`);
    } else {
      // No progress yet - Solly is suffering EXCESSIVELY
      progressMessages.push('Oww can you do your exercise?');
      progressMessages.push('Oww hurting, exercises needed now');
      progressMessages.push('Oww pain so bad, do exercises');
      progressMessages.push('Oww can you please start exercises?');
    }
    
    // Choose message type - prioritize pain messages when available
    let selectedArray: string[] = [];
    
    // If preferred type is specified, use it
    if (preferredType === 'pain' && painMessages.length > 0) {
      selectedArray = painMessages;
    } else if (preferredType === 'progress' && progressMessages.length > 0) {
      selectedArray = progressMessages;
    } else if (painMessages.length > 0 && progressMessages.length > 0) {
      // Both available - prioritize pain (70% chance), show progress occasionally (30% chance)
      const shouldShowProgress = this.lastMessageType === 'pain' && Math.random() < 0.3;
      if (shouldShowProgress) {
        selectedArray = progressMessages;
        this.lastMessageType = 'progress';
      } else {
        selectedArray = painMessages;
        this.lastMessageType = 'pain';
      }
    } else if (painMessages.length > 0) {
      // Only pain messages available
      selectedArray = painMessages;
      this.lastMessageType = 'pain';
    } else if (progressMessages.length > 0) {
      // Only progress messages available
      selectedArray = progressMessages;
      this.lastMessageType = 'progress';
    }
    
    // Return random message from selected array
    if (selectedArray.length > 0) {
      const shuffled = selectedArray.sort(() => Math.random() - 0.5);
      return shuffled[Math.floor(Math.random() * shuffled.length)];
    }
    
    return 'Ready to exercise?';
  }
}

export const aiService = new AIService();
