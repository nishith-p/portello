'use client';

import { useState } from 'react';
import { IconPackages } from '@tabler/icons-react';
import { Badge, Box, Card, Center, Flex, Text } from '@mantine/core';
import { StorePack } from '@/lib/store/types';
import classes from './pack-card.module.css';

interface PackCardProps {
  pack: StorePack;
  onViewPackAction: (pack: StorePack) => void;
}

export function PackCard({ pack, onViewPackAction }: PackCardProps) {
  const [imageError, setImageError] = useState<boolean>(false);

  const handleImageError = (): void => {
    setImageError(true);
  };

  // Calculate total items in the pack
  const totalItems = pack.pack_items?.reduce((sum, item) => sum + item.quantity, 0) || 0;

  return (
    <Card
      padding={0}
      radius="md"
      withBorder
      className={classes.card}
      onClick={() => onViewPackAction(pack)}
      style={{ cursor: 'pointer' }}
    >
      <div className={classes.imageContainer}>
        {pack.images.length > 0 && !imageError ? (
          <img
            src={pack.images[0]}
            alt={pack.name}
            className={classes.image}
            onError={handleImageError}
          />
        ) : (
          <Center className={classes.placeholderContainer}>
            <IconPackages size={80} color="gray" />
          </Center>
        )}
        <Badge className={classes.packBadge} size="md" color="blue">
          Pack
        </Badge>

        {pack.pre_price !== 0 && pack.discount_perc !== 0 && (
          <div className={classes.discountBadge}>-{pack.discount_perc}%</div>
        )}
      </div>

      <Box px="md" py="xs" pos="relative">
        {pack.pre_price !== 0 && pack.discount_perc !== 0 ? (
          <>
            <Flex gap={8} align="center" mb={4}>
              <Text td="line-through" c="gray">
                €{pack.pre_price?.toFixed(2)}
              </Text>
              <Text fw={700} size="xl" c="blue">
                €{pack.price.toFixed(2)}
              </Text>
            </Flex>
          </>
        ) : (
          <Text fw={700} size="xl" c="gray" mb={4}>
            €{pack.price.toFixed(2)}
          </Text>
        )}

        {/* Pack Name */}
        <Text fw={600} size="md" mb={4} lineClamp={1}>
          {pack.name}
        </Text>

        {/* Pack Code and Items Count */}
        <Text size="sm" c="dimmed">
          {pack.pack_code} • {totalItems} item{totalItems !== 1 ? 's' : ''}
        </Text>
      </Box>
    </Card>
  );
}
