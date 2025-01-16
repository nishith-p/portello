'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { IconShoppingCart } from '@tabler/icons-react';
import { Button, Group } from '@mantine/core';
import styles from './Navbar.module.css';

export function NavLinks() {
  const pathname = usePathname();

  return (
    <nav className={styles.nav}>
      <Group justify="flex-end" gap="xl">
        <Link className={styles.link} href="/">
          Home
        </Link>
        <Link className={styles.link} href="/store">
          Merch Store
        </Link>
        <Link className={styles.link} href="/settings">
          Settings
        </Link>
        <Button className={styles.navbarButton} variant="subtle" component="a" href="/cart">
          <IconShoppingCart size={18} />
        </Button>
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
