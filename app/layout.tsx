import '@mantine/core/styles.css';

import { ReactNode } from 'react';
import { ColorSchemeScript, MantineProvider } from '@mantine/core';
import { AppProvider } from './provider';
import { NavLinks } from '@/components/Navbar/Navbar';

export const metadata = {
  title: 'Portello | IC 2025',
  description: 'Delegate Website of AIESEC International Congress 2025',
};

const RootLayout = async ({ children }: { children: ReactNode }) => {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <ColorSchemeScript />
      </head>
      <body>
        <MantineProvider>
          <NavLinks />
          <AppProvider>{children}</AppProvider>
        </MantineProvider>
      </body>
    </html>
  );
};

export default RootLayout;

export const dynamic = 'force-dynamic';
