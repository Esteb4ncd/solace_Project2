import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Animated, Dimensions, PanResponder, Platform, StyleSheet, ViewStyle } from 'react-native';
import AIAssistButton from './AIAssistButton';

type FloatingAIAssistProps = {
  onPress: () => void;
  style?: ViewStyle;
};

const BUTTON_SIZE = 72;
const EDGE_MARGIN = 16;
const TOP_LIMIT = Platform.select({ ios: 100, android: 80, default: 60 }) ?? 60;
const BOTTOM_LIMIT = Platform.select({ ios: 110, android: 90, default: 80 }) ?? 80;

const FloatingAIAssist: React.FC<FloatingAIAssistProps> = ({ onPress, style }) => {
  const { width, height } = useMemo(() => Dimensions.get('window'), []);
  const initialPosition = useMemo(
    () => ({
      x: width - BUTTON_SIZE - EDGE_MARGIN,
      y: height * 0.65,
    }),
    [width, height],
  );

  const position = useRef(new Animated.ValueXY(initialPosition)).current;
  const lastPosition = useRef(initialPosition);
  const [isDragging, setIsDragging] = useState(false);
  const [hasMoved, setHasMoved] = useState(false);

  const clampValue = React.useCallback((value: number, min: number, max: number) => {
    return Math.min(Math.max(value, min), max);
  }, []);

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      const newX = window.width - BUTTON_SIZE - EDGE_MARGIN;
      const clampedY = clampValue(
        lastPosition.current.y,
        TOP_LIMIT,
        window.height - BUTTON_SIZE - BOTTOM_LIMIT,
      );
      position.setValue({ x: newX, y: clampedY });
      lastPosition.current = { x: newX, y: clampedY };
    });
    return () => subscription?.remove();
  }, [position, clampValue]);

  const snapToEdge = (x: number, y: number) => {
    const targetX = x < width / 2 ? EDGE_MARGIN : width - BUTTON_SIZE - EDGE_MARGIN;
    const minY = TOP_LIMIT;
    const maxY = height - BUTTON_SIZE - BOTTOM_LIMIT;
    const targetY = clampValue(y, minY, maxY);

    Animated.spring(position, {
      toValue: { x: targetX, y: targetY },
      useNativeDriver: false,
      bounciness: 6,
      speed: 20,
    }).start(() => {
      lastPosition.current = { x: targetX, y: targetY };
      setIsDragging(false);
    });
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        setIsDragging(true);
        position.stopAnimation();
        position.setOffset(lastPosition.current);
        position.setValue({ x: 0, y: 0 });
      },
      onPanResponderMove: Animated.event([null, { dx: position.x, dy: position.y }], {
        useNativeDriver: false,
      }),
      onPanResponderRelease: (_, gestureState) => {
        position.flattenOffset();
        const currentX = lastPosition.current.x + gestureState.dx;
        const currentY = lastPosition.current.y + gestureState.dy;
        setHasMoved(true);
        snapToEdge(currentX, currentY);
      },
    }),
  ).current;

  return (
    <Animated.View
      style={[styles.floating, style, { transform: position.getTranslateTransform() }]}
      {...panResponder.panHandlers}
    >
      <AIAssistButton onPress={onPress} showLabel animateAttention={!hasMoved && !isDragging} />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  floating: {
    position: 'absolute',
    width: BUTTON_SIZE,
    height: BUTTON_SIZE,
    zIndex: 50,
  },
});

export default FloatingAIAssist;

