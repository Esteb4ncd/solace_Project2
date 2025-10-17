import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

type HeaderProps = {
  userName?: string;
  streakCount?: number;
  showEditIcon?: boolean;
  showAchievementIcon?: boolean;
  onEditPress?: () => void;
};

const Header = ({ 
  userName = "Weenie", 
  streakCount = 1, 
  showEditIcon = true, 
  showAchievementIcon = true,
  onEditPress 
}: HeaderProps) => {
  return (
    <View style={styles.container}>
      {/* Streak Section */}
      <View style={styles.streakSection}>
        <View style={styles.lightningIcon}>
          <Text style={styles.lightningText}>⚡</Text>
        </View>
        <Text style={styles.streakNumber}>{streakCount}</Text>
        <Text style={styles.streakLabel}>Streak</Text>
      </View>

      {/* User Name Section */}
      <View style={styles.userSection}>
        <Text style={styles.userName}>{userName}</Text>
        {showEditIcon && (
          <TouchableOpacity onPress={onEditPress} style={styles.editButton}>
            <Text style={styles.editIcon}>✏️</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Achievement Icon */}
      {showAchievementIcon && (
        <View style={styles.achievementSection}>
          <View style={styles.achievementIcon}>
            <Text style={styles.achievementEmoji}>😊</Text>
            <View style={styles.starIcon}>
              <Text style={styles.starText}>⭐</Text>
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  streakSection: {
    alignItems: 'center',
    flex: 1,
  },
  lightningIcon: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  lightningText: {
    fontSize: 16,
  },
  streakNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  streakLabel: {
    fontSize: 12,
    color: '#000',
  },
  userSection: {
    flex: 2,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginRight: 8,
  },
  editButton: {
    padding: 4,
  },
  editIcon: {
    fontSize: 16,
    color: '#8B5CF6',
  },
  achievementSection: {
    flex: 1,
    alignItems: 'flex-end',
  },
  achievementIcon: {
    width: 40,
    height: 40,
    backgroundColor: '#8B5CF6',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  achievementEmoji: {
    fontSize: 20,
  },
  starIcon: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 16,
    height: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  starText: {
    fontSize: 10,
  },
});

export default Header;
