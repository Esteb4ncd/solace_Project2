import BottomNavigation from '@/components/ui/BottomNavigation';
import CategoryCard from '@/components/ui/CategoryCard';
import StatusBar from '@/components/ui/StatusBar';
import XPBar from '@/components/ui/XPBar';
import { Globals } from '@/constants/globals';
import { Colors } from '@/constants/theme';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

const MentalHomePage = () => {
  const [userName] = useState("Sarah");
  
  const handleNavPress = (itemId: string) => {
    console.log(`Navigating to ${itemId}`);
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

          {/* Break For you Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Break For you</Text>
              <Text style={styles.xpText}>5xp</Text>
            </View>
            
            <CategoryCard 
              title="Take a breath"
              xpAmount={5}
              onPress={() => handleExercisePress("Take a breath")}
            />
            <CategoryCard 
              title="Dissociate"
              xpAmount={5}
              onPress={() => handleExercisePress("Dissociate")}
            />
          </View>

          {/* Focus Sounds Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Focus Sounds</Text>
              <Text style={styles.xpText}>1xp</Text>
            </View>
            
            <CategoryCard 
              title="White Noise"
              xpAmount={1}
              onPress={() => handleExercisePress("White Noise")}
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
    width: 393,
    height: 852,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: Globals.spacing.medium,
  },
  headerSection: {
    paddingTop: 20,
    paddingBottom: 24,
  },
  progressContainer: {
    marginBottom: Globals.spacing.medium,
  },
  greeting: {
    ...Globals.fonts.styles.header1,
  },
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    ...Globals.fonts.styles.header2Bold,
  },
  xpText: {
    ...Globals.fonts.styles.header2Bold,
    color: '#7267D9',
  },
  bottomSpacing: {
    height: 100,
  },
});

export default MentalHomePage;
