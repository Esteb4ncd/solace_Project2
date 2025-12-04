import React from 'react';
import { Image, ImageSourcePropType, Pressable, StyleSheet, Text, View } from 'react-native';
import { Globals } from '../../constants/globals';

interface SelectableCardProps {
  label: string;
  icon: ImageSourcePropType;
  isSelected: boolean;
  onPress: () => void;
  painIndicator?: ImageSourcePropType; // Optional red starburst for pain areas
}

const SelectableCard: React.FC<SelectableCardProps> = ({
  label,
  icon,
  isSelected,
  onPress,
  painIndicator,
}) => {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.card,
        isSelected && styles.cardSelected,
        pressed && styles.cardPressed,
      ]}
      onPress={onPress}
    >
      <View style={styles.iconContainer}>
        <Image
          source={icon}
          style={styles.icon}
          resizeMode="contain"
        />
        {painIndicator && (
          <Image
            source={painIndicator}
            style={styles.painIndicator}
            resizeMode="contain"
          />
        )}
      </View>
      <Text style={styles.label}>
        {label}
      </Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Globals.colors.white,
    borderRadius: 16,
    padding: Globals.spacing.medium,
    alignItems: 'center',
    justifyContent: 'center',
    width: 158,
    height: 160,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 8,
    borderColor: 'transparent', // Transparent border to maintain consistent layout
  },
  cardSelected: {
    borderColor: '#7267D9', // Purple stroke - same 8px width when selected
  },
  cardPressed: {
    opacity: 0.8,
  },
  iconContainer: {
    position: 'relative',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Globals.spacing.small,
    flex: 1,
  },
  icon: {
    width: 80,
    height: 80,
  },
  painIndicator: {
    position: 'absolute',
    width: 30,
    height: 30,
  },
  label: {
    fontFamily: Globals.fonts.weights.bold,
    fontSize: 18,
    color: '#443E82', // Dark purple from design - consistent regardless of selection
    textAlign: 'center',
    marginTop: Globals.spacing.small,
  },
});

export default SelectableCard;

