'use client';

import { useState } from 'react';
import { IconShirt } from '@tabler/icons-react';
import { Box, Card, Center, Text } from '@mantine/core';
import { StoreItem } from '@/lib/store/types';
import classes from './product-card.module.css';

interface ProductCardProps {
  item: StoreItem;
  onViewProductAction: (item: StoreItem) => void;
}

export function ProductCard({ item, onViewProductAction }: ProductCardProps) {
  const [imageError, setImageError] = useState<boolean>(false);

  const handleImageError = (): void => {
    setImageError(true);
  };

  return (
    <Card
      padding={0}
      radius="md"
      withBorder
      className={classes.card}
      onClick={() => onViewProductAction(item)}
      style={{ cursor: 'pointer' }}
    >
      <div className={classes.imageContainer}>
        {item.images.length > 0 && !imageError ? (
          <img
            src={item.images[0]}
            alt={item.name}
            className={classes.image}
            onError={handleImageError}
          />
        ) : (
          <Center className={classes.placeholderContainer}>
            <IconShirt size={80} color="gray" />
          </Center>
        )}
      </div>

      <Box px="md" py="xs" pos="relative">
        {/* Price */}
        <Text fw={700} size="xl" mb={8}>
          ${item.price.toFixed(2)}
        </Text>

        {/* Product Name */}
        <Text fw={600} size="md" mb={4} lineClamp={1}>
          {item.name}
        </Text>

        {/* Item ID */}
        <Text size="sm" c="dimmed" mb={8}>
          {item.item_code}
        </Text>
      </Box>
    </Card>
  );
}
