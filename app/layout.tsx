import '@mantine/core/styles.css';

import { ReactNode } from 'react';
import { ColorSchemeScript, MantineProvider } from '@mantine/core';
import AppShellWrapper from '@/components/AppShellWrapper/AppShellWrapper';
import { FooterLinks } from '@/components/Footer/FooterLinks';
import { NavLinks } from '@/components/Navbar/Navbar';
import { AppProvider } from './provider';

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
          <AppProvider>
            <AppShellWrapper>{children}</AppShellWrapper>
          </AppProvider>
        </MantineProvider>
      </body>
    </html>
  );
};

export default RootLayout;

export const dynamic = 'force-dynamic';
