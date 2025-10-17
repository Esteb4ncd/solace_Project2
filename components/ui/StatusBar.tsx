import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

type StatusBarProps = {
  time?: string;
  showSignal?: boolean;
  showWifi?: boolean;
  showBattery?: boolean;
};

const StatusBar = ({ 
  time = "19:02", 
  showSignal = true, 
  showWifi = true, 
  showBattery = true 
}: StatusBarProps) => {
  return (
    <View style={styles.container}>
      <Text style={styles.time}>{time}</Text>
      <View style={styles.rightIcons}>
        {showSignal && <View style={styles.signalIcon} />}
        {showWifi && <View style={styles.wifiIcon} />}
        {showBattery && <View style={styles.batteryIcon} />}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 4,
  },
  time: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  rightIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  signalIcon: {
    width: 16,
    height: 12,
    backgroundColor: '#000',
    borderRadius: 2,
  },
  wifiIcon: {
    width: 16,
    height: 12,
    backgroundColor: '#000',
    borderRadius: 2,
  },
  batteryIcon: {
    width: 20,
    height: 12,
    backgroundColor: '#000',
    borderRadius: 2,
  },
});

export default StatusBar;
