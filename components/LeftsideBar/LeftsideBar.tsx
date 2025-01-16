import { useState } from 'react';
import {
  IconHome,
  IconUserCircle,
  IconUsers,
  IconCalendarClock,
  IconBuildingStore,
  IconTruckDelivery,
  IconAddressBook,
  IconLogout
} from '@tabler/icons-react';
import { Code, Group } from '@mantine/core';
import classes from './LeftsideBar.module.css';

const data = [
  { link: '', label: 'Home', icon: IconHome },
  { link: '', label: 'Profile', icon: IconUserCircle },
  { link: '', label: 'Entity Delegates', icon: IconUsers },
  { link: '', label: 'Agenda', icon: IconCalendarClock },
  { link: '', label: 'Store', icon: IconBuildingStore },
  { link: '', label: 'Orders', icon: IconTruckDelivery },
  { link: '', label: 'Contact', icon: IconAddressBook },
];

export function LeftsideBar() {
  const [active, setActive] = useState('Billing');

  const links = data.map((item) => (
    <a
      className={classes.link}
      data-active={item.label === active || undefined}
      href={item.link}
      key={item.label}
      onClick={(event) => {
        event.preventDefault();
        setActive(item.label);
      }}
    >
      <item.icon className={classes.linkIcon} stroke={1.5} />
      <span>{item.label}</span>
    </a>
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