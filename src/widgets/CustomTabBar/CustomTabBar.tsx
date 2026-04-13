import { TouchableOpacity, View, Text, StyleSheet, Platform } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

const C = {
  sky:    '#4A9FF5',
  muted:  '#94A3B8',
  white:  '#fff',
  border: '#E2EBF6',
};

type IconName = React.ComponentProps<typeof Ionicons>['name'];

const ICONS: Record<string, { active: IconName; inactive: IconName; label: string }> = {
  HomeTab:         { active: 'home',     inactive: 'home-outline',     label: 'Главная'   },
  BookingTab:      { active: 'calendar', inactive: 'calendar-outline', label: 'Записаться' },
  AppointmentsTab: { active: 'list',     inactive: 'list-outline',     label: 'Мои записи' },
  DoctorsTab:      { active: 'medkit',   inactive: 'medkit-outline',   label: 'Врачи'   },
  ProfileTab:      { active: 'person',   inactive: 'person-outline',   label: 'Профиль'   },
};

export function CustomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  return (
    <View style={s.wrap}>
      <View style={s.bar}>
        {state.routes.map((route, index) => {
          const focused = state.index === index;
          const icon    = ICONS[route.name];

          const onPress = () => {
            const event = navigation.emit({
              type:      'tabPress',
              target:    route.key,
              canPreventDefault: true,
            });
            if (!focused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          return (
            <TouchableOpacity
              key={route.key}
              onPress={onPress}
              activeOpacity={0.7}
              style={s.tab}
            >
              {/* Активный таб — пилюля с фоном */}
              <View style={[s.iconWrap, focused && s.iconWrapActive]}>
                <Ionicons
                  name={focused ? icon?.active : icon?.inactive}
                  size={22}
                  color={focused ? C.sky : C.muted}
                />
              </View>
              <Text style={[s?.label, focused && s?.labelActive]}>
                {icon?.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  wrap: {
    position:        'absolute',
    bottom:          10,
    left:            16,
    right:           16,
  },
  bar: {
    flexDirection:   'row',
    backgroundColor: 'rgba(255,255,255,0.96)',
    borderRadius: 24,
    paddingVertical: 8,
    paddingHorizontal: 8,
    ...Platform.select({
      ios: {
        shadowColor:   '#000',
        shadowOffset:  { width: 0, height: 8 },
        shadowOpacity: 0.12,
        shadowRadius:  20,
      },
      android: { elevation: 16 },
    }),
  },
  tab: {
    flex:           1,
    alignItems:     'center',
    justifyContent: 'center',
    gap:            2,
  },
  iconWrap: {
    width:          44,
    height:         32,
    borderRadius:   16,
    alignItems:     'center',
    justifyContent: 'center',
  },
  iconWrapActive: {
    backgroundColor: '#EFF6FF',
    borderRadius: '50%',
    minWidth: 20,
    minHeight: 20
  },
  label: {
    fontSize:   10,
    fontWeight: '500',
    color:      C.muted,
  },
  labelActive: {
    color:      C.sky,
    fontWeight: '700',
  },
});