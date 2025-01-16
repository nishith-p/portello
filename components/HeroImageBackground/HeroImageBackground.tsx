import cx from 'clsx';
import { Button, Container, Overlay, Text, Title } from '@mantine/core';
import { ColorSchemeToggle } from '../ColorSchemeToggle/ColorSchemeToggle';
import { Welcome } from '../Welcome/Welcome';
import classes from './HeroImageBackground.module.css';

export function HeroImageBackground() {
  return (
    <div className={classes.wrapper}>
      <Overlay color="#000" opacity={0.65} zIndex={1} />

      <div className={classes.inner}>
        <Welcome />
        <ColorSchemeToggle />
        <div className={classes.controls}>
          <Button
            className={classes.control}
            variant="white"
            size="lg"
            component="a"
            href="/delegateForm"
          >
            Register for IC 2025
          </Button>
        </div>
      </div>
    </div>
  );
}
