import { router } from 'expo-router';
import React from 'react';
import { Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Svg, { Defs, LinearGradient, Path, Stop } from 'react-native-svg';
import { useExerciseContext } from '../../contexts/ExerciseContext';

type HeaderProps = {
  userName?: string;
  streakCount?: number;
  showEditIcon?: boolean;
  showAchievementIcon?: boolean;
  onEditPress?: () => void;
  isEditingName?: boolean;
  tempUserName?: string;
  onUserNameChange?: (name: string) => void;
  onSaveName?: () => void;
  onCancelEdit?: () => void;
};

const Header = ({ 
  userName = "Weenie", 
  streakCount = 1, 
  showEditIcon = true, 
  showAchievementIcon = true,
  onEditPress,
  isEditingName = false,
  tempUserName = "",
  onUserNameChange,
  onSaveName,
  onCancelEdit
}: HeaderProps) => {
  const { isStreakExtendedToday } = useExerciseContext();
  const streakExtended = isStreakExtendedToday();
  const iconColor = streakExtended ? '#C2E273' : '#9E9E9E'; // Green if extended, gray if not

  const handleStreakPress = () => {
    router.push('/(tabs)/streakPage');
  };

  return (
    <View style={styles.container}>
      {/* Streak Section */}
      <TouchableOpacity style={styles.streakSection} onPress={handleStreakPress} activeOpacity={0.7}>
        <View style={styles.streakIconContainer}>
          <Svg width={32} height={32} viewBox="0 0 24 24" fill="none">
            <Path d="M12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2ZM11.8037 3.89062C11.6075 3.8476 11.42 4.25247 11.0459 5.06055L8.31445 10.96C7.72284 12.2378 7.42776 12.8774 7.72266 13.3389C8.01776 13.7999 8.72191 13.7998 10.1299 13.7998H11.5C11.7356 13.7998 11.8535 13.7999 11.9268 13.873C12 13.9462 12 14.0642 12 14.2998V18.7295C12 19.6202 12.0001 20.0662 12.1963 20.1094C12.3925 20.1524 12.58 19.7475 12.9541 18.9395L15.6855 13.04C16.2772 11.7622 16.5722 11.1226 16.2773 10.6611C15.9822 10.2001 15.2781 10.2002 13.8701 10.2002H12.5C12.2644 10.2002 12.1465 10.2001 12.0732 10.127C12 10.0538 12 9.93577 12 9.7002V5.27051C12 4.37985 11.9999 3.93384 11.8037 3.89062Z" fill={iconColor}/>
          </Svg>
          <Text style={styles.streakNumber}>{streakCount}</Text>
        </View>
        <Text style={styles.streakLabel}>Streak</Text>
      </TouchableOpacity>

      {/* User Name Section */}
      <View style={styles.userSection}>
        {isEditingName ? (
          <View style={styles.editContainer}>
            <TextInput
              style={styles.nameInput}
              value={tempUserName}
              onChangeText={onUserNameChange}
              placeholder="Enter your name"
              autoFocus={true}
              maxLength={10}
              onSubmitEditing={onSaveName}
              onBlur={onSaveName}
            />
            {tempUserName.length >= 10 && (
              <Text style={styles.warningText}>Cannot exceed 10 characters</Text>
            )}
          </View>
        ) : (
          <>
            <Text style={styles.userName}>{userName}</Text>
            {showEditIcon && (
              <TouchableOpacity onPress={onEditPress} style={styles.editButton}>
                <Image 
                  source={require('@/assets/hompageAssets/Edit-Name.png')} 
                  style={styles.editIcon}
                />
              </TouchableOpacity>
            )}
          </>
        )}
      </View>

      {/* Achievement Icon */}
      {showAchievementIcon && (
        <View style={styles.achievementSection}>
          <Svg width={40} height={40} viewBox="0 0 89 102" fill="none">
            <Defs>
              <LinearGradient id="paint0_linear_2079_2995" x1="45.2175" y1="42.0566" x2="85.3677" y2="8.88927" gradientUnits="userSpaceOnUse">
                <Stop stopColor="#7267D9" />
                <Stop offset="0.39" stopColor="#B9D5F1" />
                <Stop offset="0.84" stopColor="#D3D0F3" />
              </LinearGradient>
            </Defs>
            <Path d="M53.8977 20.4069C61.532 20.4069 67.5258 27.2069 66.8703 35.1197L62.0161 93.5873C61.5185 98.374 57.6493 102 53.0404 102H13.8804C9.27159 102 5.40232 98.374 4.90479 93.5873L0.0505504 35.1197C-0.604974 27.2069 5.38887 20.4069 13.0232 20.4069H53.901H53.8977Z" fill="#7267D9"/>
            <Path d="M20.1095 59.5428C22.447 59.5428 24.3419 57.6128 24.3419 55.232C24.3419 52.8513 22.447 50.9213 20.1095 50.9213C17.7721 50.9213 15.8772 52.8513 15.8772 55.232C15.8772 57.6128 17.7721 59.5428 20.1095 59.5428Z" fill="#F6F6F6"/>
            <Path d="M46.8112 59.5428C49.1486 59.5428 51.0435 57.6128 51.0435 55.232C51.0435 52.8513 49.1486 50.9213 46.8112 50.9213C44.4737 50.9213 42.5789 52.8513 42.5789 55.232C42.5789 57.6128 44.4737 59.5428 46.8112 59.5428Z" fill="#F6F6F6"/>
            <Path d="M16.7613 64.5178H50.156C53.7026 64.5178 56.5802 67.4487 56.5802 71.061C56.5802 81.9116 47.9306 90.7214 37.2775 90.7214H29.6398C18.9867 90.7214 10.3372 81.9116 10.3372 71.061C10.3372 67.4487 13.2147 64.5178 16.7613 64.5178Z" fill="#F6F6F6"/>
            <Path d="M60.9165 56.0983C60.4627 56.0983 60.0559 55.8107 59.8979 55.3758L53.383 37.4445C53.1847 36.9035 52.7678 36.4755 52.2367 36.2769L34.6317 29.6413C34.2047 29.4804 33.9224 29.0661 33.9224 28.6038C33.9224 28.1416 34.2047 27.7273 34.6317 27.5664L52.2367 20.9307C52.7678 20.7287 53.188 20.3041 53.383 19.7632L59.8979 1.83183C60.0559 1.39699 60.4627 1.10938 60.9165 1.10938C61.3703 1.10938 61.7771 1.39699 61.9351 1.83183L68.45 19.7632C68.6483 20.3041 69.0652 20.7321 69.5963 20.9307L87.2047 27.5664C87.6316 27.7273 87.914 28.1416 87.914 28.6038C87.914 29.0661 87.6316 29.4804 87.2047 29.6413L69.5963 36.2769C69.0652 36.479 68.645 36.9035 68.45 37.4445L61.9351 55.3758C61.7771 55.8107 61.3703 56.0983 60.9165 56.0983Z" fill="url(#paint0_linear_2079_2995)"/>
            <Path d="M60.9166 2.21188L67.4315 20.1432C67.7374 20.9855 68.393 21.6532 69.2199 21.9648L86.825 28.6004L69.2199 35.2361C68.393 35.5476 67.7374 36.2153 67.4315 37.0576L60.9166 54.9889L54.4017 37.0576C54.0958 36.2153 53.4403 35.5476 52.6133 35.2361L35.0083 28.6004L52.6133 21.9648C53.4403 21.6532 54.0958 20.9855 54.4017 20.1432L60.9166 2.21188ZM60.9166 0C60.009 0 59.1955 0.575227 58.8795 1.44491L52.3646 19.3762C52.2772 19.6159 52.0923 19.8008 51.8603 19.8898L34.2553 26.5255C33.4014 26.8473 32.8367 27.6759 32.8367 28.6004C32.8367 29.5249 33.4014 30.3535 34.2553 30.6753L51.8603 37.311C52.0956 37.4 52.2772 37.5883 52.3646 37.8246L58.8795 55.7559C59.1955 56.6256 60.009 57.2008 60.9166 57.2008C61.8243 57.2008 62.6378 56.6256 62.9538 55.7559L69.4687 37.8246C69.5561 37.5849 69.741 37.4 69.9729 37.311L87.578 30.6753C88.4318 30.3535 88.9966 29.5249 88.9966 28.6004C88.9966 27.6759 88.4318 26.8473 87.578 26.5255L69.9729 19.8898C69.7376 19.8008 69.5561 19.6125 69.4687 19.3762L62.9538 1.44491C62.6378 0.575227 61.8243 0 60.9166 0Z" fill="white"/>
          </Svg>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingVertical: 12,
  },
  streakSection: {
    alignItems: 'flex-start',
    flex: 1,
    justifyContent: 'flex-start',
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
    alignItems: 'flex-start',
    flexDirection: 'row',
    justifyContent: 'center',
    paddingTop: 0,
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
    justifyContent: 'flex-start',
  },
  achievementIcon: {
    width: 40,
    height: 40,
  },
  editContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  nameInput: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
    borderWidth: 1,
    borderColor: '#7267D9',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    minWidth: 100,
    maxWidth: 200,
  },
  warningText: {
    fontSize: 12,
    color: '#ff4444',
    marginTop: 4,
    textAlign: 'center',
    fontWeight: '500',
  },
});

export default Header;
