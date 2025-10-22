import React from 'react';
import { Dimensions, Pressable, StyleSheet, Text } from 'react-native';
import { SvgXml } from 'react-native-svg';
import { Globals } from '../../constants/globals';

const { width: screenWidth } = Dimensions.get('window');

interface CategoryCardProps {
  title: string;
  xpAmount: number;
  onPress?: () => void;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ title, xpAmount, onPress }) => {
  const arrowIconSvg = `
    <svg width="13" height="21" viewBox="0 0 13 21" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M2.38611 18.3861L10.3861 10.3861L2.38611 2.3861" stroke="#7267D9" stroke-width="4.7722" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  `;

  return (
    <Pressable style={styles.card} onPress={onPress}>
      <Text style={styles.title}>{title}</Text>
      <SvgXml xml={arrowIconSvg} width={13} height={21} />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#F3F0FF',
    borderRadius: screenWidth * 0.03, // 12px on 400px screen
    width: screenWidth * 0.9, // 90% of screen width
    height: screenWidth * 0.2, // 20% of screen width (maintains aspect ratio)
    paddingHorizontal: screenWidth * 0.05, // 5% of screen width
    marginVertical: screenWidth * 0.01, // 1% of screen width
    marginBottom: screenWidth * 0.04, // 4% of screen width (equivalent to ~16px)
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: screenWidth * 0.01, // 1% of screen width
    },
    shadowOpacity: 0.25,
    shadowRadius: screenWidth * 0.01, // 1% of screen width
    elevation: 4,
  },
  title: {
    ...Globals.fonts.styles.header4,
  },
});

export default CategoryCard;
