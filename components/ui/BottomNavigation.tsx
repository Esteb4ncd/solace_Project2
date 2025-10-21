import React from 'react';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';

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
    { id: 'home', label: 'Home', iconSource: require('@/assets/navbarSvgs/Home-Icon.png'), isActive: true },
    { id: 'physical', label: 'Physical', iconSource: require('@/assets/navbarSvgs/Physical-Icon.png'), isActive: false },
    { id: 'mental', label: 'Mental', iconSource: require('@/assets/navbarSvgs/Mental-Icon.png'), isActive: false },
    { id: 'account', label: 'Account', iconSource: require('@/assets/navbarSvgs/Account-Icon.png'), isActive: false },
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
          <Image 
            source={item.iconSource} 
            style={[
              styles.icon,
              item.id === 'physical' && styles.physicalIcon
            ]} 
          />
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#443E82',
    width: 394,
    height: 67,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  navItem: {
    alignItems: 'center',
    flex: 1,
    paddingVertical: 4,
  },
  icon: {
    width: 40,
    height: 40,
    tintColor: '#fff',
  },
  physicalIcon: {
    width: 50,
    height: 50,
    marginTop: 4,
  },
});

export default BottomNavigation;
