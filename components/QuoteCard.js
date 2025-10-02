// components/QuoteCard.js
import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

function QuoteCard({ refreshInterval = 60000 }) {
  const [quote, setQuote] = useState(null);

  const fetchQuote = async () => {
    try {
      const response = await fetch('https://api.adviceslip.com/advice');
      const data = await response.json();
      setQuote({ content: data.slip.advice, author: 'No clue' });
    } catch (error) {
      console.error('Error fetching quote:', error);
    }
  };

  useEffect(() => {
    fetchQuote();
    const interval = setInterval(fetchQuote, refreshInterval);
    return () => clearInterval(interval);
  }, [refreshInterval]);

  if (!quote) {
    return (
      <View style={styles.card}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.card}>
      <Text style={styles.quote}>"{quote.content}"</Text>
      <Text style={styles.author}>— {quote.author}</Text>
      <Button title="New Quote" onPress={fetchQuote} />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
    alignItems: 'center',
    maxWidth: '90%',
  },
  quote: {
    fontSize: 20,
    fontStyle: 'italic',
    textAlign: 'center',
    marginBottom: 10,
  },
  author: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  loadingText: {
    fontSize: 18,
    fontStyle: 'italic',
  },
});

export default QuoteCard;
