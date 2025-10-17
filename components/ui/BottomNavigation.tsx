import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type NavItem = {
  id: string;
  label: string;
  icon: string;
  isActive?: boolean;
};

type BottomNavigationProps = {
  items?: NavItem[];
  onItemPress?: (itemId: string) => void;
};

const BottomNavigation = ({ 
  items = [
    { id: 'home', label: 'Home', icon: '🏠', isActive: true },
    { id: 'physical', label: 'Physical', icon: '💪', isActive: false },
    { id: 'mental', label: 'Mental', icon: '🧠', isActive: false },
    { id: 'account', label: 'Account', icon: '👤', isActive: false },
  ],
  onItemPress
}: BottomNavigationProps) => {
  return (
    <View style={styles.container}>
      {items.map((item) => (
        <TouchableOpacity
          key={item.id}
          style={styles.navItem}
          onPress={() => onItemPress?.(item.id)}
          activeOpacity={0.7}
        >
          <Text style={styles.icon}>{item.icon}</Text>
          <Text style={styles.label}>{item.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#8B5CF6',
    paddingVertical: 12,
    paddingHorizontal: 8,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  navItem: {
    alignItems: 'center',
    flex: 1,
    paddingVertical: 4,
  },
  icon: {
    fontSize: 20,
    marginBottom: 4,
  },
  label: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '500',
  },
});

export default BottomNavigation;
