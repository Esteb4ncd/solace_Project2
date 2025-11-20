// import BottomNavigation from '@/components/ui/BottomNavigation';
// import CategoryCard from '@/components/ui/CategoryCard';
// import ExerciseButton from "../../components/ui/ExerciseButton";

// import StatusBar from '@/components/ui/StatusBar';
// import XPBar from '@/components/ui/XPBar';
// import { Globals } from '@/constants/globals';
// import { Colors } from '@/constants/theme';
// import { router } from 'expo-router';
// import React, { useState } from 'react';
// import { Dimensions, ScrollView, Image,  StyleSheet, Text, View } from 'react-native';

// const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// const PhysicalHomePage = () => {
//   const [userName] = useState("Sarah");
  
//   const handleNavPress = (itemId: string) => {
//     switch (itemId) {
//       case 'home':
//         router.push('/(tabs)/homePage');
//         break;
//       case 'physical':
//         // Already on physical page
//         break;
//       case 'mental':
//         router.push('/(tabs)/mentalHomePage');
//         break;
//       case 'account':
//         router.push('/(tabs)/accountSettingsPage');
//         break;
//       default:
//         console.log(`Navigating to ${itemId}`);
//     }
//   };

//   const handleExercisePress = (exerciseName: string) => {
//     console.log(`Starting exercise: ${exerciseName}`);
//   };

//   return (
//     <View style={styles.container}>
//       <StatusBar />
      
//       <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
//         <View style={styles.contentContainer}>
//           {/* Header with Progress Bar and Greeting */}
//           <View style={styles.headerSection}>
//             <View style={styles.progressContainer}>
//               <XPBar 
//                 totalProgress={50}
//                 level={1}
//               />
//             </View>
//             <Text style={styles.greeting}>Hey, {userName}</Text>
//           </View>

//           {/* For you Section */}
//           <View style={styles.section}>
//             <View style={styles.sectionHeader}>
//               <Text style={styles.sectionTitle}>For you</Text>
//               <Text style={styles.xpText}>10xp</Text>
//             </View>
            
//             <CategoryCard 
//               title="Back"
//               xpAmount={10}
//               onPress={() => handleExercisePress("Back")}
//             />
//                             <ExerciseButton
//                   title="Deep Breathing"
//                   image={
//                     <Image
//                       source={require("../../assets/images/Breathing03.png")}
//                       style={styles.exerciseImage}
//                       resizeMode="contain"
//                     />
//                   }
//                   xp={3}
//                   onPress={() => handleExercisePress("Deep Breathing")}
//                 />
//             <CategoryCard 
//               title="Shoulder"
//               xpAmount={10}
//               onPress={() => handleExercisePress("Shoulder")}
//             />
//             <CategoryCard 
//               title="Wrists"
//               xpAmount={10}
//               onPress={() => handleExercisePress("Wrists")}
//             />
//           </View>

//           {/* See all Section */}
//           <View style={styles.section}>
//             <View style={styles.sectionHeader}>
//               <Text style={styles.sectionTitle}>See all</Text>
//               <Text style={styles.xpText}>5xp</Text>
//             </View>
            
//             <CategoryCard 
//               title="Explore Areas"
//               xpAmount={5}
//               onPress={() => handleExercisePress("Explore Areas")}
//             />
//           </View>

//           {/* Bottom spacing for navigation */}
//           <View style={styles.bottomSpacing} />
//         </View>
//       </ScrollView>

