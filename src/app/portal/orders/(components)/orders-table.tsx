import { IconPackage } from '@tabler/icons-react';
import { Badge, Group, Table, Text } from '@mantine/core';
import { Order, OrderStatus } from '@/lib/store/types';
import { formatCurrency, formatDate } from '@/lib/utils';

interface OrdersTableProps {
  orders: Order[];
  onOrderClick: (order: Order) => void;
}

// Status color mapping
const statusColorMap: Record<OrderStatus, string> = {
  pending: 'orange',
  confirmed: 'blue',
  paid: 'teal',
  processing: 'indigo',
  shipped: 'cyan',
  delivered: 'green',
  cancelled: 'red',
};

// Get appropriate color for order status
const getStatusColor = (status: OrderStatus): string => {
  return statusColorMap[status] || 'gray';
};

export const OrdersTable = ({ orders, onOrderClick }: OrdersTableProps) => (
  <Table striped highlightOnHover withTableBorder bg="white">
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
            onClick={() => onOrderClick(order)}
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
