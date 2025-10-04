import { ThemedText } from '@/components/themed-text';
import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

export default function Checklist({ 
  title = "Checklist", 
  items: initialItems = [],
  onItemToggle = null
}) {
  const [checklistItems, setChecklistItems] = useState(
    initialItems.length > 0 ? initialItems : [
      { id: 1, text: "Eat an apple", completed: false },
      { id: 2, text: "Watch My Little Pony", completed: false },
      { id: 3, text: "Learn Expo yay!", completed: false },
      { id: 4, text: "Code code and code", completed: false },
      { id: 5, text: "Cry", completed: false },
    ]
  );

  const toggleItem = (id) => {
    setChecklistItems(items =>
      items.map(item =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );
    
    // Call the optional callback if provided
    if (onItemToggle && typeof onItemToggle === 'function') {
      onItemToggle(id);
    }
  };

  const completedCount = checklistItems.filter(item => item.completed).length;
  const totalCount = checklistItems.length;

  return (
    <View style={styles.container}>
      <ThemedText type="title" style={styles.title}>{title}</ThemedText>
      
      <ThemedText style={styles.progress}>
        Progress: {completedCount}/{totalCount} completed
      </ThemedText>

      <View style={styles.checklist}>
        {checklistItems.map(item => (
          <TouchableOpacity
            key={item.id}
            style={styles.checklistItem}
            onPress={() => toggleItem(item.id)}
          >
            <View style={[
              styles.checkbox,
              item.completed && styles.checkboxCompleted
            ]}>
              {item.completed && <ThemedText style={styles.checkmark}>✓</ThemedText>}
            </View>
            <ThemedText style={[
              styles.itemText,
              item.completed && styles.itemTextCompleted
            ]}>
              {item.text}
            </ThemedText>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
  },
  title: {
    marginBottom: 10,
  },
  progress: {
    fontSize: 16,
    marginBottom: 20,
    opacity: 0.7,
  },
  checklist: {
    width: '100%',
    maxWidth: 300,
  },
  checklistItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    marginBottom: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#007AFF',
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxCompleted: {
    backgroundColor: '#007AFF',
  },
  checkmark: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  itemText: {
    flex: 1,
    fontSize: 16,
  },
  itemTextCompleted: {
    textDecorationLine: 'line-through',
    opacity: 0.6,
  },
});
