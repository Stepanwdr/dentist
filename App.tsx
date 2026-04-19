import React from 'react';
import { Providers } from '@app/providers';
import { AppNavigator } from '@app/navigation/AppNavigator';
import { setupNotifications } from "@app/providers/NotificationProvider/lib/setupNotifications";

export default function App() {
  return (
    <Providers>
      <AppNavigator />
    </Providers>
  );
}
