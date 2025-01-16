'use client';

import { AppShell, Burger, Group, Skeleton } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { HeroImageBackground } from '@/components/HeroImageBackground/HeroImageBackground';
import { LeftsideBar } from '@/components/LeftsideBar/LeftsideBar';

export default function HomePage() {
  const mobileOpened = useDisclosure();
  const desktopOpened = useDisclosure(true);

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
        <HeroImageBackground />
      </AppShell.Main>
    </AppShell>
  );
}
