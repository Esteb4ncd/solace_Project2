// Real AI service for handling conversations and voice processing

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

  // Simulate OpenAI API call
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
      
      // Generate AI response based on context
      const aiResponse = await this.generateAIResponse(userMessage);
      
      // Add AI response to conversation
      const aiChatMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: aiResponse.message,
        timestamp: new Date()
      };
      
      this.conversationHistory.push(aiChatMessage);
      
      return aiResponse;
    } catch (error) {
      console.error('Error in AI service:', error);
      throw new Error('Failed to process message');
    }
  }

  private extractContextFromMessage(message: string): void {
    const lowerMessage = message.toLowerCase();
    
    // Extract pain areas
    const painKeywords = {
      'shoulder': ['shoulder', 'arm', 'upper body'],
      'knee': ['knee', 'leg', 'lower body'],
      'back': ['back', 'spine', 'lower back'],
      'neck': ['neck', 'cervical'],
      'wrist': ['wrist', 'hand', 'forearm']
    };
    
    Object.entries(painKeywords).forEach(([area, keywords]) => {
      if (keywords.some(keyword => lowerMessage.includes(keyword))) {
        if (!this.currentContext.painAreas.includes(area)) {
          this.currentContext.painAreas.push(area);
        }
      }
    });
    
    // Extract work tasks
    const workKeywords = {
      'heavy lifting': ['lift', 'heavy', 'weight', 'carry'],
      'overhead work': ['overhead', 'above', 'reach up'],
      'repetitive tool use': ['tool', 'repetitive', 'hammer', 'drill'],
      'kneeling': ['kneel', 'knee', 'crouch', 'squat']
    };
    
    Object.entries(workKeywords).forEach(([task, keywords]) => {
      if (keywords.some(keyword => lowerMessage.includes(keyword))) {
        if (!this.currentContext.workTasks.includes(task)) {
          this.currentContext.workTasks.push(task);
        }
      }
    });
  }

  private async generateAIResponse(userMessage: string): Promise<AIResponse> {
    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
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
    const exerciseMap: { [key: string]: string[] } = {
      'heavy lifting': ['core strengthening', 'posture exercises', 'back strengthening'],
      'overhead work': ['shoulder mobility', 'upper body stretching', 'rotator cuff exercises'],
      'repetitive tool use': ['wrist flexibility', 'forearm strengthening', 'ergonomic exercises'],
      'kneeling': ['hip mobility', 'knee strengthening', 'lower body flexibility']
    };
    
    const exercises: string[] = [];
    this.currentContext.workTasks.forEach(task => {
      if (exerciseMap[task]) {
        exercises.push(...exerciseMap[task]);
      }
    });
    
    return {
      targetAreas: this.currentContext.painAreas,
      exerciseTypes: [...new Set(exercises)],
      description: `Your exercises will target your ${this.currentContext.painAreas.join(' and ')}.\n\nYour exercises will help you with ${this.currentContext.workTasks.join(' and ')}.`,
      difficulty: 'intermediate' as const
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
}

export const aiService = new AIService();
