import React from 'react';
import { StyleSheet, View } from 'react-native';

const StatusBar = () => {
  return (
    <View style={styles.container}>
      {/* Empty status bar - no time or icons */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 44, // Standard status bar height
    backgroundColor: 'transparent',
  },
});

export default StatusBar;
