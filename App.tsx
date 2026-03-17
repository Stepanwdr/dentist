import React from 'react';
import { Providers } from '@app/providers';
import { AppNavigator } from '@app/navigation/AppNavigator';

export default function App() {
  return (
    <Providers>
      <AppNavigator />
    </Providers>
  );
}
