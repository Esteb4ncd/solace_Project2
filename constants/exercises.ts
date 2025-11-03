/**
 * Exercise Database
 * 
 * This file imports exercise data from exercises.json and provides
 * helper functions for searching, filtering, and accessing exercises.
 * 
 * The JSON file contains the exercise metadata, while this TypeScript file
 * handles the video file mapping (since require() statements can't be in JSON)
 * and provides type-safe helper functions.
 */

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
 * Video file mapping
 * Maps video filenames to their require() paths for React Native bundler
 * 
 * NOTE: When you add new videos, you MUST add them to this map
 */
const VIDEO_MAP: { [key: string]: any } = {
  'HandWarmUp.mp4': require('@/assets/videos/HandWarmUp.mp4'),
  // TODO: Add mappings for your remaining 10 videos here:
  // 'ShoulderWarmUp.mp4': require('@/assets/videos/ShoulderWarmUp.mp4'),
  // 'UpperBackStretch.mp4': require('@/assets/videos/UpperBackStretch.mp4'),
  // ... etc for all 11 videos
};

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
 * Get video source path for an exercise
 * Returns the require() path for the video file
 */
export const getExerciseVideoSource = (exercise: Exercise): any => {
  const videoSource = VIDEO_MAP[exercise.videoFileName];
  
  if (!videoSource) {
    console.warn(`Video file not found: ${exercise.videoFileName}. Using fallback.`);
    return VIDEO_MAP['HandWarmUp.mp4']; // Fallback to first video
  }
  
  return videoSource;
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
