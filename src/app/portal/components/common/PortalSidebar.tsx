'use client';

import { memo } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useKindeBrowserClient } from '@kinde-oss/kinde-auth-nextjs';
import {
  IconBook2,
  IconHelp,
  IconHome,
  IconShirt,
  IconShoppingBag,
  IconUser,
} from '@tabler/icons-react';
import { Box, NavLink, Stack, Tooltip } from '@mantine/core';
import { useUser } from '@/lib/hooks/useUser';
import { UserStatus } from '@/types/user';
import classes from './styles/PortalSidebar.module.css';

type NavigationItem = {
  link: string;
  label: string;
  icon: typeof IconHome;
  allowedStatuses: readonly UserStatus[];
  disabledMessage?: string;
};

const navigationData: NavigationItem[] = [
  {
    link: '/portal',
    label: 'Dashboard',
    icon: IconHome,
    allowedStatuses: ['pending', 'approved', 'rejected'],
  },
  {
    link: '/portal/profile',
    label: 'Profile',
    icon: IconUser,
    allowedStatuses: ['pending', 'approved', 'rejected'],
  },
  {
    link: '/portal/booklets',
    label: 'Booklets',
    icon: IconBook2,
    allowedStatuses: ['pending', 'approved', 'rejected'],
  },
  {
    link: '/portal/store',
    label: 'Store',
    icon: IconShirt,
    allowedStatuses: ['approved'],
    disabledMessage: 'Only available for approved delegates',
  },
  {
    link: '/portal/orders',
    label: 'Orders',
    icon: IconShoppingBag,
    allowedStatuses: ['approved'],
    disabledMessage: 'Only available for approved delegates',
  },
  {
    link: '/portal/contact',
    label: 'Contact',
    icon: IconHelp,
    allowedStatuses: ['pending', 'approved', 'rejected'],
  },
];

export const PortalSidebar = memo(() => {
  const pathname = usePathname();
  const { user } = useKindeBrowserClient();
  const { data: userData } = useUser(user?.id);
  const userStatus = userData?.status || 'pending';

  const links = navigationData.map((item) => {
    const isDisabled = !item.allowedStatuses.includes(userStatus);
    const navLink = (
      <NavLink
        key={item.label}
        className={classes.link}
        active={pathname === item.link}
        label={item.label}
        component={Link}
        href={isDisabled ? '#' : item.link}
        leftSection={<item.icon className={classes.linkIcon} stroke={1.5} />}
        disabled={isDisabled}
        onClick={isDisabled ? (e) => e.preventDefault() : undefined}
      />
    );

    if (isDisabled && item.disabledMessage) {
      return (
        <Box key={item.label} style={{ cursor: 'not-allowed' }}>
          <Tooltip label={item.disabledMessage} position="bottom-end" offset={5}>
            <div>{navLink}</div>
          </Tooltip>
        </Box>
      );
    }

    return navLink;
  });

  return (
    <Box className={classes.navbar}>
      <Box className={classes.navbarMain}>
        <Stack gap="xs">{links}</Stack>
      </Box>
    </Box>
  );
});

PortalSidebar.displayName = 'PortalSidebar';
