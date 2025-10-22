import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useRef, useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';

const PagesMenu = ({ hideOnTutorial = false }) => {
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [tapCount, setTapCount] = useState(0);
  const tapTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  
  // Triple tap detection
  const handleTripleTap = () => {
    if (tapCount === 2) {
      setIsHidden(false);
      setTapCount(0);
      if (tapTimeoutRef.current) {
        clearTimeout(tapTimeoutRef.current);
      }
    } else {
      setTapCount(prev => prev + 1);
      if (tapTimeoutRef.current) {
        clearTimeout(tapTimeoutRef.current);
      }
      tapTimeoutRef.current = setTimeout(() => {
        setTapCount(0);
      }, 500); // Reset tap count after 500ms
    }
  };
  
  const toggleMenu = () => {
    setIsMenuVisible(!isMenuVisible);
  };

  const navigateToScreen = (screenName: string) => {
    setIsMenuVisible(false);
    router.push(`/(tabs)/${screenName}` as any);
  };

  const hideMenu = () => {
    setIsMenuVisible(false);
    setIsHidden(true);
  };

  const menuItems = [
    { name: 'signInPage', title: 'Sign In Page', icon: 'log-in' },
    { name: 'tutorial', title: 'Tutorial', icon: 'school' },
    { name: 'startQuestions', title: 'Start Questions', icon: 'person' },
    { name: 'onboardingQuestions', title: 'Onboarding Questions', icon: 'help-circle' },
    { name: 'confirmation', title: 'Confirmation', icon: 'checkmark-circle' },
    { name: 'homePage', title: 'Home Page', icon: 'home-outline' },
    { name: 'hide', title: 'Hide Menu', icon: 'eye-off', isSpecial: true },
  ];

  return (
    <>
      {!hideOnTutorial && !isHidden && (
        <View style={styles.floatingMenu}>
          <Pressable onPress={toggleMenu} style={styles.menuButton}>
            <Ionicons name="menu" size={24} color="#000" />
          </Pressable>
        </View>
      )}

      {/* Triple tap detector when hidden */}
      {isHidden && (
        <Pressable style={styles.tripleTapDetector} onPress={handleTripleTap} />
      )}

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
                style={[styles.menuItem, item.isSpecial && styles.specialMenuItem]}
                onPress={() => {
                  if (item.isSpecial) {
                    hideMenu();
                  } else {
                    navigateToScreen(item.name);
                  }
                }}
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
    top: 50,
    right: 20,
    zIndex: 1000,
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
    fontSize: 18,
    fontWeight: '500',
    color: '#000000',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  menuItemText: {
    fontSize: 16,
    fontWeight: '400',
    color: '#000000',
    marginLeft: 12,
  },
  specialMenuItem: {
    backgroundColor: '#f0f0f0',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    marginTop: 8,
  },
  tripleTapDetector: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 999,
  },
});

export default PagesMenu;
