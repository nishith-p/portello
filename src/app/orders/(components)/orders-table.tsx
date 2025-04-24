'use client';

import { IconPackage } from '@tabler/icons-react';
import { Badge, Card, Divider, Group, Paper, Stack, Table, Text } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { Order, OrderStatus } from '@/lib/store/types';
import { formatCurrency, formatDate } from '@/lib/utils';

interface OrdersTableProps {
  orders: Order[];
  onOrderClickAction: (order: Order) => void;
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

const getStatusColor = (status: OrderStatus): string => {
  return statusColorMap[status] || 'gray';
};

export const OrdersTable = ({ orders, onOrderClickAction }: OrdersTableProps) => {
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
              onClick={() => onOrderClickAction(order)}
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
                  <Badge color={getStatusColor(order.status)} variant="light">
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
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
              </Stack>
            </Card>
          ))
        )}
      </Stack>
    );
  }

  // Desktop Table View
  return (
    <Table
      striped
      highlightOnHover
      withTableBorder
      bg="white"
      horizontalSpacing="md"
      verticalSpacing="sm"
      fz="sm"
    >
      <Table.Thead>
        <Table.Tr>
          <Table.Th>Order ID</Table.Th>
          <Table.Th>Date</Table.Th>
          <Table.Th>Status</Table.Th>
          <Table.Th>Items</Table.Th>
          <Table.Th>Total</Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>
        {orders.length === 0 ? (
          <Table.Tr>
            <Table.Td colSpan={5}>
              <Text ta="center" c="dimmed" py="md">
                No orders found
              </Text>
            </Table.Td>
          </Table.Tr>
        ) : (
          orders.map((order) => (
            <Table.Tr
              key={order.id}
              onClick={() => onOrderClickAction(order)}
              style={{ cursor: 'pointer' }}
            >
              <Table.Td>
                <Text size="sm" fw={500}>
                  {order.id.substring(0, 8)}...
                </Text>
              </Table.Td>
              <Table.Td>
                <Text size="sm">{formatDate(order.created_at)}</Text>
              </Table.Td>
              <Table.Td>
                <Badge color={getStatusColor(order.status)} variant="light">
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
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
            </Table.Tr>
          ))
        )}
      </Table.Tbody>
    </Table>
  );
};
