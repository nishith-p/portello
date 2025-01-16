import cx from 'clsx';
import { Button, Container, Overlay, Text, Title } from '@mantine/core';
import classes from './HeroImageBackground.module.css';
import { Welcome } from '../Welcome/Welcome';
import { ColorSchemeToggle } from '../ColorSchemeToggle/ColorSchemeToggle';

export function HeroImageBackground() {
  return (
    <div className={classes.wrapper}>
      <Overlay color="#000" opacity={0.65} zIndex={1} />

      <div className={classes.inner}>
        <Welcome />
        <ColorSchemeToggle />
      </div>
    </div>
  );
}