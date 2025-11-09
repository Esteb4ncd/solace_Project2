import { usePathname } from 'expo-router';
import React from 'react';
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

type NavItem = {
  id: string;
  label: string;
};

type BottomNavigationProps = {
  items?: NavItem[];
  onItemPress?: (itemId: string) => void;
};

const BottomNavigation = ({ 
  items = [
    { id: 'home', label: 'Home' },
    { id: 'physical', label: 'Physical' },
    { id: 'mental', label: 'Mental' },
    { id: 'account', label: 'Account' },
  ],
  onItemPress
}: BottomNavigationProps) => {
  const pathname = usePathname();
  
  const isActive = (itemId: string) => {
    if (itemId === 'home') {
      return pathname === '/(tabs)/homePage' || pathname === '/(tabs)/index' || pathname.includes('/homePage');
    } else if (itemId === 'physical') {
      return pathname === '/(tabs)/physicalHomePage' || pathname.includes('/physicalHomePage');
    } else if (itemId === 'mental') {
      return pathname === '/(tabs)/mentalHomePage' || pathname.includes('/mentalHomePage');
    } else if (itemId === 'account') {
      return pathname === '/(tabs)/signInPage' || pathname.includes('/signInPage');
    }
    return false;
  };

  const renderIcon = (itemId: string) => {
    const active = isActive(itemId);
    const iconSize = screenWidth * 0.065;
    const physicalIconSize = screenWidth * 0.08;

    if (itemId === 'home') {
      if (active) {
        return (
          <Svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none">
            <Path fillRule="evenodd" clipRule="evenodd" d="M21.1 6.55092L21.13 6.57492C21.667 6.98792 22 7.62792 22 8.33192V19.5879C22.0016 20.0354 21.9148 20.4788 21.7447 20.8927C21.5745 21.3066 21.3243 21.6829 21.0084 21.9998C20.6926 22.3168 20.3172 22.5684 19.9039 22.74C19.4906 22.9116 19.0475 22.9999 18.6 22.9999H5.40002C4.95252 22.9999 4.50941 22.9116 4.09612 22.74C3.68283 22.5684 3.30748 22.3168 2.99161 21.9998C2.67573 21.6829 2.42554 21.3066 2.25538 20.8927C2.08522 20.4788 1.99844 20.0354 2.00002 19.5879V8.33192C2.00002 7.62792 2.33302 6.98792 2.87002 6.57492L2.89902 6.55192L10.689 1.41992C11.0641 1.14732 11.5159 1.00049 11.9795 1.00049C12.4432 1.00049 12.895 1.14732 13.27 1.41992L21.1 6.55092ZM10 12.9999V20.9999H8.00002V12.7999C8.00002 11.8079 8.80802 10.9999 9.80002 10.9999H14.2C15.192 10.9999 16 11.8079 16 12.7999V20.9999H14V12.9999H10Z" fill="white"/>
          </Svg>
        );
      } else {
        return (
          <Svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none">
            <Path d="M15 21V13C15 12.7348 14.8946 12.4804 14.7071 12.2929C14.5196 12.1054 14.2652 12 14 12H10C9.73478 12 9.48043 12.1054 9.29289 12.2929C9.10536 12.4804 9 12.7348 9 13V21" stroke="#D3D0F3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <Path d="M3 9.99999C2.99993 9.70906 3.06333 9.42161 3.18579 9.15771C3.30824 8.8938 3.4868 8.65979 3.709 8.47199L10.709 2.47199C11.07 2.1669 11.5274 1.99951 12 1.99951C12.4726 1.99951 12.93 2.1669 13.291 2.47199L20.291 8.47199C20.5132 8.65979 20.6918 8.8938 20.8142 9.15771C20.9367 9.42161 21.0001 9.70906 21 9.99999V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V9.99999Z" stroke="#D3D0F3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </Svg>
        );
      }
    } else if (itemId === 'physical') {
      if (active) {
        return (
          <Svg width={physicalIconSize} height={physicalIconSize} viewBox="0 0 24 24" fill="none" style={styles.physicalIcon}>
            <Path d="M3 18.34C3 18.34 4 7.09 7 3L12 4L11 7.09H9V14.25H10C12 11.18 16.14 10.06 18.64 11.18C21.94 12.71 21.64 17.32 18.64 19.36C16.24 21 9 22.43 3 18.34Z" fill="white"/>
          </Svg>
        );
      } else {
        return (
          <Svg width={physicalIconSize} height={physicalIconSize} viewBox="0 0 24 24" fill="none" style={styles.physicalIcon}>
            <Path d="M7 7.76V16.25H11.08L11.68 15.34C12.84 13.55 14.93 12.75 16.47 12.75C17 12.75 17.45 12.84 17.79 13C18.7 13.41 18.95 14.18 19 14.74C19.08 15.87 18.5 17.03 17.5 17.71C16.6 18.33 14.44 19 11.87 19C10.12 19 7.61 18.69 5.12 17.3C5.41 14.85 6 10.88 7 7.76ZM7 3C4 7.09 3 18.34 3 18.34C5.9 20.31 9.08 21 11.87 21C14.86 21 17.39 20.21 18.64 19.36C21.64 17.32 21.94 12.71 18.64 11.18C18 10.89 17.26 10.75 16.47 10.75C14.17 10.75 11.5 11.96 10 14.25H9V7.09H11L12 4L7 3Z" fill="#D3D0F3"/>
          </Svg>
        );
      }
    } else if (itemId === 'mental') {
      if (active) {
        return (
          <Svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none">
            <Path d="M10.9998 2C12.9425 1.9997 14.8189 2.70631 16.2789 3.98794C17.7388 5.26957 18.6825 7.03865 18.9338 8.965L21.1838 12.504C21.3318 12.737 21.3018 13.084 20.9588 13.232L18.9998 14.07V17C18.9998 17.5304 18.7891 18.0391 18.414 18.4142C18.039 18.7893 17.5303 19 16.9998 19H15.0008L14.9998 22H5.99983V18.306C5.99983 17.126 5.56383 16.009 4.75483 15.001C3.81253 13.8245 3.22181 12.4056 3.05072 10.908C2.87964 9.41036 3.13515 7.89486 3.78782 6.53611C4.44049 5.17737 5.46377 4.03066 6.73974 3.22811C8.01571 2.42557 9.49246 1.99985 10.9998 2ZM10.4698 7.763C10.1398 7.44416 9.69782 7.26768 9.23898 7.27157C8.78013 7.27546 8.34117 7.45942 8.01664 7.78382C7.69211 8.10822 7.50798 8.5471 7.5039 9.00595C7.49982 9.46479 7.67612 9.90688 7.99483 10.237L10.9998 13.243L14.0048 10.237C14.1719 10.0755 14.3052 9.8824 14.3969 9.66888C14.4886 9.45535 14.5368 9.22571 14.5388 8.99334C14.5407 8.76098 14.4964 8.53055 14.4084 8.3155C14.3203 8.10045 14.1904 7.90509 14.026 7.74081C13.8617 7.57653 13.6663 7.44662 13.4512 7.35868C13.2361 7.27073 13.0056 7.2265 12.7733 7.22856C12.5409 7.23063 12.3113 7.27895 12.0978 7.37071C11.8843 7.46247 11.6912 7.59582 11.5298 7.763L10.9998 8.293L10.4698 7.763Z" fill="white"/>
          </Svg>
        );
      } else {
        return (
          <Svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none">
            <Path d="M10.9998 2C12.9425 1.9997 14.8189 2.70631 16.2789 3.98794C17.7388 5.26957 18.6825 7.03865 18.9338 8.965L21.1838 12.504C21.3318 12.737 21.3018 13.084 20.9588 13.232L18.9998 14.07V17C18.9998 17.5304 18.7891 18.0391 18.414 18.4142C18.039 18.7893 17.5303 19 16.9998 19H15.0008L14.9998 22H5.99983V18.306C5.99983 17.126 5.56383 16.009 4.75483 15.001C3.81253 13.8245 3.22181 12.4056 3.05072 10.908C2.87964 9.41036 3.13515 7.89486 3.78782 6.53611C4.44049 5.17737 5.46377 4.03066 6.73974 3.22811C8.01571 2.42557 9.49246 1.99985 10.9998 2ZM10.9998 4C9.86941 3.99995 8.76197 4.31925 7.80509 4.9211C6.84821 5.52295 6.08081 6.38287 5.59131 7.40181C5.1018 8.42075 4.9101 9.55724 5.03828 10.6804C5.16646 11.8035 5.60932 12.8676 6.31583 13.75C7.40983 15.114 7.99983 16.667 7.99983 18.306V20H12.9998L13.0018 17H16.9998V12.752L18.5498 12.088L17.0068 9.663L16.9498 9.221C16.7607 7.77682 16.0528 6.45074 14.958 5.49008C13.8632 4.52943 12.4563 3.99981 10.9998 4ZM10.4698 7.763L10.9998 8.293L11.5298 7.763C11.8598 7.44416 12.3018 7.26768 12.7607 7.27157C13.2195 7.27546 13.6585 7.45942 13.983 7.78382C14.3075 8.10822 14.4917 8.5471 14.4958 9.00595C14.4998 9.46479 14.3235 9.90688 14.0048 10.237L10.9998 13.243L7.99483 10.237C7.82772 10.0755 7.69444 9.8824 7.60277 9.66888C7.5111 9.45535 7.46287 9.22571 7.4609 8.99334C7.45892 8.76098 7.50325 8.53055 7.59128 8.3155C7.67932 8.10045 7.8093 7.90509 7.97365 7.74081C8.13799 7.57653 8.33341 7.44662 8.54849 7.35868C8.76358 7.27073 8.99403 7.2265 9.22639 7.22856C9.45875 7.23063 9.68838 7.27895 9.90187 7.37071C10.1154 7.46247 10.3084 7.59582 10.4698 7.763Z" fill="#D3D0F3"/>
          </Svg>
        );
      }
    } else if (itemId === 'account') {
      if (active) {
        return (
          <Svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none">
            <Path d="M12 4C13.0609 4 14.0783 4.42143 14.8284 5.17157C15.5786 5.92172 16 6.93913 16 8C16 9.06087 15.5786 10.0783 14.8284 10.8284C14.0783 11.5786 13.0609 12 12 12C10.9391 12 9.92172 11.5786 9.17157 10.8284C8.42143 10.0783 8 9.06087 8 8C8 6.93913 8.42143 5.92172 9.17157 5.17157C9.92172 4.42143 10.9391 4 12 4ZM12 14C16.42 14 20 15.79 20 18V20H4V18C4 15.79 7.58 14 12 14Z" fill="white"/>
          </Svg>
        );
      } else {
        return (
          <Svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none">
            <Path d="M12 4C13.0609 4 14.0783 4.42143 14.8284 5.17157C15.5786 5.92172 16 6.93913 16 8C16 9.06087 15.5786 10.0783 14.8284 10.8284C14.0783 11.5786 13.0609 12 12 12C10.9391 12 9.92172 11.5786 9.17157 10.8284C8.42143 10.0783 8 9.06087 8 8C8 6.93913 8.42143 5.92172 9.17157 5.17157C9.92172 4.42143 10.9391 4 12 4ZM12 6C11.4696 6 10.9609 6.21071 10.5858 6.58579C10.2107 6.96086 10 7.46957 10 8C10 8.53043 10.2107 9.03914 10.5858 9.41421C10.9609 9.78929 11.4696 10 12 10C12.5304 10 13.0391 9.78929 13.4142 9.41421C13.7893 9.03914 14 8.53043 14 8C14 7.46957 13.7893 6.96086 13.4142 6.58579C13.0391 6.21071 12.5304 6 12 6ZM12 13C14.67 13 20 14.33 20 17V20H4V17C4 14.33 9.33 13 12 13ZM12 14.9C9.03 14.9 5.9 16.36 5.9 17V18.1H18.1V17C18.1 16.36 14.97 14.9 12 14.9Z" fill="#D3D0F3"/>
          </Svg>
        );
      }
    }
    return null;
  };

  return (
    <View style={styles.container}>
      {items.map((item) => {
        const active = isActive(item.id);
        return (
          <TouchableOpacity
            key={item.id}
            style={styles.navItem}
            onPress={() => onItemPress?.(item.id)}
            activeOpacity={0.7}
          >
            <View style={styles.iconContainer}>
              {renderIcon(item.id)}
            </View>
            <Text style={[styles.label, active && styles.labelActive]}>
              {item.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#443E82',
    width: screenWidth,
    height: screenHeight * 0.1, // 10% of screen height
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 0,
    paddingHorizontal: screenWidth * 0.05,
  },
  navItem: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  iconContainer: {
    height: screenWidth * 0.08,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  icon: {
    width: screenWidth * 0.1, // 10% of screen width
    height: screenWidth * 0.1, // 10% of screen width
    tintColor: '#fff',
  },
  physicalIcon: {
    width: screenWidth * 0.08,
    height: screenWidth * 0.08,
  },
  label: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
    fontFamily: 'System',
    height: 16,
    lineHeight: 16,
  },
  labelActive: {
    color: '#fff',
  },
});

export default BottomNavigation;
