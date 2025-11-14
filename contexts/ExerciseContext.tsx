import React, { createContext, ReactNode, useContext, useState } from 'react';
import { RecommendedExercise } from '@/constants/exercises';

interface CompletedExercise {
  id: string;
  name: string;
  xpGained: number;
  completedAt: Date;
}

interface DailyTask {
  id: string;
  title: string;
  xpAmount: number;
  xpColor: string;
  isCompleted: boolean;
}

interface ExerciseContextType {
  completedExercises: CompletedExercise[];
  recommendedExercises: RecommendedExercise[];
  dailyTasks: DailyTask[];
  markExerciseComplete: (id: string, name: string, xpGained: number) => void;
  markAllDailyExercisesComplete: () => void;
  resetAllExercises: () => void;
  isExerciseComplete: (id: string) => boolean;
  videoResetTrigger: number;
  getStreakCount: () => number;
  isStreakExtendedToday: () => boolean;
  setRecommendedExercises: (exercises: RecommendedExercise[]) => void;
  updateDailyTasks: (tasks: DailyTask[]) => void;
}

const ExerciseContext = createContext<ExerciseContextType | undefined>(undefined);

export const useExerciseContext = () => {
  const context = useContext(ExerciseContext);
  if (!context) {
    throw new Error('useExerciseContext must be used within an ExerciseProvider');
  }
  return context;
};

interface ExerciseProviderProps {
  children: ReactNode;
}

export const ExerciseProvider: React.FC<ExerciseProviderProps> = ({ children }) => {
  const [completedExercises, setCompletedExercises] = useState<CompletedExercise[]>([]);
  const [recommendedExercises, setRecommendedExercises] = useState<RecommendedExercise[]>([]);
  const [dailyTasks, setDailyTasks] = useState<DailyTask[]>([]);
  const [videoResetTrigger, setVideoResetTrigger] = useState(0);

  const markAllDailyExercisesComplete = () => {
    const dailyExercises = [
      { id: '1', name: 'Hand Warm Up', xpGained: 10 },
      { id: '2', name: 'Shoulder Warm Up', xpGained: 10 },
      { id: '3', name: 'Upper Back Stretch', xpGained: 10 },
    ];

    const newExercises: CompletedExercise[] = dailyExercises.map(exercise => ({
      id: exercise.id,
      name: exercise.name,
      xpGained: exercise.xpGained,
      completedAt: new Date(),
    }));

    setCompletedExercises(prev => {
      const existingIds = prev.map(ex => ex.id);
      const uniqueNewExercises = newExercises.filter(ex => !existingIds.includes(ex.id));
      return [...prev, ...uniqueNewExercises];
    });
  };

  const markExerciseComplete = (id: string, name: string, xpGained: number) => {
    const newExercise: CompletedExercise = {
      id,
      name,
      xpGained,
      completedAt: new Date(),
    };
    
    setCompletedExercises(prev => {
      // Check if exercise is already completed
      const exists = prev.find(ex => ex.id === id);
      if (exists) {
        return prev; // Don't add duplicate
      }
      return [...prev, newExercise];
    });
  };

  const resetAllExercises = () => {
    setCompletedExercises([]);
    setVideoResetTrigger(prev => prev + 1); // Increment trigger to reset video
  };

  const isExerciseComplete = (id: string) => {
    return completedExercises.some(ex => ex.id === id);
  };

  const getStreakCount = (): number => {
    if (completedExercises.length === 0) {
      return 0;
    }

    // Get unique dates when exercises were completed
    const dates = completedExercises.map(ex => {
      const date = new Date(ex.completedAt);
      date.setHours(0, 0, 0, 0);
      return date.getTime();
    });

    const uniqueDates = Array.from(new Set(dates)).sort((a, b) => b - a); // Sort descending (most recent first)

    if (uniqueDates.length === 0) {
      return 0;
    }

    // Check if today has any completed exercises
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayTime = today.getTime();

    // If today has no exercises, streak is 0
    if (!uniqueDates.includes(todayTime)) {
      return 0;
    }

    // Calculate consecutive days starting from today
    let streak = 0;
    let currentDate = todayTime;
    let dateIndex = 0;

    while (dateIndex < uniqueDates.length) {
      const dateTime = uniqueDates[dateIndex];
      
      if (dateTime === currentDate) {
        streak++;
        currentDate -= 24 * 60 * 60 * 1000; // Subtract one day
        dateIndex++;
      } else if (dateTime < currentDate) {
        // Gap found, break the streak
        break;
      } else {
        // Skip dates that are in the future (shouldn't happen, but just in case)
        dateIndex++;
      }
    }

    return streak;
  };

  const isStreakExtendedToday = (): boolean => {
    if (completedExercises.length === 0) {
      return false;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayTime = today.getTime();

    return completedExercises.some(ex => {
      const date = new Date(ex.completedAt);
      date.setHours(0, 0, 0, 0);
      return date.getTime() === todayTime;
    });
  };

  const updateDailyTasks = (tasks: DailyTask[]) => {
    setDailyTasks(tasks);
  };

  return (
    <ExerciseContext.Provider
      value={{
        completedExercises,
        recommendedExercises,
        dailyTasks,
        markExerciseComplete,
        markAllDailyExercisesComplete,
        resetAllExercises,
        isExerciseComplete,
        videoResetTrigger,
        getStreakCount,
        isStreakExtendedToday,
        setRecommendedExercises,
        updateDailyTasks,
      }}
    >
      {children}
    </ExerciseContext.Provider>
  );
};
