import { useState } from 'react';
import {
  IconHome,
  IconUserCircle,
  IconUsers,
  IconCalendarClock,
  IconBuildingStore,
  IconShoppingCart,
  IconAddressBook,
  IconLogout
} from '@tabler/icons-react';
import { Group } from '@mantine/core';
import classes from './LeftsideBar.module.css';
import Link from 'next/link';

const data = [
  { link: '/', label: 'Home', icon: IconHome },
  { link: '/profile', label: 'Profile', icon: IconUserCircle },
  { link: '/entityDelegates', label: 'Entity Delegates', icon: IconUsers },
  { link: '/agenda', label: 'Agenda', icon: IconCalendarClock },
  { link: '/store', label: 'Store', icon: IconBuildingStore },
  { link: '/cart', label: 'Orders', icon: IconShoppingCart },
  { link: '/contact', label: 'Contact', icon: IconAddressBook },
];

export function LeftsideBar() {
  const [active, setActive] = useState('Home');

  const links = data.map((item) => (
    <Link
      className={classes.link}
      data-active={item.label === active || undefined}
      href={item.link}
      key={item.label}
      onClick={(event) => {
        setActive(item.label);
      }}
    >
      <item.icon className={classes.linkIcon} stroke={1.5} />
      <span>{item.label}</span>
    </Link>
  ));

  return (
    <nav className={classes.navbar}>
      <div className={classes.navbarMain}>
        <Group className={classes.header} justify="space-between">
          IC 2025
        </Group>
        {links}
      </div>

      <div className={classes.footer}>
          <a href="#" className={classes.link} onClick={(event) => event.preventDefault()}>
          <IconLogout className={classes.linkIcon} stroke={1.5} />
          <span>Logout</span>
        </a>
      </div>
    </nav>
  );
}