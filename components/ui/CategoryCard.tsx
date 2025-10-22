import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { SvgXml } from 'react-native-svg';
import { Globals } from '../../constants/globals';

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
    borderRadius: 12,
    width: 360,
    height: 80,
    paddingHorizontal: 20,
    marginVertical: 4,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  title: {
    ...Globals.fonts.styles.header4,
  },
});

export default CategoryCard;
