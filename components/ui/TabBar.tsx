import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Globals } from '../../constants/globals';

interface TabBarProps {
  activeTab: 'stretch' | 'relax' | 'complete';
  onTabChange: (tab: 'stretch' | 'relax' | 'complete') => void;
}

const TabBar: React.FC<TabBarProps> = ({ activeTab, onTabChange }) => {
  return (
    <View style={styles.container}>
      <Pressable
        style={[
          styles.tab,
          styles.firstTab,
          activeTab === 'stretch' && styles.activeTab
        ]}
        onPress={() => onTabChange('stretch')}
      >
        <Text 
          style={[
            styles.tabText,
            activeTab === 'stretch' ? styles.activeTabText : styles.inactiveTabText
          ]}
          numberOfLines={1}
        >
          Stretch
        </Text>
      </Pressable>
      
      <Pressable
        style={[
          styles.tab,
          styles.middleTab,
          activeTab === 'relax' && styles.activeTab
        ]}
        onPress={() => onTabChange('relax')}
      >
        <Text 
          style={[
            styles.tabText,
            activeTab === 'relax' ? styles.activeTabText : styles.inactiveTabText
          ]}
          numberOfLines={1}
        >
          Relax
        </Text>
      </Pressable>
      
      <Pressable
        style={[
          styles.tab,
          styles.lastTab,
          activeTab === 'complete' && styles.activeTab
        ]}
        onPress={() => onTabChange('complete')}
      >
        <Text 
          style={[
            styles.tabText,
            activeTab === 'complete' ? styles.activeTabText : styles.inactiveTabText
          ]}
          numberOfLines={1}
        >
          Complete
        </Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#EBE8F5',
    borderRadius: 12,
    overflow: 'hidden',
    marginVertical: 16,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EBE8F5',
  },
  firstTab: {
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
    borderRightWidth: 1,
    borderRightColor: '#D1D5DB',
  },
  middleTab: {
    // No border radius for middle tab
    borderLeftWidth: 1,
    borderLeftColor: '#D1D5DB',
    borderRightWidth: 1,
    borderRightColor: '#D1D5DB',
  },
  lastTab: {
    borderTopRightRadius: 12,
    borderBottomRightRadius: 12,
    borderLeftWidth: 1,
    borderLeftColor: '#D1D5DB',
  },
  activeTab: {
    backgroundColor: '#7A60D6',
  },
  tabText: {
    fontFamily: Globals.fonts.weights.bold,
    fontSize: 18,
    fontWeight: '700',
    lineHeight: 26,
    textAlign: 'center',
  },
  inactiveTabText: {
    color: '#564DA3',
  },
  activeTabText: {
    color: '#fff',
  },
});

export default TabBar;

