// (portal)/orders/(components)/order-details-modal.tsx
'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import {
  Badge,
  Box,
  Button,
  Card,
  Divider,
  Flex,
  Grid,
  Group,
  Modal,
  Stack,
  Text,
  Tooltip,
} from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { Order, OrderItem, OrderStatus } from '@/lib/store/types';
import { formatCurrency, formatDate } from '@/lib/utils';

interface OrderDetailsModalProps {
  opened: boolean;
  onCloseAction: () => void;
  order: Order | null;
}

const statusColorMap: Record<OrderStatus, string> = {
  pending: 'orange',
  confirmed: 'blue',
  paid: 'teal',
  processing: 'indigo',
  shipped: 'cyan',
  delivered: 'green',
  cancelled: 'red',
  'payment pending': 'orange',
  'payment cancelled': 'red',
  'payment failed': 'red',
  'charged back': 'purple',
  failed: 'red',
};

export function OrderDetailsModal({ opened, onCloseAction, order }: OrderDetailsModalProps) {
  const isMobile = useMediaQuery('(max-width: 768px)');
  const router = useRouter();

  const handlePayNow = (orderData: Order) => {
    router.push(`/orders/${orderData.id}`);
  };

  const isDelegateFeeOrder = order?.items?.some(item => item.item_code === 'DELEGATE_FEE');

  if (!order) {
    return <></>;
  }

  const orderItems: OrderItem[] = order.items || [];

  return (
    <Modal
      opened={opened}
      onClose={onCloseAction}
      title={
        <Text fw={700} size="lg">
          {isDelegateFeeOrder ? 'Delegate Fee Payment' : 'Order Details'}
        </Text>
      }
      size={isMobile ? '95%' : 'lg'}
      centered
    >
      <Stack gap="md">
        <Card withBorder padding="md">
          <Text fw={600} mb="md">
            {isDelegateFeeOrder ? 'Payment Information' : 'Order Information'}
          </Text>

          <Stack gap="xs">
            <Box py={5} px="sm" bg="gray.0" style={{ borderRadius: 4 }}>
              <Tooltip label="Click to copy" position="right">
                <Text
                  size="sm"
                  style={{ cursor: 'pointer' }}
                  onClick={async () => {
                    await navigator.clipboard.writeText(order.id);
                  }}
                >
                  <Text span fw={500}>
                    {isDelegateFeeOrder ? 'Payment ID:' : 'Order ID:'}
                  </Text>
                  {order.id}
                </Text>
              </Tooltip>
            </Box>

            <Grid gutter="xs">
              <Grid.Col span={isMobile ? 12 : 6}>
                <Box py={5} px="sm">
                  <Text size="sm">
                    <Text span fw={500}>
                      Date:{' '}
                    </Text>
                    {formatDate(order.created_at)}
                  </Text>
                </Box>
              </Grid.Col>

              <Grid.Col span={isMobile ? 12 : 6}>
                <Box py={5} px="sm">
                  <Group gap="xs">
                    <Text size="sm" fw={500}>
                      Status:
                    </Text>
                    <Badge color={statusColorMap[order.status]} variant="light">
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </Badge>
                  </Group>
                </Box>
              </Grid.Col>
            </Grid>

            <Box py={5} px="sm" bg="gray.0" style={{ borderRadius: 4 }}>
              <Group justify="space-between">
                <Text size="sm" fw={500}>
                  Total Amount:
                </Text>
                <Text fw={700} size="md">
                  {formatCurrency(order.total_amount)}
                </Text>
              </Group>
            </Box>
          </Stack>
        </Card>

        <Card withBorder padding="md">
          <Text fw={600} mb="md">
            {isDelegateFeeOrder ? 'Payment Details' : `Order Items (${orderItems.length})`}
          </Text>

          {orderItems.length === 0 ? (
            <Text c="dimmed">No items in this order</Text>
          ) : (
            <Stack gap="md">
              {orderItems.map((item) => (
                <Card key={item.id} withBorder>
                  <Grid gutter="md" align="center">
                    <Grid.Col span={{ base: 12, sm: 8 }}>
                      <Text fw={500}>{item.name || `Item ${item.item_code}`}</Text>
                      {item.item_code === 'DELEGATE_FEE' && item.description && (
                        <Text size="sm" c="dimmed">
                          {item.description}
                        </Text>
                      )}
                    </Grid.Col>
                    <Grid.Col span={{ base: 12, sm: 4 }}>
                      <Flex
                        justify={isMobile ? 'space-between' : 'flex-end'}
                        align="center"
                      >
                        <Text>
                          {formatCurrency(item.price)} × {item.quantity}
                        </Text>
                        <Text fw={700}>{formatCurrency(item.price * item.quantity)}</Text>
                      </Flex>
                    </Grid.Col>
                  </Grid>
                </Card>
              ))}
            </Stack>
          )}

          <Divider my="lg" label="Summary" labelPosition="center" />

          <Card p="md" withBorder bg="gray.0">
            <Group justify="space-between">
              <Text fw={500}>{isDelegateFeeOrder ? 'Payment Total' : 'Order Total'}</Text>
              <Text fw={700} size="lg">
                {formatCurrency(order.total_amount)}
              </Text>
            </Group>
          </Card>

          {order.status !== 'paid' && (
            <Button 
              color="green" 
              size="md" 
              mt="md" 
              fullWidth
              onClick={() => handlePayNow(order)}
            >
              {isDelegateFeeOrder ? 'Pay Delegate Fee' : 'Checkout'}
            </Button>
          )}
        </Card>
      </Stack>
    </Modal>
  );
}
