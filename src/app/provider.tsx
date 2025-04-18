'use client';

import * as React from 'react';
import { KindeProvider } from '@kinde-oss/kinde-auth-nextjs';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from 'react-error-boundary';
import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { CartProvider } from '@/context/cart';
import { queryConfig } from '@/lib/core/react-query';
import { theme } from '@/theme';

type AppProviderProps = {
  children: React.ReactNode;
};

const MainErrorFallback = () => {
  return <div>Error!</div>;
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
