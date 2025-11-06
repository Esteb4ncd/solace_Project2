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
        style={[styles.tab, activeTab === 'stretch' && styles.activeTab]}
        onPress={() => onTabChange('stretch')}
      >
        <Text style={[styles.tabText, activeTab === 'stretch' && styles.activeTabText]}>
          Stretch
        </Text>
      </Pressable>
      
      <Pressable
        style={[styles.tab, activeTab === 'relax' && styles.activeTab]}
        onPress={() => onTabChange('relax')}
      >
        <Text style={[styles.tabText, activeTab === 'relax' && styles.activeTabText]}>
          Relax
        </Text>
      </Pressable>
      
      <Pressable
        style={[styles.tab, activeTab === 'complete' && styles.activeTab]}
        onPress={() => onTabChange('complete')}
      >
        <Text style={[styles.tabText, activeTab === 'complete' && styles.activeTabText]}>
          Complete
        </Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 4,
    marginVertical: 16,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeTab: {
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  tabText: {
    ...Globals.fonts.styles.body,
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  activeTabText: {
    color: '#7267D9',
    fontWeight: '700',
  },
});

export default TabBar;

