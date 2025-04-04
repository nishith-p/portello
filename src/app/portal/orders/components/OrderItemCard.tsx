import { Badge, Box, Flex, Group, Image, Paper, Text } from '@mantine/core';
import { OrderItem } from '../types';


interface OrderItemCardProps {
  item: OrderItem;
}

export const OrderItemCard = ({ item }: OrderItemCardProps): JSX.Element => (
  <Paper key={item.id} withBorder p="md" radius="md">
    <Flex gap="md">
      <Box w={70} h={70} style={{ overflow: 'hidden', borderRadius: 8 }}>
        <Image
          src={item.image || undefined}
          alt={item.name || 'Product'}
          fit="cover"
          w={70}
          h={70}
          fallbackSrc="https://placehold.co/100x100?text=?"
        />
      </Box>
      <Box style={{ flex: 1 }}>
        <Text fw={500}>{item.name || `Product (${item.item_code})`}</Text>
        <Group gap="xs" mb="xs">
          {item.size && (
            <Badge size="sm" variant="outline">
              Size: {item.size}
            </Badge>
          )}
          {item.color && (
            <Badge
              size="sm"
              variant="outline"
              leftSection={
                item.color_hex ? (
                  <div
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: '50%',
                      backgroundColor: item.color_hex,
                      border: '1px solid rgba(0, 0, 0, 0.1)',
                    }}
                  />
                ) : null
              }
            >
              {item.color}
            </Badge>
          )}
        </Group>
        <Flex justify="space-between" align="center">
          <Text size="sm">Quantity: {item.quantity}</Text>
          <Text fw={500}>${(item.price * item.quantity).toFixed(2)}</Text>
        </Flex>
      </Box>
    </Flex>
  </Paper>
);