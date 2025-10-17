import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Modal, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { Globals } from '../constants/globals';

const CustomHeader = () => {
  const [isMenuVisible, setIsMenuVisible] = useState(false);

  const toggleMenu = () => {
    setIsMenuVisible(!isMenuVisible);
  };

  const navigateToScreen = (screenName: string) => {
    setIsMenuVisible(false);
    router.push(`/(tabs)/${screenName}`);
  };

  const menuItems = [
    { name: 'index', title: 'Home', icon: 'home' },
    { name: 'startQuestions', title: 'Start Questions', icon: 'person' },
    { name: 'onboardingQuestions', title: 'Questions', icon: 'help-circle' },
    { name: 'ai_onboarding', title: 'AI Onboarding', icon: 'chatbubbles' },
  ];

  return (
    <>
      <View style={styles.floatingMenu}>
        <Pressable onPress={toggleMenu} style={styles.menuButton}>
          <Ionicons name="menu" size={24} color="#000" />
        </Pressable>
      </View>

      <Modal
        visible={isMenuVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsMenuVisible(false)}
      >
        <Pressable 
          style={styles.modalOverlay} 
          onPress={() => setIsMenuVisible(false)}
        >
          <View style={styles.menuContainer}>
            <View style={styles.menuHeader}>
              <Text style={styles.menuTitle}>Navigation</Text>
              <Pressable onPress={() => setIsMenuVisible(false)}>
                <Ionicons name="close" size={24} color="#000" />
              </Pressable>
            </View>
            
            {menuItems.map((item) => (
              <Pressable
                key={item.name}
                style={styles.menuItem}
                onPress={() => navigateToScreen(item.name)}
              >
                <Ionicons name={item.icon as any} size={20} color="#000" />
                <Text style={styles.menuItemText}>{item.title}</Text>
              </Pressable>
            ))}
          </View>
        </Pressable>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  floatingMenu: {
    position: 'absolute',
    top: Platform.OS === 'web' ? 20 : 50, // Closer to top on web
    right: 20,
    zIndex: 1000,
    // Ensure proper positioning on web
    ...(Platform.OS === 'web' && {
      maxWidth: 393,
      right: 'calc(50% - 196.5px + 20px)', // Center relative to iPhone 16 width
    }),
  },
  menuButton: {
    padding: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    paddingTop: 100,
    paddingRight: 20,
  },
  menuContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    minWidth: 200,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  menuHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  menuTitle: {
    fontFamily: Globals.fonts.weights.medium,
    fontSize: Globals.fonts.sizes.header3,
    color: Globals.colors.textDark,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  menuItemText: {
    fontFamily: Globals.fonts.weights.regular,
    fontSize: Globals.fonts.sizes.body,
    color: Globals.colors.textDark,
    marginLeft: 12,
  },
});

export default CustomHeader;
