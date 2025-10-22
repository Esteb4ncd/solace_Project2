import BottomNavigation from '@/components/ui/BottomNavigation';
import CategoryCard from '@/components/ui/CategoryCard';
import StatusBar from '@/components/ui/StatusBar';
import XPBar from '@/components/ui/XPBar';
import { Globals } from '@/constants/globals';
import { Colors } from '@/constants/theme';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Dimensions, ScrollView, StyleSheet, Text, View } from 'react-native';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const PhysicalHomePage = () => {
  const [userName] = useState("Sarah");
  
  const handleNavPress = (itemId: string) => {
    switch (itemId) {
      case 'home':
        router.push('/(tabs)/homePage');
        break;
      case 'physical':
        // Already on physical page
        break;
      case 'mental':
        router.push('/(tabs)/mentalHomePage');
        break;
      case 'account':
        router.push('/(tabs)/signInPage');
        break;
      default:
        console.log(`Navigating to ${itemId}`);
    }
  };

  const handleExercisePress = (exerciseName: string) => {
    console.log(`Starting exercise: ${exerciseName}`);
  };

  return (
    <View style={styles.container}>
      <StatusBar />
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.contentContainer}>
          {/* Header with Progress Bar and Greeting */}
          <View style={styles.headerSection}>
            <View style={styles.progressContainer}>
              <XPBar 
                totalProgress={50}
                level={1}
              />
            </View>
            <Text style={styles.greeting}>Hey, {userName}</Text>
          </View>

          {/* For you Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>For you</Text>
              <Text style={styles.xpText}>10xp</Text>
            </View>
            
            <CategoryCard 
              title="Back"
              xpAmount={10}
              onPress={() => handleExercisePress("Back")}
            />
            <CategoryCard 
              title="Shoulder"
              xpAmount={10}
              onPress={() => handleExercisePress("Shoulder")}
            />
            <CategoryCard 
              title="Wrists"
              xpAmount={10}
              onPress={() => handleExercisePress("Wrists")}
            />
          </View>

          {/* See all Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>See all</Text>
              <Text style={styles.xpText}>5xp</Text>
            </View>
            
            <CategoryCard 
              title="Explore Areas"
              xpAmount={5}
              onPress={() => handleExercisePress("Explore Areas")}
            />
          </View>

          {/* Bottom spacing for navigation */}
          <View style={styles.bottomSpacing} />
        </View>
      </ScrollView>

      <BottomNavigation onItemPress={handleNavPress} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
    width: screenWidth,
    height: screenHeight,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: screenWidth * 0.04, // 4% of screen width
  },
  headerSection: {
    paddingTop: screenHeight * 0.025, // 2.5% of screen height
    paddingBottom: screenHeight * 0.03, // 3% of screen height
  },
  progressContainer: {
    marginBottom: screenHeight * 0.02, // 2% of screen height
  },
  greeting: {
    ...Globals.fonts.styles.header1,
  },
  section: {
    marginBottom: screenHeight * 0.04, // 4% of screen height
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: screenHeight * 0.015, // 1.5% of screen height
  },
  sectionTitle: {
    ...Globals.fonts.styles.header2Bold,
  },
  xpText: {
    ...Globals.fonts.styles.header2Bold,
    color: '#7267D9',
  },
  bottomSpacing: {
    height: screenHeight * 0.12, // 12% of screen height
  },
});

export default PhysicalHomePage;
