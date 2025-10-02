import React from 'react';
import { View, StyleSheet } from 'react-native';
import QuoteCard from '../../components/QuoteCard';

export default function App() {
  return (
    <View style={styles.container}>
      <QuoteCard refreshInterval={60000} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
