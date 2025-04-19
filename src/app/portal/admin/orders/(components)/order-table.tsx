'use client';

import React from 'react';
import { IconEye, IconPackage } from '@tabler/icons-react';
import {
  ActionIcon,
  Badge,
  Card,
  Divider,
  Group,
  Paper,
  ScrollArea,
  Stack,
  Table,
  Text,
} from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { Order, OrderStatus } from '@/lib/store/types';
import { formatCurrency, formatDate } from '@/lib/utils';

interface OrderTableProps {
  orders: Order[];
  onViewOrderAction: (order: Order) => void;
}

const statusColorMap: Record<OrderStatus, string> = {
  pending: 'orange',
  confirmed: 'blue',
  paid: 'teal',
  processing: 'indigo',
  shipped: 'cyan',
  delivered: 'green',
  cancelled: 'red',
};

export function OrderTable({ orders, onViewOrderAction }: OrderTableProps) {
  const isMobile = useMediaQuery('(max-width: 768px)');

  if (isMobile) {
    return (
      <Stack>
        {orders.length === 0 ? (
          <Paper p="md" withBorder radius="md">
            <Text ta="center" c="dimmed">
              No orders found
            </Text>
          </Paper>
        ) : (
          orders.map((order) => (
            <Card
              key={order.id}
              shadow="sm"
              padding="md"
              radius="md"
              withBorder
              onClick={() => onViewOrderAction(order)}
              style={{ cursor: 'pointer' }}
            >
              <Stack gap="xs">
                <Group justify="space-between">
                  <Text fw={500} size="sm">
                    Order ID
                  </Text>
                  <Text size="sm" c="dimmed">
                    {order.id.substring(0, 8)}...
                  </Text>
                </Group>

                <Group justify="space-between">
                  <Text fw={500} size="sm">
                    Customer
                  </Text>
                  <Text size="sm" c="dimmed">
                    {order.user_id}
                  </Text>
                </Group>

                <Group justify="space-between">
                  <Text fw={500} size="sm">
                    Date
                  </Text>
                  <Text size="sm" c="dimmed">
                    {formatDate(order.created_at)}
                  </Text>
                </Group>

                <Group justify="space-between">
                  <Text fw={500} size="sm">
                    Status
                  </Text>
                  <Badge color={statusColorMap[order.status]} variant="filled">
                    {order.status.toUpperCase()}
                  </Badge>
                </Group>

                <Group justify="space-between">
                  <Text fw={500} size="sm">
                    Items
                  </Text>
                  <Group gap="xs">
                    <IconPackage size={16} />
                    <Text size="sm" c="dimmed">
                      {(order.items || []).length}
                    </Text>
                  </Group>
                </Group>

                <Divider />

                <Group justify="space-between">
                  <Text fw={500} size="sm">
                    Total
                  </Text>
                  <Text size="sm" fw={600}>
                    {formatCurrency(order.total_amount)}
                  </Text>
                </Group>

                <Group mt="xs" justify="flex-end">
                  <ActionIcon
                    variant="subtle"
                    color="blue"
                    onClick={(e) => {
                      e.stopPropagation();
                      onViewOrderAction(order);
                    }}
                  >
                    <IconEye size={18} />
                  </ActionIcon>
                </Group>
              </Stack>
            </Card>
          ))
        )}
      </Stack>
    );
  }

  // Desktop Table View
  return (
    <ScrollArea>
      <Table striped highlightOnHover withTableBorder>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Order ID</Table.Th>
            <Table.Th>Customer</Table.Th>
            <Table.Th>Date</Table.Th>
            <Table.Th>Status</Table.Th>
            <Table.Th>Items</Table.Th>
            <Table.Th>Total</Table.Th>
            <Table.Th style={{ width: 80 }}>Actions</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {orders.length === 0 ? (
            <Table.Tr>
              <Table.Td colSpan={7}>
                <Text ta="center" c="dimmed" py="md">
                  No orders found
                </Text>
              </Table.Td>
            </Table.Tr>
          ) : (
            orders.map((order) => (
              <Table.Tr
                key={order.id}
                style={{ cursor: 'pointer' }}
                onClick={() => onViewOrderAction(order)}
              >
                <Table.Td>
                  <Text size="sm" fw={500}>
                    {order.id.substring(0, 8)}...
                  </Text>
                </Table.Td>
                <Table.Td>
                  <Text size="sm">{order.user_id}</Text>
                </Table.Td>
                <Table.Td>
                  <Text size="sm">{formatDate(order.created_at)}</Text>
                </Table.Td>
                <Table.Td>
                  <Badge color={statusColorMap[order.status]} variant="filled">
                    {order.status.toUpperCase()}
                  </Badge>
                </Table.Td>
                <Table.Td>
                  <Group gap="xs">
                    <IconPackage size={16} />
                    <Text size="sm">{(order.items || []).length}</Text>
                  </Group>
                </Table.Td>
                <Table.Td>
                  <Text size="sm" fw={500}>
                    {formatCurrency(order.total_amount)}
                  </Text>
                </Table.Td>
                <Table.Td>
                  <Group gap="xs" justify="center">
                    <ActionIcon
                      variant="subtle"
                      color="blue"
                      onClick={(e) => {
                        e.stopPropagation();
                        onViewOrderAction(order);
                      }}
                    >
                      <IconEye size={16} />
                    </ActionIcon>
                  </Group>
                </Table.Td>
              </Table.Tr>
            ))
          )}
        </Table.Tbody>
      </Table>
    </ScrollArea>
  );
}
