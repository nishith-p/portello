import React from 'react';
import { IconEye } from '@tabler/icons-react';
import { ActionIcon, Badge, Group, ScrollArea, Table, Text } from '@mantine/core';
import { Order, StatusColorMap } from '@/lib/store/types';

interface OrderTableProps {
  orders: Order[];
  onViewOrder: (order: Order) => void;
}

// Status color mapping
const statusColorMap: StatusColorMap = {
  pending: 'orange',
  confirmed: 'blue',
  paid: 'teal',
  processing: 'indigo',
  shipped: 'cyan',
  delivered: 'green',
  cancelled: 'red',
};

// Format date for display
const formatDate = (dateString?: string): string => {
  if (!dateString) {
    return 'N/A';
  }
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
};

// Format currency for display
const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

export function OrderTable({ orders, onViewOrder }: OrderTableProps) {
  return (
    <ScrollArea>
      <Table striped highlightOnHover withTableBorder>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Order ID</Table.Th>
            <Table.Th>Full Name</Table.Th>
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
                onClick={() => onViewOrder(order)}
              >
                <Table.Td>{order.id.substring(0, 8)}...</Table.Td>
                <Table.Td>{order.user_id}</Table.Td>
                <Table.Td>{formatDate(order.created_at)}</Table.Td>
                <Table.Td>
                  <Badge color={statusColorMap[order.status]} variant="filled">
                    {order.status.toUpperCase()}
                  </Badge>
                </Table.Td>
                <Table.Td>{(order.items || []).length} items</Table.Td>
                <Table.Td>{formatCurrency(order.total_amount)}</Table.Td>
                <Table.Td>
                  <Group gap="xs" justify="center">
                    <ActionIcon
                      variant="subtle"
                      color="blue"
                      onClick={(e) => {
                        e.stopPropagation();
                        onViewOrder(order);
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
