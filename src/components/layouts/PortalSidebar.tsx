'use client';

import { memo } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useKindeBrowserClient } from '@kinde-oss/kinde-auth-nextjs';
import { IconFileDescription, IconHome, IconShirt, IconShoppingBag, IconUsers } from '@tabler/icons-react';
import { Box, NavLink, Stack, Tooltip } from '@mantine/core';
import classes from './PortalSidebar.module.css';

type NavigationItem = {
  link: string;
  label: string;
  icon: typeof IconHome;
  adminOnly?: boolean;
  disabledMessage?: string;
  children?: Array<{
    link: string;
    label: string;
  }>;
};

const navigationData: NavigationItem[] = [
  {
    link: '/portal',
    label: 'Dashboard',
    icon: IconHome,
  },
  {
    link: '/portal/delegates',
    label: 'Delegates',
    icon: IconUsers,
    adminOnly: true,
  },
  {
    link: '/portal/store',
    label: 'Store',
    icon: IconShirt,
    adminOnly: false,
    children: [
      { link: '/portal/store', label: 'View Store' },
      { link: '/portal/store/manage', label: 'Manage Store' },
    ],
  },
  {
    link: '/portal/orders',
    label: 'Orders',
    icon: IconShoppingBag,
  },
  {
    link: '/portal/payment',
    label: 'Payment',
    icon: IconFileDescription,
  },
];

export const PortalSidebar = memo(() => {
  const pathname = usePathname();
  const { permissions } = useKindeBrowserClient();
  const isAdmin = permissions?.permissions?.includes('dx:admin');

  return (
    <Box className={classes.navbar}>
      <Box className={classes.navbarMain}>
        <Stack gap="xs">
          {navigationData.map((item) => {
            // Skip profile for admins
            if (item.adminOnly === false && isAdmin) {
              return null;
            }

            // Skip admin-only items for non-admins
            if (item.adminOnly && !isAdmin) {
              return null;
            }

            // Check if this nav item should have nested children (only for Store and admins)
            const hasChildren = isAdmin && item.children && item.children.length > 0;

            // For items with children, create a parent NavLink that can expand
            if (hasChildren) {
              return (
                <NavLink
                  key={item.label}
                  className={classes.link}
                  label={item.label}
                  leftSection={<item.icon className={classes.linkIcon} stroke={1.5} />}
                  defaultOpened={pathname.startsWith(item.link)}
                >
                  {item.children!.map((child) => (
                    <NavLink
                      key={child.label}
                      className={classes.link}
                      active={pathname === child.link}
                      label={child.label}
                      component={Link}
                      href={child.link}
                      pl="36px"
                    />
                  ))}
                </NavLink>
              );
            }

            // For regular items without children, use the original logic
            const navLink = (
              <NavLink
                key={item.label}
                className={classes.link}
                active={pathname === item.link}
                label={item.label}
                component={Link}
                href={item.disabledMessage ? '#' : item.link}
                leftSection={<item.icon className={classes.linkIcon} stroke={1.5} />}
                disabled={!!item.disabledMessage}
                onClick={item.disabledMessage ? (e) => e.preventDefault() : undefined}
              />
            );

            if (item.disabledMessage) {
              return (
                <Box key={item.label} style={{ cursor: 'not-allowed' }}>
                  <Tooltip label={item.disabledMessage} position="bottom-end" offset={5}>
                    <div>{navLink}</div>
                  </Tooltip>
                </Box>
              );
            }

            return navLink;
          })}
        </Stack>
      </Box>
    </Box>
  );
});

PortalSidebar.displayName = 'PortalSidebar';
