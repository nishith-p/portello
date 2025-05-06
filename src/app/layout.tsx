import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';

import React, { ReactNode } from 'react';
import LayoutWrapper from './layout-wrapper';
import { AppProvider } from './provider';

export const metadata = {
  title: {
    template: '%s | IC 2025',
    default: 'IC 2025',
  },
  description: 'Delegate Portal of AIESEC International Congress 2025',
};

const RootLayout = async ({ children }: { children: ReactNode }) => {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <AppProvider>
          <LayoutWrapper>{children}</LayoutWrapper>
        </AppProvider>
      </body>
    </html>
  );
};

export default RootLayout;

export const dynamic = 'force-dynamic';
