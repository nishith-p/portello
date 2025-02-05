import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';

import { ReactNode } from 'react';
import { ColorSchemeScript } from '@mantine/core';
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
      <head>
        <ColorSchemeScript />
      </head>
      <body>
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  );
};

export default RootLayout;

export const dynamic = 'force-dynamic';
