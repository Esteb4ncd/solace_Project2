import { router } from 'expo-router';
import React, { useState } from 'react';
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
  const [taskStates, setTaskStates] = useState<Record<string, boolean>>(
    tasks.reduce((acc, task) => ({ ...acc, [task.id]: task.isCompleted }), {})
  );

  const getSectionTitle = () => {
    if (exerciseType === 'physical') {
      return 'Daily Checklist';
    } else {
      return 'Need more xp? Try these';
    }
  };

  const handleTaskPress = (taskId: string) => {
    console.log('Task pressed:', taskId, 'isDaily:', isDaily);
    
    // Toggle task completion state
    setTaskStates(prev => ({
      ...prev,
      [taskId]: !prev[taskId]
    }));
    
    // If this is a daily task, navigate to Exercise Confirmation page
    if (isDaily) {
      console.log('Navigating to Exercise Confirmation for daily task:', taskId);
      
      // Get exercise details based on taskId
      const getExerciseDetails = (id: string) => {
        switch (id) {
          case '1': // Hand Warm Up
            return {
              name: 'Hand Warm Up',
              xpReward: '10',
              duration: '10 seconds'
            };
          case '2': // Shoulder Relief
            return {
              name: 'Shoulder Relief',
              xpReward: '15',
              duration: '3 minutes'
            };
          case '3': // Joint Relief
            return {
              name: 'Joint Relief',
              xpReward: '20',
              duration: '5 minutes'
            };
          default:
            return {
              name: 'Exercise',
              xpReward: '10',
              duration: '2 minutes'
            };
        }
      };

      const exerciseDetails = getExerciseDetails(taskId);
      console.log('Exercise details:', exerciseDetails);

      router.push({
        pathname: '/exerciseConfirmation',
        params: { 
          exerciseName: exerciseDetails.name,
          xpReward: exerciseDetails.xpReward,
          duration: exerciseDetails.duration
        }
      });
    }
  };

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{getSectionTitle()}</Text>
      {tasks.map((task) => (
        <TouchableOpacity 
          key={task.id}
          style={[styles.taskContainer, taskStates[task.id] && styles.completedContainer]}
          onPress={() => handleTaskPress(task.id)}
          activeOpacity={0.7}
        >
          <Text style={[styles.taskTitle, taskStates[task.id] && styles.completedTitle]}>
            {task.title}
          </Text>
          <Text style={[styles.xpText, { color: task.xpColor }]}>
            {task.xpAmount}xp
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    paddingVertical: 16, // 16px margin from element above
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 8, // 8px margin between checklist items
  },
  taskContainer: {
    backgroundColor: '#fff',
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 16, // 16px spacing between cards
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: 360,
    height: 72,
    borderWidth: 1,
    borderColor: '#9CA3AF', // Grey border
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  completedContainer: {
    backgroundColor: '#F3F4F6',
  },
  taskTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    flex: 1,
  },
  completedTitle: {
    textDecorationLine: 'line-through',
    opacity: 0.6,
  },
  xpText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default TaskCardComponent;
