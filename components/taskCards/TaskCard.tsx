import TaskCard from '@/components/ui/TaskCard';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface Task {
  id: string;
  title: string;
  xpAmount: number;
  xpColor: string;
  isCompleted: boolean;
}

interface TaskCardProps {
  tasks: Task[];
  onTaskPress: (taskId: string) => void;
  exerciseType: 'physical' | 'mental';
}

const TaskCardComponent: React.FC<TaskCardProps> = ({ tasks, onTaskPress, exerciseType }) => {
  const getSectionTitle = () => {
    if (exerciseType === 'physical') {
      return 'Daily Checklist';
    } else {
      return 'Need more xp? Try these';
    }
  };

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{getSectionTitle()}</Text>
      {tasks.map((task) => (
        <TaskCard
          key={task.id}
          title={task.title}
          xpAmount={task.xpAmount}
          xpColor={task.xpColor}
          isCompleted={task.isCompleted}
          onPress={() => onTaskPress(task.id)}
        />
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
});

export default TaskCardComponent;
