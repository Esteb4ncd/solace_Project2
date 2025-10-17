import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native';

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
        <Image 
          source={require('@/assets/hompageAssets/lightning_fill.png')} 
          style={styles.lightningIcon}
        />
        <Text style={styles.streakNumber}>{streakCount}</Text>
        <Text style={styles.streakLabel}>Streak</Text>
      </View>

      {/* User Name Section */}
      <View style={styles.userSection}>
        <Text style={styles.userName}>{userName}</Text>
        {showEditIcon && (
          <TouchableOpacity onPress={onEditPress} style={styles.editButton}>
            <Image 
              source={require('@/assets/hompageAssets/Edit-Name.png')} 
              style={styles.editIcon}
            />
          </TouchableOpacity>
        )}
      </View>

      {/* Achievement Icon */}
      {showAchievementIcon && (
        <View style={styles.achievementSection}>
          <Image 
            source={require('@/assets/hompageAssets/Ai Assistant.png')} 
            style={styles.achievementIcon}
          />
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
    width: 16,
    height: 16,
  },
  achievementSection: {
    flex: 1,
    alignItems: 'flex-end',
  },
  achievementIcon: {
    width: 40,
    height: 40,
  },
});

export default Header;
