import { Card, Overlay, Text, MantineSize } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import classes from './discount-banner.module.css';

export function DiscountBanner() {
  const isMobile = useMediaQuery('(max-width: 48em)'); // 768px
  const isTablet = useMediaQuery('(min-width: 48.0625em) and (max-width: 64em)'); // 768px-1024px

  const textSize: MantineSize = isMobile ? 'sm' : isTablet ? 'md' : 'lg';

  return (
    <Card radius="md" className={classes.card}>
      <Overlay className={classes.overlay} opacity={0.75} zIndex={0} />

      <div className={classes.content}>
        <Text size={textSize} fw={700} className={classes.title}>
          10% Special Discount for ALL MERCH PAYMENTS on Checkout!
        </Text>
      </div>
    </Card>
  );
}