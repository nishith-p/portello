import { useState } from 'react';
import { IconPackage } from '@tabler/icons-react';
import {
  Badge,
  Box,
  Divider,
  Flex,
  Group,
  Image,
  Modal,
  ScrollArea,
  Stack,
  Text,
} from '@mantine/core';
import {
  formatCurrency,
  formatDate,
  getStatusColor,
} from '@/app/portal/orders/(utils)/order-utils';
import { Order, OrderItem } from '@/lib/store/types';

interface OrderDetailsModalProps {
  order: Order | null;
  opened: boolean;
  onClose: () => void;
}

export const OrderDetailsModal = ({
  order,
  opened,
  onClose,
}: OrderDetailsModalProps): JSX.Element => {
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  const handleImageError = (id: string) => {
    setImageErrors((prev) => ({ ...prev, [id]: true }));
  };

  if (!order) {
    return (
      <Modal opened={opened} onClose={onClose} title="Order Details" centered>
        <Text>No order data available</Text>
      </Modal>
    );
  }

  const orderItems = order.order_items;

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={
        <Text fw={600} size="lg">
          Order Details
        </Text>
      }
      size="lg"
      centered
    >
      <Stack gap="lg">
        <Group justify="space-between">
          <Stack gap={4}>
            <Text size="sm" c="dimmed">
              Order ID
            </Text>
            <Text fw={500}>{order.id}</Text>
          </Stack>
          <Badge color={getStatusColor(order.status)} size="lg">
            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
          </Badge>
        </Group>

        <Box>
          <Group justify="space-between" mb="xs">
            <Text fw={500}>Order Date</Text>
            <Text>{formatDate(order.created_at)}</Text>
          </Group>
          {order.last_status_change && (
            <Group justify="space-between">
              <Text fw={500}>Last Updated</Text>
              <Text>{formatDate(order.last_status_change)}</Text>
            </Group>
          )}
        </Box>

        <Divider />

        <Text fw={600} size="md">
          Items
        </Text>

        <ScrollArea.Autosize mah={300}>
          <Stack gap="md">
            {orderItems.map((item: OrderItem, index: number) => {
              const key = item.id || `temp-${index}`;
              const showFallback = imageErrors[key] || !item.image;

              return (
                <Box
                  key={key}
                  p="sm"
                  style={{
                    borderRadius: 'var(--mantine-radius-sm)',
                    backgroundColor: 'white',
                    border: '1px solid var(--mantine-color-gray-2)',
                  }}
                >
                  <Flex align="center" justify="center" gap="md">
                    {showFallback ? (
                      <Box
                        w={60}
                        h={60}
                        bg="gray.1"
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          borderRadius: 'var(--mantine-radius-sm)',
                        }}
                      >
                        <IconPackage size={24} color="gray" />
                      </Box>
                    ) : (
                      <Box
                        w={60}
                        h={60}
                        style={{
                          borderRadius: 'var(--mantine-radius-sm)',
                          overflow: 'hidden',
                          position: 'relative',
                        }}
                      >
                        <Image
                          src={item.image}
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            position: 'absolute',
                            top: 0,
                            left: 0,
                          }}
                          onError={() => handleImageError(key)}
                          alt={item.name || 'Product'}
                        />
                      </Box>
                    )}

                    <Box style={{ flex: 1 }}>
                      <Group justify="space-between" mb={4}>
                        <Text fw={500}>{item.name || `Product ${index + 1}`}</Text>
                        <Text fw={500}>{formatCurrency(item.price * item.quantity)}</Text>
                      </Group>

                      <Text size="sm" c="dimmed" mb={4}>
                        {formatCurrency(item.price)} × {item.quantity}
                      </Text>

                      <Group gap="xs">
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
                    </Box>
                  </Flex>
                </Box>
              );
            })}
          </Stack>
        </ScrollArea.Autosize>

        <Divider />

        <Group justify="space-between">
          <Text fw={600} size="lg">
            Total
          </Text>
          <Text fw={600} size="lg">
            {formatCurrency(order.total_amount)}
          </Text>
        </Group>
      </Stack>
    </Modal>
  );
};
