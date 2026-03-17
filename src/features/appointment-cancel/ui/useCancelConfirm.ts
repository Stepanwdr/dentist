import { Alert } from 'react-native';
import { useBookingActions } from '@features/booking';
import { useI18n } from '@shared/i18n/core';

export function useCancelConfirm() {
  const { cancelAppointment } = useBookingActions();
  const { t } = useI18n();

  function confirmCancel(id: string) {
    Alert.alert(
      t('cancel.title'),
      t('cancel.message'),
      [
        { text: t('cancel.no'), style: 'cancel' },
        {
          text: t('cancel.yes'),
          style: 'destructive',
          onPress: () => cancelAppointment(id),
        },
      ]
    );
  }

  return { confirmCancel };
}
