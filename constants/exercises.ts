/**
 * Exercise Database
 * 
 * This file imports exercise data from exercises.json and provides
 * helper functions for searching, filtering, and accessing exercises.
 * 
 * The JSON file contains the exercise metadata, while this TypeScript file
 * handles the video file mapping using API URLs instead of local require() paths.
 */

import { apiService } from '@/services/api';
import exercisesData from './exercises.json';

export interface Exercise {
  id: string;
  name: string;
  description: string;
  
  // Video file path (relative to assets/videos/)
  videoFileName: string;
  
  // AI Matching Criteria
  targetAreas: string[]; // e.g., ['shoulder', 'neck', 'upper back']
  exerciseTypes: string[]; // e.g., ['warm up', 'stretching', 'strengthening']
  keywords: string[]; // Additional keywords for matching
  
  // Work task associations
  workTaskMatches: string[]; // e.g., ['heavy lifting', 'overhead work']
  
  // Exercise properties
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration: string; // e.g., "2 minutes", "5 minutes"
  
  // Reward (XP based on assignment status)
  baseXpReward: number; // 5 XP for secondary (non-assigned) exercises
  recommendedXpReward: number; // 10 XP for AI-recommended (assigned) exercises
  
  // Optional metadata
  category?: 'physical' | 'mental';
  instructions?: string; // Caption shown during video
}

// Type assertion to ensure JSON data matches Exercise interface
export const EXERCISES_DATABASE: Exercise[] = exercisesData as Exercise[];

/**
 * Recommended Exercise with assignment status
 * Used to track whether an exercise was AI-recommended (assigned) or secondary
 */
export interface RecommendedExercise {
  exercise: Exercise;
  isRecommended: boolean; // true = AI-assigned (10 XP), false = secondary (5 XP)
}

/**
 * Get exercise by ID
 */
export const getExerciseById = (id: string): Exercise | undefined => {
  return EXERCISES_DATABASE.find(ex => ex.id === id);
};

/**
 * Get XP reward for an exercise based on whether it was AI-recommended
 * @param exercise - The exercise object
 * @param isRecommended - Whether this exercise was AI-recommended (assigned via keywords)
 * @returns XP reward: 10 if recommended, 5 if secondary
 */
export const getExerciseXpReward = (exercise: Exercise, isRecommended: boolean): number => {
  return isRecommended ? exercise.recommendedXpReward : exercise.baseXpReward;
};

/**
 * Get video source URL for an exercise
 * Returns the API URL for the video file as { uri: string, headers?: object } format
 * This format is compatible with expo-av Video component
 * Includes authentication headers if API key is configured
 */
export const getExerciseVideoSource = (exercise: Exercise): { uri: string; headers?: Record<string, string> } => {
  const videoUrl = apiService.getVideoUrl(exercise.videoFileName);
  const authHeaders = apiService.getAuthHeaders();
  
  // Extract API key from headers (HeadersInit can be Headers, string[][], or Record<string, string>)
  let apiKey: string | undefined;
  if (authHeaders instanceof Headers) {
    apiKey = authHeaders.get('x-api-key') || undefined;
  } else if (Array.isArray(authHeaders)) {
    const header = authHeaders.find(([key]) => key === 'x-api-key');
    apiKey = header ? header[1] : undefined;
  } else {
    apiKey = (authHeaders as Record<string, string>)['x-api-key'];
  }
  
  if (!videoUrl) {
    console.warn(`Video URL not found for: ${exercise.videoFileName}. Using fallback.`);
    // Fallback to first exercise's video
    const fallbackExercise = EXERCISES_DATABASE[0];
    const fallbackUrl = apiService.getVideoUrl(fallbackExercise.videoFileName);
    return { 
      uri: fallbackUrl,
      headers: apiKey ? { 'x-api-key': apiKey } : undefined
    };
  }
  
  // Extract API key from URL if present (for query param method)
  // Or use headers for header-based auth
  const source: { uri: string; headers?: Record<string, string> } = { uri: videoUrl };
  
  // If API key is available, use header-based auth (more secure than query param)
  if (apiKey) {
    source.headers = { 'x-api-key': apiKey };
  }
  
  return source;
};

