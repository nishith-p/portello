'use client';

import { IconShirt } from '@tabler/icons-react';
import { Badge, Button, Card, Center, Flex, Image, Stack, Text } from '@mantine/core';
import { Item } from '@/types/store';
import classes from './ProductCard.module.css';

interface ProductCardProps {
  item: Item;
  onViewProduct: (item: Item) => void;
}

export function ProductCard({ item, onViewProduct }: ProductCardProps) {
  return (
    <Card key={item.id} shadow="sm" padding="lg" radius="md" withBorder>
      <Card.Section>
        {item.images.length > 0 ? (
          <Image src={item.images[0]} h={200} fit="cover" alt={item.name} />
        ) : (
          <Center h={200} className={classes.imagePlaceholder}>
            <IconShirt size={60} color="gray" />
          </Center>
        )}
      </Card.Section>

      <Stack mt="md" gap="xs">
        <Flex justify="space-between" align="flex-start">
          <Text fw={600} size="lg" lineClamp={1} style={{ flexGrow: 1, marginRight: 10 }}>
            {item.name}
          </Text>
          <Badge
            color="blue"
            variant="filled"
            size="lg"
            style={{ whiteSpace: 'nowrap', minWidth: 'auto', flexShrink: 0 }}
          >
            ${item.price.toFixed(2)}
          </Badge>
        </Flex>

        <Text size="sm" c="dimmed" mb="xs">
          ID: {item.id}
        </Text>

        <Text lineClamp={2} size="sm" c="dimmed" mb="xs">
          {item.description}
        </Text>

        <Button
          variant="light"
          color="blue"
          fullWidth
          onClick={() => onViewProduct(item)}
          radius="md"
          mt="auto"
        >
          View Product
        </Button>
      </Stack>
    </Card>
  );
}