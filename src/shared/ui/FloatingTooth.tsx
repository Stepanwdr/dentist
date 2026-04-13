import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';

export const FloatingTooth = ({size}:{size:'l' | 's'}) => {
  const translateY = useSharedValue(0);
  const rotate = useSharedValue(0);

  React.useEffect(() => {
    translateY.value = withRepeat(
      withTiming(-12, {
        duration: 2000,
        easing: Easing.inOut(Easing.ease),
      }),
      -1,
      true
    );

    rotate.value = withRepeat(
      withTiming(5, {
        duration: 2500,
        easing: Easing.inOut(Easing.ease),
      }),
      -1,
      true
    );
  }, []);

  const toothStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: translateY.value },
      { rotate: `${rotate.value}deg` },
    ],
  }));
  const getSize=()=>{
    if(size === 'l'){
      return {
        width: 250,
        height: 250,
      }
    }
  }

  return (
    <View style={styles.container}>
      <Animated.Image
        source={require('@shared/assets/tooth.png')}
        style={[styles.tooth, toothStyle, getSize()]}
        resizeMode="contain"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 260,
    alignItems: 'center',
    justifyContent: 'center',
  },

  tooth: {
    width: 160,
    height: 160,
    zIndex: 2,
  },

  blob: {
    position: 'absolute',
    borderRadius: 100,
    zIndex: 1,
  },

  blob1: {
    width: 140,
    height: 140,
    backgroundColor: 'rgba(120,180,255,0.4)',
    top: 20,
    left: 10,
  },

  blob2: {
    width: 120,
    height: 120,
    backgroundColor: 'rgba(255,255,255,0.5)',
    bottom: 20,
    right: 10,
  },

  blob3: {
    width: 100,
    height: 100,
    backgroundColor: 'rgba(160,200,255,0.4)',
    top: 60,
    right: 30,
  },
});