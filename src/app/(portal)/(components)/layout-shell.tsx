'use client';

import React from 'react';
import { AppShell, rem } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { CartDrawer } from '@/components/cart-drawer/cart-drawer';
import { PortalHeader } from './portal-header/portal-header';
import { PortalSidebar } from './portal-sidebar/portal-sidebar';

export const LayoutShell = ({ children }: { children: React.ReactNode }) => {
  const [opened, { toggle, close }] = useDisclosure();

  return (
    <AppShell
      header={{ height: rem(60) }}
      navbar={{
        width: rem(300),
        breakpoint: 'sm',
        collapsed: { mobile: !opened },
      }}
      padding="md"
    >
      <AppShell.Header>
        <PortalHeader opened={opened} toggle={toggle} />
      </AppShell.Header>

      <AppShell.Navbar>
        <PortalSidebar onNavigate={close} />
      </AppShell.Navbar>

      <AppShell.Main bg="var(--mantine-color-gray-0)">{children}</AppShell.Main>
      <CartDrawer />
    </AppShell>
  );
};
