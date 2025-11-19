import CompletedTask from '@/components/ui/CompletedTask';
import { getExerciseById, getExerciseXpReward } from '@/constants/exercises';
import { useExerciseContext } from '@/contexts/ExerciseContext';
import { router } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface Task {
  id: string;
  title: string;
  xpAmount: number;
  xpColor: string;
  isCompleted: boolean;
}

interface TaskCardProps {
  tasks: Task[];
  exerciseType: 'physical' | 'mental';
  isDaily?: boolean;
}

const TaskCardComponent: React.FC<TaskCardProps> = ({ tasks, exerciseType, isDaily = false }) => {
  const { isExerciseComplete } = useExerciseContext();

  const handleTaskPress = (taskId: string) => {
    console.log('Task pressed:', taskId, 'isDaily:', isDaily, 'exerciseType:', exerciseType);
    
    // Find the task from the tasks array
    const task = tasks.find(t => t.id === taskId);
    if (!task) {
      console.warn(`Task not found for ID: ${taskId}`);
      return;
    }
    
    // If this is a mental exercise (relax section), navigate to breathing exercises
    if (exerciseType === 'mental' && !isDaily) {
      console.log('Navigating to breathing exercises for mental exercise:', task.title);
      router.push('/(tabs)/breathingExercisePage');
      return;
    }
    
    // Get exercise from exercises.json database
    const exercise = getExerciseById(taskId);
    
    if (!exercise) {
      console.warn(`Exercise not found for ID: ${taskId} - using task data`);
      // Fallback for non-exercise tasks (like mental health exercises)
      router.push({
        pathname: '/exerciseConfirmation',
        params: { 
          exerciseId: taskId,
          exerciseName: task.title,
          xpReward: String(task.xpAmount),
          duration: '2 minutes'
        }
      });
      return;
    }

    // Determine if this is a recommended exercise (worth 10 XP) or secondary (5 XP)
    // Check if task XP matches recommended reward
    const isRecommended = task.xpAmount >= exercise.recommendedXpReward;
    const xpReward = getExerciseXpReward(exercise, isRecommended);

    console.log('Exercise details from database:', {
      id: exercise.id,
      name: exercise.name,
      duration: exercise.duration,
      xpReward,
      isRecommended
    });

    router.push({
      pathname: '/exerciseConfirmation',
      params: { 
        exerciseId: exercise.id,
        exerciseName: exercise.name,
        xpReward: String(xpReward),
        duration: exercise.duration
      }
    });
  };

  const getSectionTitle = () => {
    if (isDaily) {
      return 'Daily Checklist';
    }
    return exerciseType === 'physical' ? 'Physical Exercises' : 'Mental Exercises';
  };

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{getSectionTitle()}</Text>
      {tasks.map((task) => {
        const isCompleted = isExerciseComplete(task.id);
        
        if (isCompleted) {
          return (
            <CompletedTask
              key={task.id}
              taskName={task.title}
              xpGained={task.xpAmount}
            />
          );
        }
        
        return (
          <TouchableOpacity 
            key={task.id}
            style={styles.taskContainer}
            onPress={() => handleTaskPress(task.id)}
            activeOpacity={0.7}
          >
            <Text style={styles.taskTitle}>
              {task.title}
            </Text>
            <Text style={[styles.xpText, { color: task.xpColor }]}>
              {task.xpAmount}xp
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    paddingVertical: 16, // 16px margin from element above
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 16,
  },
  taskContainer: {
    backgroundColor: '#fff',
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginBottom: 16, // 16px spacing between cards
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: 360,
    height: 64,
    borderWidth: 1,
    borderColor: '#7267D9', // Purple border
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  taskTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    flex: 1,
  },
  xpText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default TaskCardComponent;
