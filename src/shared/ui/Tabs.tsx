import React from 'react';
import {
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from 'react-native';

type TabItem<T extends string> = {
  label: string;
  value: T;
};

interface TabsProps<T extends string> {
  tabs: TabItem<T>[];
  active: T;
  onChange: (tab: T) => void;

  containerStyle?: ViewStyle;
  tabStyle?: ViewStyle;
  activeTabStyle?: ViewStyle;

  textStyle?: TextStyle;
  activeTextStyle?: TextStyle;
}

export function Tabs<T extends string>({
                                         tabs,
                                         active,
                                         onChange,
                                         containerStyle,
                                         tabStyle,
                                         activeTabStyle,
                                         textStyle,
                                         activeTextStyle,
                                       }: TabsProps<T>) {
  const renderItem = ({ item }: { item: TabItem<T> }) => {
    const isActive = item.value === active;

    return (
      <TouchableOpacity
        onPress={() => onChange(item.value)}
        style={[
          styles.tab,
          tabStyle,
          isActive && styles.activeTab,
          isActive && activeTabStyle,
        ]}
      >
        <Text
          style={[
            styles.text,
            textStyle,
            isActive && styles.activeText,
            isActive && activeTextStyle,
          ]}
        >
          {item.label}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <FlatList
      data={tabs}
      horizontal
      showsHorizontalScrollIndicator={false}
      keyExtractor={(item) => item.value}
      renderItem={renderItem}
      contentContainerStyle={[
        styles.container,
        containerStyle,
      ]}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 8,
    marginTop: 12,
    paddingHorizontal: 12,
    paddingBottom: 20,
  },
  tab: {
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: 'white',
    minWidth: 75,
    minHeight: 35,
    maxHeight: 35,
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: '#4A9FF5',
  },
  text: {
    fontSize: 14,
    color: '#4A9FF5',
    fontWeight: 'bold',
  },
  activeText: {
    color: '#fff',
  },
});