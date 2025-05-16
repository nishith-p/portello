import { Button, Card, Overlay, Text } from '@mantine/core';
import classes from './discount-banner.module.css';

export function DiscountBanner() {
  return (
    <Card radius="md" className={classes.card}>
      <Overlay className={classes.overlay} opacity={0.55} zIndex={0} />

      <div className={classes.content}>
        <Text size="lg" fw={700} className={classes.title}>
          A 10% Special Discount for All Merch Payments !
        </Text>
      </div>
    </Card>
  );
}
