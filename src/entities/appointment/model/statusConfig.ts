// src/entities/appointment/model/statusConfig.ts
import { AppointmentStatus } from '@shared/types';
import { Colors } from '@shared/theme/colors';
import { Ionicons } from '@expo/vector-icons';

interface StatusConfig {
  label: string;
  color: string;
  bg: string;
  iconName: React.ComponentProps<typeof Ionicons>['name'];
}

export const STATUS_CONFIG: Record<AppointmentStatus, StatusConfig> = {
  upcoming: {
    label: 'Предстоит',
    color: Colors.primary,
    bg: Colors.primaryLight,
    iconName: 'time-outline',
  },
  completed: {
    label: 'Завершён',
    color: Colors.success,
    bg: Colors.successLight,
    iconName: 'checkmark-circle-outline',
  },
  cancelled: {
    label: 'Отменён',
    color: Colors.textMuted,
    bg: Colors.separator,
    iconName: 'close-circle-outline',
  },
};
