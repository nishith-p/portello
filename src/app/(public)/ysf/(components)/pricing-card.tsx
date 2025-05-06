'use client';

import { Badge, Button, Card, Group, Stack, Text } from '@mantine/core';
import styles from './pricing-card.module.css';

export interface PricingFeature {
  text: string;
}

export interface PricingCardProps {
  title: string;
  price: number;
  currency?: string;
  features: PricingFeature[];
  buttonText?: string;
  highlighted?: boolean;
  badge?: string;
  badgeColor?: string;
  originalPrice?: string;
  onClick?: () => void;
}

export function PricingCard({
  title,
  price,
  currency = 'Rs.',
  features,
  buttonText = 'SELECT',
  highlighted = false,
  badge,
  badgeColor,
  originalPrice,
  onClick,
}: PricingCardProps) {
  const cardClassName = highlighted ? `${styles.card} ${styles.highlighted}` : styles.card;

  const titleClassName = highlighted ? `${styles.title} ${styles.highlightedTitle}` : styles.title;

  const priceClassName = highlighted ? `${styles.price} ${styles.highlightedPrice}` : styles.price;

  return (
    <Card
      className={cardClassName}
      shadow="sm"
      padding="lg"
      radius="md"
      withBorder={!highlighted}
      pos="relative"
    >
      <Stack gap="xs">
        <Text className={titleClassName}>{title}</Text>

        {badge && (
          <Badge className={styles.badge} color={badgeColor} variant="filled">
            {badge}
          </Badge>
        )}

        <Group justify="center" gap={4}>
          <Text className={priceClassName}>
            {originalPrice && (
              <Text
                span
                size="lg"
                className={`${styles.strikethrough} ${highlighted ? styles.strikeLightGray : styles.strikeDarkGray}`}
              >
                {currency}
                {originalPrice}
              </Text>
            )}
            {currency}
            {price}
          </Text>
        </Group>

        {features.map((feature, index) => {
          const featureClassName = highlighted
            ? `${styles.feature} ${styles.highlightedFeature}`
            : styles.feature;

          return (
            <Text key={index} className={featureClassName} c={highlighted ? 'white' : 'dimmed'}>
              {feature.text}
            </Text>
          );
        })}
      </Stack>

      <Button
        className={styles.button}
        fullWidth
        color={highlighted ? 'violet' : 'violet'}
        variant={highlighted ? 'white' : 'filled'}
        onClick={onClick}
      >
        {buttonText}
      </Button>
    </Card>
  );
}
