import { Overlay } from '@mantine/core';
import { Welcome } from '../Welcome/Welcome';
import classes from './HeroImageBackground.module.css';
import CountdownTimer from '../Countdown/Countdown';

export function HeroImageBackground() {
  return (
    <div className={classes.wrapper}>
      <Overlay color="#000" opacity={0.65} zIndex={1} />

      <div className={classes.inner}>
        <Welcome />
        <CountdownTimer targetDate="2025-02-01T19:38:59"/>
      </div>
    </div>
  );
}
