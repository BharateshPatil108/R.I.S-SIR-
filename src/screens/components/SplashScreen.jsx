import React, { useEffect, useRef } from 'react';
import { StyleSheet, Text, View, Animated, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const SplashScreen = () => {
  const navigation = useNavigation();
  const logoAnim = useRef(new Animated.Value(-300)).current;
  const textAnim = useRef(new Animated.Value(300)).current;

  useEffect(() => {
    Animated.spring(logoAnim, {
      toValue: 0,
      speed: 2,
      bounciness: 10,
      useNativeDriver: true,
    }).start();

    Animated.spring(textAnim, {
      toValue: 0,
      speed: 2,
      bounciness: 10,
      useNativeDriver: true,
    }).start();

    const timer = setTimeout(() => {
      navigation.replace('Login');
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <Animated.View style={{ transform: [{ translateY: logoAnim }] }}>
        <Image
          source={require('../../assets/CeoLogo.png')}
          style={styles.logo}
        />
      </Animated.View>

      <Animated.View style={{ transform: [{ translateY: textAnim }] }}>
        <Text style={styles.text}>SIR Karnataka</Text>
      </Animated.View>
    </View>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
    marginBottom: 10,
  },
  text: {
    color: '#b89b9bff',
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: 10,
  },
});

