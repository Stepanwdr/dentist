import {useEffect, useRef} from "react";
import {Animated, View, StyleSheet} from "react-native";
import {HomeColor} from "@shared/theme/home";

export const  Connector: React.FC = () => {
  const height = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(height, { toValue: 40, duration: 500, delay: 600, useNativeDriver: false }).start();
  }, []);

  return (
    <View style={styles.connectorWrap}>
      <Animated.View style={[styles.connectorLine, { height }]} />
      <View style={styles.connectorDotOuter}>
        <View style={styles.connectorDotInner} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  connectorWrap: {
    alignItems: 'center',
  },
  connectorLine: {
    width: 2,
    backgroundColor: HomeColor.pink,
    borderRadius: 1,
    opacity: 0.6,
    left: 37,
  },
  connectorDotOuter: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: 'rgba(255,77,125,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
    left: 37
  },
  connectorDotInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: HomeColor.pink,
  },
})