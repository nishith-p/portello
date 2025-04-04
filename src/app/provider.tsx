'use client';

import * as React from 'react';
import { KindeProvider } from '@kinde-oss/kinde-auth-nextjs';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from 'react-error-boundary';
import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { MainErrorFallback } from '@/components/errors/main';
import { queryConfig } from '@/lib/react-query';
import { theme } from '@/theme';
import { CartProvider } from '@/context/CartContext';

type AppProviderProps = {
  children: React.ReactNode;
};

export const AppProvider = ({ children }: AppProviderProps) => {
  const [queryClient] = React.useState(
    () =>
      new QueryClient({
        defaultOptions: queryConfig,
      })
  );

  return (
    <MantineProvider theme={theme}>
      <ErrorBoundary FallbackComponent={MainErrorFallback}>
        <QueryClientProvider client={queryClient}>
          <KindeProvider>
            <CartProvider>
              <Notifications />
              {children}
            </CartProvider>
          </KindeProvider>
        </QueryClientProvider>
      </ErrorBoundary>
    </MantineProvider>
  );
};
