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
  IconUsers,
} from '@tabler/icons-react';
import { Box, NavLink, Stack, Tooltip } from '@mantine/core';
import { useUser } from '@/lib/hooks/useUser';
import { UserStatus } from '@/types/user';
import classes from './styles/PortalSidebar.module.css';

type NavigationItem = {
  link: string;
  label: string;
  icon?: typeof IconHome;
  allowedStatuses: readonly UserStatus[];
  disabledMessage?: string;
  children?: Omit<NavigationItem, 'children'>[];
};

const navigationData: NavigationItem[] = [
  {
    link: '/portal',
    label: 'Dashboard',
    icon: IconHome,
    allowedStatuses: ['pending', 'approved', 'rejected', 'admin'],
  },
  {
    link: '/portal/profile',
    label: 'Profile',
    icon: IconUser,
    allowedStatuses: ['pending', 'approved', 'rejected'],
  },
  {
    link: '/portal/delegates',
    label: 'Delegates',
    icon: IconUsers,
    allowedStatuses: ['approved', 'admin'],
  },
  {
    link: '/portal/booklets',
    label: 'Booklets',
    icon: IconBook2,
    allowedStatuses: ['pending', 'approved', 'rejected', 'admin'],
  },
  {
    link: '/portal/store',
    label: 'Store',
    icon: IconShirt,
    allowedStatuses: ['admin'],
    disabledMessage: 'Merch store will be available soon',
  },
  {
    link: '/portal/orders',
    label: 'Orders',
    icon: IconShoppingBag,
    allowedStatuses: ['approved', 'admin'],
    disabledMessage: 'Only available for approved delegates',
  },
  {
    link: '/portal/contact',
    label: 'Contact',
    icon: IconHelp,
    allowedStatuses: ['pending', 'approved', 'rejected', 'admin'],
  },
];

const renderNavLink = (
  item: NavigationItem,
  userStatus: UserStatus,
  pathname: string,
  level = 0
) => {
  const isDisabled = !item.allowedStatuses.includes(userStatus);
  const isAdmin = userStatus === 'admin';
  const shouldShowChildren = isAdmin && item.children;

  const navLink = (
    <NavLink
      key={item.label}
      className={classes.link}
      active={pathname === item.link}
      label={item.label}
      component={Link}
      href={isDisabled ? '#' : item.link}
      leftSection={item.icon ? <item.icon className={classes.linkIcon} stroke={1.5} /> : null}
      disabled={isDisabled}
      onClick={isDisabled ? (e) => e.preventDefault() : undefined}
      pl={level ? `${level * 20 + 16}px` : undefined}
      defaultOpened={pathname.startsWith(item.link)}
    >
      {shouldShowChildren &&
        item.children?.map((child) => renderNavLink(child, userStatus, pathname, level + 1))}
    </NavLink>
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
};

export const PortalSidebar = memo(() => {
  const pathname = usePathname();
  const { user } = useKindeBrowserClient();
  const { data: userData } = useUser(user?.id);
  const userStatus = userData?.status || 'pending';

  const links = navigationData
    .map((item) => {
      // Hide profile for admin
      if (userStatus === 'admin' && item.link === '/portal/profile') {
        return null;
      }

      // // Hide nested order links for non-admin users
      // if (
      //   (item.link === '/portal/orders' || item.link === '/portal/delegates') &&
      //   userStatus !== 'admin'
      // ) {
      //   const { children, ...orderItem } = item;
      //   return renderNavLink(orderItem, userStatus, pathname);
      // }

      return renderNavLink(item, userStatus, pathname);
    })
    .filter(Boolean);

  return (
    <Box className={classes.navbar}>
      <Box className={classes.navbarMain}>
        <Stack gap="xs">{links}</Stack>
      </Box>
    </Box>
  );
});

PortalSidebar.displayName = 'PortalSidebar';
