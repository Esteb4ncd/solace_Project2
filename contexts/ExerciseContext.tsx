import React, { createContext, ReactNode, useContext, useState } from 'react';

interface CompletedExercise {
  id: string;
  name: string;
  xpGained: number;
  completedAt: Date;
}

interface ExerciseContextType {
  completedExercises: CompletedExercise[];
  markExerciseComplete: (id: string, name: string, xpGained: number) => void;
  markAllDailyExercisesComplete: () => void;
  resetAllExercises: () => void;
  isExerciseComplete: (id: string) => boolean;
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
  };

  const isExerciseComplete = (id: string) => {
    return completedExercises.some(ex => ex.id === id);
  };

  return (
    <ExerciseContext.Provider
      value={{
        completedExercises,
        markExerciseComplete,
        markAllDailyExercisesComplete,
        resetAllExercises,
        isExerciseComplete,
      }}
    >
      {children}
    </ExerciseContext.Provider>
  );
};
