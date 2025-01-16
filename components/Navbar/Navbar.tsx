'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { IconMoon, IconSun  } from '@tabler/icons-react';
import { ActionIcon, Button, Group } from '@mantine/core';
import styles from './Navbar.module.css';
import { UserMenu } from '../UserMenu/UserMenu';
import { ColorSchemeToggle } from '../ColorSchemeToggle/ColorSchemeToggle';

export function NavLinks() {
  const pathname = usePathname();

  return (
    <nav className={styles.nav}>
      <Group justify="flex-end" gap="xl">
        {/* <ActionIcon size="lg" variant="default" component='a' href='/cart'>
          <IconShoppingCart size={18} stroke={1.5} />
        </ActionIcon> */}
        <ColorSchemeToggle />
        <UserMenu />
        <Button
          className={`${styles.navbarButton} ${styles.loginButton}`}
          component="a"
          href="/login"
        >
          Login
        </Button>
      </Group>
    </nav>
  );
}
