import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native';

type NavItem = {
  id: string;
  label: string;
  iconSource: any;
  isActive?: boolean;
};

type BottomNavigationProps = {
  items?: NavItem[];
  onItemPress?: (itemId: string) => void;
};

const BottomNavigation = ({ 
  items = [
    { id: 'home', label: 'Home', iconSource: require('@/assets/navbar_svgs/Home-Icon.png'), isActive: true },
    { id: 'physical', label: 'Physical', iconSource: require('@/assets/navbar_svgs/Physical-Icon.png'), isActive: false },
    { id: 'mental', label: 'Mental', iconSource: require('@/assets/navbar_svgs/Mental-Icon.png'), isActive: false },
    { id: 'account', label: 'Account', iconSource: require('@/assets/navbar_svgs/Account-Icon.png'), isActive: false },
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
          <Image source={item.iconSource} style={styles.icon} />
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
    width: 24,
    height: 24,
    marginBottom: 4,
    tintColor: '#fff',
  },
  label: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '500',
  },
});

export default BottomNavigation;
