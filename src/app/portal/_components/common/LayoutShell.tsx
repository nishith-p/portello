'use client';

import React from 'react';
import { AppShell, rem } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { PortalHeader } from './PortalHeader';
import { PortalSidebar } from './PortalSidebar';

export const LayoutShell = ({ children }: { children: React.ReactNode }) => {
  const [opened, { toggle }] = useDisclosure();

  return (
    <>
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
          <PortalSidebar />
        </AppShell.Navbar>

        <AppShell.Main bg="var(--mantine-color-gray-0)">{children}</AppShell.Main>
      </AppShell>
    </>
  );
};
