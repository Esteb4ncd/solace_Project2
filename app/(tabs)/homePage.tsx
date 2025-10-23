import BottomNavigation from '@/components/ui/BottomNavigation';
import Header from '@/components/ui/Header';
import StatusBar from '@/components/ui/StatusBar';
import TaskCard from '@/components/ui/TaskCard';
import XPBar from '@/components/ui/XPBar';
import { spacing } from '@/constants/styles';
import { Colors } from '@/constants/theme';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import { Image, Keyboard, ScrollView, StyleSheet, Text, TouchableWithoutFeedback, View } from 'react-native';
import { RetrieveResponse } from 'roughlyai';

const HomePage = () => {
  const [userName, setUserName] = useState("Solly");
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempUserName, setTempUserName] = useState("Solly");
  
  const [dailyTasks, setDailyTasks] = useState<any[]>([
    // { id: '1', title: 'Back Relief', xpAmount: 10, xpColor: '#7267D9', isCompleted: false },
    // { id: '2', title: 'Shoulder Relief', xpAmount: 10, xpColor: '#7267D9', isCompleted: false },
    // { id: '3', title: 'Joint Relief', xpAmount: 10, xpColor: '#7267D9', isCompleted: false },
  ]);

  const [additionalTasks] = useState([
    { id: '4', title: 'Stress Relief', xpAmount: 5, xpColor: '#7267D9', isCompleted: false },
  ]);

  const GetStretches = async()=>{
    try {
      const _muscles = await AsyncStorage.getItem('muscles');
      const _resp = await fetch("https://m3rcwp4vofeta3kqelrykbgosi0rswzn.lambda-url.ca-central-1.on.aws/", {
        method: "POST",
        body: JSON.stringify({
          prompt: `Using "stretching.pdf", suggest 10 exercises to help improve these muscles, make educated guesses:
          ${_muscles}
          
          Return in an array format [], do not include \`\`\`json.`,
          project_name: "solace"
        })
      });

      const _json_string = await _resp.json();
      const _json: { url: string } = JSON.parse(_json_string);

      console.log("what is _json", _json.url);
      // console.log("url", _url)
      const _report: any = await RetrieveResponse(_json.url);
      const _daily_tasks = JSON.parse(_report.answer).map((o:any, ind:number)=>({
        id: ind+1, title: o, xpAmount: 10, xpColor: '#7267D9', isCompleted: false
      }))
      setDailyTasks(_daily_tasks);
    } catch (e: any) {
      console.log("fail parse or retrieve")
    }
  }
  useEffect(()=>{
    GetStretches();
  }, [])
  const handleTaskPress = (taskId: string) => {
    setDailyTasks(tasks =>
      tasks.map(task =>
        task.id === taskId ? { ...task, isCompleted: !task.isCompleted } : task
      )
    );
  };

  const handleNavPress = (itemId: string) => {
    console.log(`Navigating to ${itemId}`);
  };

  const handleEditPress = () => {
    setIsEditingName(true);
    setTempUserName(userName);
  };

  const handleSaveName = () => {
    setUserName(tempUserName);
    setIsEditingName(false);
    Keyboard.dismiss();
  };

  const handleCancelEdit = () => {
    setTempUserName(userName);
    setIsEditingName(false);
    Keyboard.dismiss();
  };

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  return (
    <TouchableWithoutFeedback onPress={dismissKeyboard}>
      <View style={styles.container}>
        <StatusBar />
        
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <View style={styles.contentContainer}>
            <Header 
              userName={userName}
              streakCount={1}
              onEditPress={handleEditPress}
              isEditingName={isEditingName}
              tempUserName={tempUserName}
              onUserNameChange={setTempUserName}
              onSaveName={handleSaveName}
              onCancelEdit={handleCancelEdit}
            />

          {/* Avatar Section */}
          <View style={styles.avatarSection}>
            <Image 
              source={require('@/assets/hompageAssets/SollySitting.png')} 
              style={styles.avatar}
            />
          </View>

          <View style={styles.xpBarContainer}>
            <XPBar 
              currentProgress={0}
              totalProgress={50}
              level={1}
            />
          </View>

          {/* Daily Checklist Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Daily Checklist</Text>
            {dailyTasks.map((task) => (
              <TaskCard
                key={task.id}
                title={task.title}
                xpAmount={task.xpAmount}
                xpColor={task.xpColor}
                isCompleted={task.isCompleted}
                onPress={() => handleTaskPress(task.id)}
              />
            ))}
          </View>

          {/* Additional XP Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Need more xp? Try these</Text>
            {additionalTasks.map((task) => (
              <TaskCard
                key={task.id}
                title={task.title}
                xpAmount={task.xpAmount}
                xpColor={task.xpColor}
                isCompleted={task.isCompleted}
                onPress={() => handleTaskPress(task.id)}
              />
            ))}
          </View>

          {/* Bottom spacing for navigation */}
          <View style={styles.bottomSpacing} />
        </View>
      </ScrollView>

      <BottomNavigation onItemPress={handleNavPress} />
    </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 16, // 16px left/right margins
  },
  avatarSection: {
    alignItems: 'center',
    paddingVertical: 8, // Reduced from 32px to 8px
  },
  avatar: {
    width: 150,
    height: 150,
    resizeMode: 'contain',
  },
  xpBarContainer: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  section: {
    paddingVertical: 16, // 16px margin from element above
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 8, // 8px margin between checklist items
  },
  bottomSpacing: {
    height: spacing.xxxl,
  },
});

export default HomePage;
