import React from 'react';
import { Dimensions, Image, StyleSheet, TouchableOpacity, View } from 'react-native';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

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
    width: screenWidth,
    height: screenHeight * 0.08, // 8% of screen height
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  navItem: {
    alignItems: 'center',
    flex: 1,
    paddingVertical: screenHeight * 0.005, // 0.5% of screen height
  },
  icon: {
    width: screenWidth * 0.1, // 10% of screen width
    height: screenWidth * 0.1, // 10% of screen width
    tintColor: '#fff',
  },
  physicalIcon: {
    width: screenWidth * 0.125, // 12.5% of screen width
    height: screenWidth * 0.125, // 12.5% of screen width
    marginTop: screenHeight * 0.005, // 0.5% of screen height
  },
});

export default BottomNavigation;
