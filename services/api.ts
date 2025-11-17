// API service for handling onboarding data and AI processing

export interface UserResponse {
  questionIndex: number;
  selectedOptions: string[];
  textInput: string;
  timestamp: Date;
}

export interface ExerciseRecommendation {
  targetAreas: string[];
  exerciseTypes: string[];
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

export interface OnboardingData {
  userId: string;
  responses: UserResponse[];
  recommendations: ExerciseRecommendation;
  completedAt: Date;
}

class ApiService {
  // API base URL configuration
  // For production: Set this to your production API URL
  // For local development: Set to 'http://localhost:3001' if running local server
  // You can also use environment variables: process.env.EXPO_PUBLIC_API_URL
  private baseUrl = process.env.EXPO_PUBLIC_API_URL 
    || (__DEV__ ? 'http://localhost:3001' : 'https://api.solace-app.com');
  
  // Simulate API calls for now - replace with actual implementations
  async submitUserResponse(response: UserResponse): Promise<void> {
    try {
      // Simulate API call
      console.log('Submitting user response:', response);
      
      // In a real implementation, this would be:
      // const response = await fetch(`${this.baseUrl}/responses`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(response)
      // });
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (error) {
      console.error('Error submitting response:', error);
      throw error;
    }
  }

  async processVoiceInput(audioData: string): Promise<string> {
    try {
      // Simulate speech-to-text processing
      console.log('Processing voice input:', audioData);
      
      // In a real implementation, this would use a speech-to-text API like:
      // - Google Speech-to-Text
      // - Azure Speech Services
      // - AWS Transcribe
      
      // Simulate processing delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Return mock transcription
      return "I have pain in my left shoulder and right knee from heavy lifting work";
    } catch (error) {
      console.error('Error processing voice input:', error);
      throw error;
    }
  }

  async generateExerciseRecommendations(responses: UserResponse[]): Promise<ExerciseRecommendation> {
    try {
      console.log('Generating exercise recommendations for:', responses);
      
      // Simulate AI processing
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Extract user's pain areas and work tasks
      const painAreas = responses.find(r => r.questionIndex === 1)?.selectedOptions || [];
      const workTasks = responses.find(r => r.questionIndex === 0)?.selectedOptions || [];
      
      // Generate recommendations based on responses
      const recommendations: ExerciseRecommendation = {
        targetAreas: painAreas,
        exerciseTypes: this.getExerciseTypesForWorkTasks(workTasks),
        description: this.generateDescription(painAreas, workTasks),
        difficulty: 'intermediate'
      };
      
      return recommendations;
    } catch (error) {
      console.error('Error generating recommendations:', error);
      throw error;
    }
  }

  private getExerciseTypesForWorkTasks(workTasks: string[]): string[] {
    const exerciseMap: { [key: string]: string[] } = {
      'Heavy lifting': ['strength training', 'core strengthening', 'posture exercises'],
      'Overhead work': ['shoulder mobility', 'upper body stretching', 'rotator cuff exercises'],
      'Repetitive tool use': ['wrist flexibility', 'forearm strengthening', 'ergonomic exercises'],
      'Kneeling': ['hip mobility', 'knee strengthening', 'lower body flexibility']
    };
    
    const exercises: string[] = [];
    workTasks.forEach(task => {
      if (exerciseMap[task]) {
        exercises.push(...exerciseMap[task]);
      }
    });
    
    return [...new Set(exercises)]; // Remove duplicates
  }

  private generateDescription(painAreas: string[], workTasks: string[]): string {
    const areaText = painAreas.length > 0 ? painAreas.join(' and ') : 'your identified areas';
    const taskText = workTasks.length > 0 ? workTasks.join(' and ') : 'your work activities';
    
    return `Your exercises will target ${areaText}.\n\nYour exercises will help you with ${taskText}.`;
  }

  async saveOnboardingData(data: OnboardingData): Promise<void> {
    try {
      console.log('Saving onboarding data:', data);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // In a real implementation, this would save to a database
      // and potentially sync with cloud storage
    } catch (error) {
      console.error('Error saving onboarding data:', error);
      throw error;
    }
  }

  /**
   * Get video URL for an exercise video
   * @param videoFileName - The filename of the video (e.g., "HandWarmUp.mov")
   * @returns The full API URL for the video
   */
  getVideoUrl(videoFileName: string): string {
    // Construct the video URL from the API base URL
    // In production, this would be: `${this.baseUrl}/videos/${videoFileName}`
    // For now, using a placeholder that you can replace with your actual video API endpoint
    return `${this.baseUrl}/videos/${encodeURIComponent(videoFileName)}`;
  }
}

export const apiService = new ApiService();