/**
 * Search exercises by target areas
 */
export const searchExercisesByTargetAreas = (targetAreas: string[]): Exercise[] => {
  if (targetAreas.length === 0) return [];
  
  return EXERCISES_DATABASE.filter(exercise => 
    targetAreas.some(area => 
      exercise.targetAreas.some(exArea => 
        exArea.toLowerCase().includes(area.toLowerCase()) ||
        area.toLowerCase().includes(exArea.toLowerCase())
      )
    )
  );
};

/**
 * Search exercises by work tasks
 */
export const searchExercisesByWorkTasks = (workTasks: string[]): Exercise[] => {
  if (workTasks.length === 0) return [];
  
  return EXERCISES_DATABASE.filter(exercise => 
    workTasks.some(task => 
      exercise.workTaskMatches.includes(task)
    )
  );
};

/**
 * Search exercises by keywords
 */
export const searchExercisesByKeywords = (keywords: string[]): Exercise[] => {
  if (keywords.length === 0) return [];
  
  const lowerKeywords = keywords.map(k => k.toLowerCase());
  
  return EXERCISES_DATABASE.filter(exercise => {
    const searchableText = [
      ...exercise.keywords,
      ...exercise.targetAreas,
      ...exercise.exerciseTypes,
      exercise.name,
      exercise.description
    ].join(' ').toLowerCase();
    
    return lowerKeywords.some(keyword => searchableText.includes(keyword));
  });
};

/**
 * Smart exercise recommendation based on user context
 * This is what the AI should use to recommend exercises
 * Returns exercises with isRecommended: true (worth 10 XP)
 */
export const recommendExercises = (
  targetAreas: string[],
  workTasks: string[],
  keywords: string[] = [],
  maxResults: number = 3
): RecommendedExercise[] => {
  const scoredExercises = EXERCISES_DATABASE.map(exercise => {
    let score = 0;
    
    // Score by target areas (highest priority)
    const targetAreaMatches = targetAreas.filter(area =>
      exercise.targetAreas.some(exArea => 
        exArea.toLowerCase().includes(area.toLowerCase()) ||
        area.toLowerCase().includes(exArea.toLowerCase())
      )
    ).length;
    score += targetAreaMatches * 10;
    
    // Score by work tasks
    const workTaskMatches = workTasks.filter(task =>
      exercise.workTaskMatches.includes(task)
    ).length;
    score += workTaskMatches * 8;
    
    // Score by keywords
    const keywordMatches = keywords.filter(keyword => {
      const searchableText = [
        ...exercise.keywords,
        exercise.name,
        exercise.description
      ].join(' ').toLowerCase();
      return searchableText.includes(keyword.toLowerCase());
    }).length;
    score += keywordMatches * 5;
    
    return { exercise, score };
  });
  
  // Sort by score (highest first) and return top results with isRecommended: true
  return scoredExercises
    .sort((a, b) => b.score - a.score)
    .filter(item => item.score > 0) // Only exercises with matches
    .slice(0, maxResults)
    .map(item => ({ 
      exercise: item.exercise, 
      isRecommended: true // These are AI-assigned, worth 10 XP
    }));
};

/**
 * Get all exercises marked as secondary (not AI-recommended)
 * These are worth 5 XP when completed
 */
export const getSecondaryExercises = (
  recommendedExerciseIds: string[]
): RecommendedExercise[] => {
  return EXERCISES_DATABASE
    .filter(ex => !recommendedExerciseIds.includes(ex.id))
    .map(ex => ({ 
      exercise: ex, 
      isRecommended: false // These are secondary, worth 5 XP
    }));
};

/**
 * Get all exercises
 */
export const getAllExercises = (): Exercise[] => {
  return [...EXERCISES_DATABASE];
};

/**
 * Get exercises by difficulty
 */
export const getExercisesByDifficulty = (difficulty: Exercise['difficulty']): Exercise[] => {
  return EXERCISES_DATABASE.filter(ex => ex.difficulty === difficulty);
};

/**
 * Get exercises by category
 */
export const getExercisesByCategory = (category: Exercise['category']): Exercise[] => {
  return EXERCISES_DATABASE.filter(ex => ex.category === category);
};
