// src/shared/ui/Avatar.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface AvatarProps {
  initials: string;
  size?: number;
}

export const Avatar: React.FC<AvatarProps> = ({
                                                initials,
                                                size = 56,
                                              }) => {
  const stringToColor = (str: string) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }

    const color = `hsl(${hash % 360}, 70%, 50%)`;
    return color;
  };
  const color = stringToColor(initials);
  const background = color + '20'; // мягкий фон
  const border = color + '40';

  return (
    <View
      style={[
        styles.container,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: background,
          borderColor: border,
        },
      ]}
    >
      <View style={styles.inner}>
        <Text
          style={[
            styles.text,
            {
              fontSize: size * 0.32,
              color:'white',
            },
          ]}
          numberOfLines={1}
        >
          {initials}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,

    // мягкая “карточная” глубина
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },

    elevation: 3, // Android
  },

  inner: {
    justifyContent: 'center',
    alignItems: 'center',
  },

  text: {
    fontWeight: '700',
    letterSpacing: 1,
  },
});