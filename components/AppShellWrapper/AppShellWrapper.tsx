'use client';

import { ReactNode } from 'react';
import { AppShell, Burger, Group, Skeleton } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { FooterLinks } from '../Footer/FooterLinks';
import { LeftsideBar } from '../LeftsideBar/LeftsideBar';

export default function AppShellWrapper({ children }: { children: ReactNode }) {
  const [mobileOpened, { toggle: toggleMobile }] = useDisclosure();
  const [desktopOpened, { toggle: toggleDesktop }] = useDisclosure(true);

  return (
    <AppShell
      navbar={{
        width: 300,
        breakpoint: 'sm',
        collapsed: { mobile: !mobileOpened, desktop: !desktopOpened },
      }}
      padding="md"
    >
      <AppShell.Navbar p="md">
        <LeftsideBar />
      </AppShell.Navbar>
      <AppShell.Main>
        {children}
        <FooterLinks />
      </AppShell.Main>
    </AppShell>
  );
}