//       <BottomNavigation onItemPress={handleNavPress} />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: Colors.light.background,
//     width: screenWidth,
//     height: screenHeight,
//   },
//   scrollView: {
//     flex: 1,
//   },
//   contentContainer: {
//     paddingHorizontal: screenWidth * 0.04, // 4% of screen width
//   },
//   headerSection: {
//     paddingTop: screenHeight * 0.025, // 2.5% of screen height
//     paddingBottom: screenHeight * 0.03, // 3% of screen height
//   },
//   progressContainer: {
//     marginBottom: screenHeight * 0.02, // 2% of screen height
//   },
//   greeting: {
//     ...Globals.fonts.styles.header1,
//   },
//   section: {
//     marginBottom: screenHeight * 0.04, // 4% of screen height
//   },
//   sectionHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: screenHeight * 0.015, // 1.5% of screen height
//   },
//   sectionTitle: {
//     ...Globals.fonts.styles.header2Bold,
//   },
//   xpText: {
//     ...Globals.fonts.styles.header2Bold,
//     color: '#7267D9',
//   },
//   bottomSpacing: {
//     height: screenHeight * 0.12, // 12% of screen height
//   },
// });

// export default PhysicalHomePage;

import BottomNavigation from '@/components/ui/BottomNavigation';
import { Globals } from "@/constants/globals";
import { Colors } from "@/constants/theme";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import ExerciseChip from "../../components/ui/ExerciseChip";
import XPBar from "../../components/ui/XPBar";
import GeneralTaskCard from "../../components/taskCards/generalTaskCard";
import ExerciseButton from "../../components/ui/ExerciseButton";
import StatusBar from "../../components/ui/StatusBar";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

const PhysicalHomePage = () => {
  const [userName] = useState("Sarah");
  const [selectedCategory, setSelectedCategory] = useState("foryou");

  const handleNavPress = (itemId: string) => {
    switch (itemId) {
      case 'home':
        router.push('/(tabs)/homePage');
        break;
      case 'physical':
        // already on physical page
        break;
      case 'mental':
        router.push('/(tabs)/mentalHomePage');
        break;
      case 'account':
        router.push('/(tabs)/accountSettingsPage');
        break;
      default:
        console.log(`Navigating to ${itemId}`);
    }
  };

  const handleExercisePress = (exerciseName: string) => {
    console.log(`Starting physical exercise: ${exerciseName}`);
    router.push({
      pathname: "/(tabs)/physicalExercisePage",
      params: { exerciseType: exerciseName },
    });
  };

  const allExercises = [
    "Back",
    "Shoulder",
    "Chest",
    "Hand",
    "Hip",
    "Legs",
  ];

  return (
    <View style={styles.container}>
      <StatusBar />

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.contentContainer}>

          {/* Header */}
          <View style={styles.headerSection}>
            <Text style={styles.greeting}>Hey, {userName}</Text>
            <View style={styles.progressContainer}>
              <XPBar totalProgress={50} level={1} />
            </View>
          </View>

          {/* Category Tabs */}
          <View style={styles.exerciseChipContainer}>
            <ExerciseChip
              categories={["For You", "See All"]}
              onSelectionChange={(index: number, category: string) => {
                setSelectedCategory(category.toLowerCase().replace(" ", ""));
              }}
            />
          </View>

          {/* Conditional Content */}
          {selectedCategory === "foryou" && (
            <View style={styles.section}>
              <GeneralTaskCard
                title="Daily Stretch"
                description="Quick warm-ups to reset your body"
                time="5 min"
              />

              <GeneralTaskCard
                title="Reduce Body Stiffness"
                description="Loosen up your joints with guided movements"
                time="7 min"
              />
            </View>
          )}

          {selectedCategory === "seeall" && (
            <View style={styles.section}>
              {allExercises.map((exercise) => (
                <ExerciseButton
                  key={exercise}
                  title={exercise}
                  onPress={() => handleExercisePress(exercise)}
                />
              ))}
            </View>
          )}
        </View>
      </ScrollView>

      <BottomNavigation onPress={handleNavPress} activeTab="physical" />
    </View>
  );
};

export default PhysicalHomePage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 100,
  },
  headerSection: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  greeting: {
    fontSize: 28,
    fontWeight: "600",
    color: Colors.textPrimary,
  },
  progressContainer: {
    marginTop: 10,
    width: "65%",
  },
  exerciseChipContainer: {
    marginTop: 25,
    paddingHorizontal: 20,
  },
  section: {
    marginTop: 20,
    paddingHorizontal: 20,
    gap: 15,
  },
});
