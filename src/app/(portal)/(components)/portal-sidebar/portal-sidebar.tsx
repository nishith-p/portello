'use client';

import React, { memo } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useKindeBrowserClient } from '@kinde-oss/kinde-auth-nextjs';
import {
  IconAddressBook,
  IconCreditCard,
  IconHome,
  IconSettings,
  IconShirt,
  IconShoppingBag,
  IconUsers,
  IconFileText,
  IconArmchair,
} from '@tabler/icons-react';
import { Box, NavLink, Stack, Tooltip, Divider } from '@mantine/core';
import classes from './portal-sidebar.module.css';

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
    link: '/',
    label: 'Dashboard',
    icon: IconHome,
  },
  {
    link: '/admin/delegates',
    label: 'Delegates',
    icon: IconUsers,
    adminOnly: true,
  },
  {
    link: '/store',
    label: 'Store',
    icon: IconShirt,
    children: [
      { link: '/store', label: 'View Store' },
      { link: '/admin/store', label: 'Manage Items' },
      { link: '/admin/store/packs', label: 'Manage Packs' },
    ],
  },
  {
    link: '/orders',
    label: 'Orders',
    icon: IconShoppingBag,
    children: [
      { link: '/admin/orders', label: 'Manage Orders' },
      { link: '/admin/orders/items', label: 'Item Quantities' },
    ],
  },
  {
    link: '/payments',
    label: 'Delegate Payments',
    icon: IconCreditCard,
    adminOnly: false,
  },
  {
    link: '/gala',
    label: 'Gala Seating',
    icon: IconArmchair,
    adminOnly: false,
  },
  {
    link: '/admin/gala',
    label: 'Gala Dashboard',
    icon: IconArmchair,
    adminOnly: true,
  },
  {
    link: '/contact',
    label: 'Contact',
    icon: IconAddressBook,
  },
  {
    link: '/settings',
    label: 'Settings',
    icon: IconSettings,
    adminOnly: false,
  },
];

const policyLinks = [
  {
    link: 'https://www.ic2025.org/privacy-policy',
    label: 'Privacy & Cookie Policy',
    icon: IconFileText,
  },
  {
    link: 'https://www.ic2025.org/terms-and-conditions',
    label: 'Terms & Conditions',
    icon: IconFileText,
  },
  {
    link: 'https://www.ic2025.org/refund-policy',
    label: 'Cancellation & Refund Policy',
    icon: IconFileText,
  },
];

interface PortalSidebarProps {
  onNavigate?: () => void;
}

export const PortalSidebar = memo(({ onNavigate }: PortalSidebarProps) => {
  const pathname = usePathname();
  const { permissions } = useKindeBrowserClient();
  const isAdmin = permissions?.permissions?.includes('dx:admin');

  // For Mobile
  const handleNavClick = (event: React.MouseEvent<HTMLAnchorElement>, hasDisabledMessage: boolean) => {
    if (hasDisabledMessage) {
      event.preventDefault();
      return;
    }

    if (onNavigate) {
      onNavigate();
    }
  };

  return (
    <Box className={classes.navbar}>
      <Box className={classes.navbarMain}>
        <Stack gap="xs">
          {navigationData.map((item) => {
            if (item.adminOnly === false && isAdmin) {
              return null;
            }

            if (item.adminOnly && !isAdmin) {
              return null;
            }

            // Check if this nav item should have nested children
            const hasChildren = isAdmin && item.children && item.children.length > 0;

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
                      onClick={(e) => handleNavClick(e, false)}
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
                onClick={(e) => handleNavClick(e, !!item.disabledMessage)}
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

      {/* Policy Links Section */}
      <Box>
        <Divider my="sm" />
        <Stack gap="xs">
          {policyLinks.map((item) => (
            <NavLink
              key={item.label}
              className={classes.link}
              active={pathname === item.link}
              label={item.label}
              component={Link}
              href={item.link}
              leftSection={<item.icon className={classes.linkIcon} stroke={1.5} />}
              onClick={(e) => handleNavClick(e, false)}
            />
          ))}
        </Stack>
      </Box>
    </Box>
  );
});

PortalSidebar.displayName = 'PortalSidebar';
