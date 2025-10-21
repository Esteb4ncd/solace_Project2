import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

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
        <View style={styles.streakIconContainer}>
          <Image 
            source={require('@/assets/hompageAssets/lightning_fill.png')} 
            style={styles.lightningIcon}
          />
          <Text style={styles.streakNumber}>{streakCount}</Text>
        </View>
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
    paddingVertical: 12,
  },
  streakSection: {
    alignItems: 'flex-start',
    flex: 1,
    justifyContent: 'center',
  },
  streakIconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginBottom: 4,
  },
  lightningIcon: {
    width: 32,
    height: 32,
    marginRight: 4,
  },
  streakNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  streakLabel: {
    fontSize: 12,
    fontWeight: '500', // Medium weight
    color: '#000',
    textAlign: 'left',
  },
  userSection: {
    flex: 2,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  userName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
  },
  editButton: {
    padding: 4,
    marginLeft: 8,
  },
  editIcon: {
    width: 20,
    height: 20,
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
