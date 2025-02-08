import { memo } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { IconHelp, IconHome, IconUser } from '@tabler/icons-react';
import { Box, NavLink, Stack } from '@mantine/core';
import classes from './styles/PortalSidebar.module.css';

const navigationData = [
  { link: '/portal', label: 'Dashboard', icon: IconHome },
  { link: '/portal/profile', label: 'Profile', icon: IconUser },
  { link: '/portal/contact', label: 'Contact', icon: IconHelp },
] as const;

export const PortalSidebar = memo(() => {
  const pathname = usePathname();

  const links = navigationData.map((item) => (
    <NavLink
      key={item.label}
      className={classes.link}
      active={pathname === item.link}
      label={item.label}
      component={Link}
      href={item.link}
      leftSection={<item.icon className={classes.linkIcon} stroke={1.5} />}
    />
  ));

  return (
    <Box className={classes.navbar}>
      <Box className={classes.navbarMain}>
        <Stack gap="xs">{links}</Stack>
      </Box>
    </Box>
  );
});

PortalSidebar.displayName = 'PortalSidebar';
