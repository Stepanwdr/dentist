// src/app/providers/index.ts
import React, { ReactNode } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@shared/api/queryClient';
import { I18nProvider } from '@shared/i18n/core';
import { BookingProvider } from '@features/booking';
import { AuthProvider } from '@features/auth/model/AuthProvider';
import { NotificationProvider } from "./NotificationProvider/ui/NotificationProvider";
import Toast from 'react-native-toast-message';

interface ProvidersProps {
  children: ReactNode;
}

/**
 * Корневой провайдер приложения.
 * Добавляй новые провайдеры здесь, не трогая App.tsx.
 */
export const Providers: React.FC<ProvidersProps> = ({ children }) => (
  <SafeAreaProvider>
    <I18nProvider>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <BookingProvider>
            <NotificationProvider>
            {children}
              <Toast/>
            </NotificationProvider>
          </BookingProvider>
        </AuthProvider>
      </QueryClientProvider>
    </I18nProvider>
  </SafeAreaProvider>
);
