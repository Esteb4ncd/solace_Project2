import { router } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { Dimensions, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';
import BackButton from '../../components/ui/BackButton';
import StatusBar from '../../components/ui/StatusBar';
import { Globals } from '../../constants/globals';
import { useExerciseContext } from '../../contexts/ExerciseContext';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export default function StreakPage() {
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const { completedExercises, getStreakCount, isStreakExtendedToday } = useExerciseContext();
  const streakCount = getStreakCount();
  const streakExtended = isStreakExtendedToday();
  const iconColor = streakExtended ? '#C2E273' : '#9E9E9E'; // Green if extended, gray if not

  // Calculate streak days for the current month
  const streakDays = useMemo(() => {
    if (streakCount === 0) return [];

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayTime = today.getTime();

    // Get unique dates when exercises were completed
    const dates = completedExercises.map(ex => {
      const date = new Date(ex.completedAt);
      date.setHours(0, 0, 0, 0);
      return date.getTime();
    });

    const uniqueDates = Array.from(new Set(dates)).sort((a, b) => b - a);

    // Calculate consecutive days starting from today
    const streakDates: number[] = [];
    let currentDate = todayTime;
    let dateIndex = 0;

    while (dateIndex < uniqueDates.length) {
      const dateTime = uniqueDates[dateIndex];
      
      if (dateTime === currentDate) {
        streakDates.push(currentDate);
        currentDate -= 24 * 60 * 60 * 1000; // Subtract one day
        dateIndex++;
      } else if (dateTime < currentDate) {
        break;
      } else {
        dateIndex++;
      }
    }

    // Filter dates that are in the current month and year
    return streakDates
      .map(time => new Date(time))
      .filter(date => date.getMonth() === currentMonth && date.getFullYear() === currentYear)
      .map(date => date.getDate());
  }, [completedExercises, currentMonth, currentYear, streakCount]);

  const handleBack = () => {
    router.push('/(tabs)/homePage');
  };

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (month: number, year: number) => {
    return new Date(year, month, 1).getDay();
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentMonth, currentYear);
    const firstDay = getFirstDayOfMonth(currentMonth, currentYear);
    const days = [];

    // Get today's date
    const today = new Date();
    const todayDate = today.getDate();
    const todayMonth = today.getMonth();
    const todayYear = today.getFullYear();

    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<View key={`empty-${i}`} style={styles.calendarDay} />);
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const isStreakDay = streakDays.includes(day);
      const isToday = day === todayDate && currentMonth === todayMonth && currentYear === todayYear;
      days.push(
        <View
          key={day}
          style={[
            styles.calendarDay,
            isStreakDay && styles.streakDay,
            isToday && styles.todayDay
          ]}
        >
          <Text style={[
            styles.calendarDayText,
            isStreakDay && styles.streakDayText,
            isToday && styles.todayDayText
          ]}>
            {day}
          </Text>
        </View>
      );
    }

    return days;
  };

  return (
    <View style={styles.container}>
      <StatusBar />
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <BackButton onPress={handleBack} style={styles.backButton} />
          <Text style={styles.headerTitle}>Streak</Text>
          <View style={styles.headerSpacer} />
        </View>

        {/* Streak Display */}
        <View style={styles.streakDisplay}>
          <View style={[styles.lightningCircle, { backgroundColor: iconColor }]}>
            <Svg width={100} height={100} viewBox="0 0 24 24" fill="none">
              <Path
                d="M12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2ZM11.8037 3.89062C11.6075 3.8476 11.42 4.25247 11.0459 5.06055L8.31445 10.96C7.72284 12.2378 7.42776 12.8774 7.72266 13.3389C8.01776 13.7999 8.72191 13.7998 10.1299 13.7998H11.5C11.7356 13.7998 11.8535 13.7999 11.9268 13.873C12 13.9462 12 14.0642 12 14.2998V18.7295C12 19.6202 12.0001 20.0662 12.1963 20.1094C12.3925 20.1524 12.58 19.7475 12.9541 18.9395L15.6855 13.04C16.2772 11.7622 16.5722 11.1226 16.2773 10.6611C15.9822 10.2001 15.2781 10.2002 13.8701 10.2002H12.5C12.2644 10.2002 12.1465 10.2001 12.0732 10.127C12 10.0538 12 9.93577 12 9.7002V5.27051C12 4.37985 11.9999 3.93384 11.8037 3.89062Z"
                fill="white"
              />
            </Svg>
          </View>
          <View style={styles.streakNumberContainer}>
            <Text style={styles.streakNumber}>{streakCount}</Text>
            <Text style={styles.streakLabel}>Day Streak</Text>
          </View>
        </View>

        {/* Motivational Message */}
        <View style={styles.motivationalCard}>
          <Svg width={40} height={40} viewBox="0 0 89 102" fill="none" style={styles.mascotIcon}>
            <Path
              d="M53.8977 20.4069C61.532 20.4069 67.5258 27.2069 66.8703 35.1197L62.0161 93.5873C61.5185 98.374 57.6493 102 53.0404 102H13.8804C9.27159 102 5.40232 98.374 4.90479 93.5873L0.0505504 35.1197C-0.604974 27.2069 5.38887 20.4069 13.0232 20.4069H53.901H53.8977Z"
              fill="#7267D9"
            />
            <Path
              d="M20.1095 59.5428C22.447 59.5428 24.3419 57.6128 24.3419 55.232C24.3419 52.8513 22.447 50.9213 20.1095 50.9213C17.7721 50.9213 15.8772 52.8513 15.8772 55.232C15.8772 57.6128 17.7721 59.5428 20.1095 59.5428Z"
              fill="#F6F6F6"
            />
            <Path
              d="M46.8112 59.5428C49.1486 59.5428 51.0435 57.6128 51.0435 55.232C51.0435 52.8513 49.1486 50.9213 46.8112 50.9213C44.4737 50.9213 42.5789 52.8513 42.5789 55.232C42.5789 57.6128 44.4737 59.5428 46.8112 59.5428Z"
              fill="#F6F6F6"
            />
            <Path
              d="M16.7613 64.5178H50.156C53.7026 64.5178 56.5802 67.4487 56.5802 71.061C56.5802 81.9116 47.9306 90.7214 37.2775 90.7214H29.6398C18.9867 90.7214 10.3372 81.9116 10.3372 71.061C10.3372 67.4487 13.2147 64.5178 16.7613 64.5178Z"
              fill="#F6F6F6"
            />
          </Svg>
          <Text style={styles.motivationalText}>
            Do exercises every day this week to earn Streaks!
          </Text>
        </View>

        {/* Calendar Section */}
        <View style={styles.calendarSection}>
          {/* Month and Year with Navigation */}
          <View style={styles.monthHeader}>
            <Text style={styles.monthYearText}>
              {monthNames[currentMonth]} {currentYear}
            </Text>
            <View style={styles.monthNavigation}>
              <Pressable onPress={handlePrevMonth} style={styles.navArrow}>
                <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
                  <Path d="M15 18L9 12L15 6" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </Svg>
              </Pressable>
              <Pressable onPress={handleNextMonth} style={styles.navArrow}>
                <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
                  <Path d="M9 18L15 12L9 6" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </Svg>
              </Pressable>
            </View>
          </View>

          {/* Day Count Buttons */}
          <View style={styles.dayCountButtons}>
            <View style={[styles.dayCountButton, styles.dayCountButtonActive]}>
              <View style={styles.iconCircle}>
                <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
                  <Circle cx="12" cy="12" r="10" fill="#C2E273" />
                  <Path d="M8 12L11 15L16 9" stroke="#000000" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </Svg>
              </View>
              <Text style={styles.dayCountText}>{streakCount} Day</Text>
            </View>
            <View style={[styles.dayCountButton, styles.dayCountButtonInactive]}>
              <View style={styles.iconCircle}>
                <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
                  <Circle cx="12" cy="12" r="10" fill="#FF4444" />
                  <Path d="M8 8L16 16M16 8L8 16" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </Svg>
              </View>
              <Text style={styles.dayCountText}>0 Day</Text>
            </View>
          </View>

          {/* Calendar Grid */}
          <View style={styles.calendarCard}>
            <View style={styles.calendarHeader}>
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                <View key={day} style={styles.calendarHeaderCell}>
                  <Text style={styles.calendarHeaderText}>
                    {day}
                  </Text>
                </View>
              ))}
            </View>
            <View style={styles.calendarGrid}>
              {renderCalendar()}
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Globals.colors.white,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 20,
  },
  backButton: {
    position: 'relative',
    top: 0,
    left: 0,
  },
  headerTitle: {
    ...Globals.fonts.styles.header1,
    flex: 1,
    textAlign: 'center',
  },
  headerSpacer: {
    width: 48,
  },
  streakDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 20,
    marginBottom: 24,
  },
  lightningCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  streakNumberContainer: {
    flex: 1,
  },
  streakNumber: {
    fontSize: 48,
    fontWeight: 'bold',
    color: Globals.colors.black,
    marginBottom: 4,
  },
  streakLabel: {
    ...Globals.fonts.styles.body,
    color: Globals.colors.black,
  },
  motivationalCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#D3D0F3',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 20,
    marginBottom: 24,
  },
  mascotIcon: {
    width: 40,
    height: 40,
    marginRight: 12,
  },
  motivationalText: {
    ...Globals.fonts.styles.body,
    flex: 1,
    color: Globals.colors.black,
  },
  calendarSection: {
    paddingHorizontal: 20,
    marginBottom: 40,
  },
  monthHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  monthYearText: {
    ...Globals.fonts.styles.header3,
    color: Globals.colors.black,
  },
  monthNavigation: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  navArrow: {
    padding: 4,
  },
  dayCountButtons: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
    width: '100%',
  },
  dayCountButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#7267D9',
    gap: 8,
    flex: 1,
  },
  dayCountButtonActive: {
    backgroundColor: Globals.colors.white,
  },
  dayCountButtonInactive: {
    backgroundColor: Globals.colors.white,
  },
  dayCountText: {
    ...Globals.fonts.styles.body,
    color: Globals.colors.black,
    fontWeight: '700',
  },
  iconCircle: {
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  calendarCard: {
    backgroundColor: Globals.colors.white,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#7267D9',
    padding: 16,
  },
  calendarHeader: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  calendarHeaderCell: {
    width: '14.28%', // 100% / 7 days
    alignItems: 'center',
    justifyContent: 'center',
  },
  calendarHeaderText: {
    ...Globals.fonts.styles.caption,
    color: Globals.colors.black,
    textAlign: 'center',
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  calendarDay: {
    width: '14.28%', // 100% / 7 days
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  streakDay: {
    backgroundColor: '#C2E273',
    borderRadius: 8,
  },
  todayDay: {
    borderWidth: 2,
    borderColor: '#7267D9',
    borderRadius: 8,
  },
  calendarDayText: {
    ...Globals.fonts.styles.body,
    color: Globals.colors.black,
  },
  streakDayText: {
    color: Globals.colors.black,
    fontWeight: 'bold',
  },
  todayDayText: {
    fontWeight: 'bold',
    color: '#7267D9',
  },
});

