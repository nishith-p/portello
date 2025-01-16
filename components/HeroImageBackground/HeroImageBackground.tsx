import { Overlay } from '@mantine/core';
import { Welcome } from '../Welcome/Welcome';
import classes from './HeroImageBackground.module.css';
import Countdown from '../Countdown/Countdown';

export function HeroImageBackground() {
  return (
    <div className={classes.wrapper}>
      <Overlay color="#000" opacity={0.65} zIndex={1} />

      <div className={classes.inner}>
        <Welcome />
        <Countdown targetDate="2025-01-31T23:59:59"/>
      </div>
    </div>
  );
}
