import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet, Easing } from 'react-native';

const CircularLoadingDots = ({
  size = 12,
  color = '#1e40af',
  dotCount = 4,
  speed = 2000,
  circleSize = 80,
}) => {
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: speed,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  }, [speed]);

  const radius = circleSize / 2 - size / 2;

  return (
    <View style={[styles.container, { width: circleSize, height: circleSize }]}>
      <Animated.View
        style={{
          width: circleSize,
          height: circleSize,
          transform: [
            {
              rotate: rotateAnim.interpolate({
                inputRange: [0, 1],
                outputRange: ['0deg', '360deg'],
              }),
            },
          ],
        }}
      >
        {Array.from({ length: dotCount }).map((_, index) => {
          const angle = (index * 2 * Math.PI) / dotCount; // equally spaced angle
          const x = radius * Math.cos(angle);
          const y = radius * Math.sin(angle);

          return (
            <View
              key={index}
              style={{
                position: 'absolute',
                width: size,
                height: size,
                borderRadius: size / 2,
                backgroundColor: color,
                left: circleSize / 2 - size / 2 + x,
                top: circleSize / 2 - size / 2 + y,
              }}
            />
          );
        })}
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
});

export default CircularLoadingDots;
