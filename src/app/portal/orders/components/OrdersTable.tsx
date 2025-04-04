import { IconPackage } from '@tabler/icons-react';
import { Badge, Group, Table, Text } from '@mantine/core';
import { Order } from '../types';
import { formatDate, getStatusColor } from '../utils/orderUtils';

interface OrdersTableProps {
  orders: Order[];
  onOrderClick: (order: Order) => void;
}

export const OrdersTable = ({ orders, onOrderClick }: OrdersTableProps): JSX.Element => (
  <Table striped highlightOnHover withTableBorder bgcolor="white">
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
      {orders.map((order) => (
        <Table.Tr key={order.id} onClick={() => onOrderClick(order)} style={{ cursor: 'pointer' }}>
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
              <Text size="sm">{order.order_items.length}</Text>
            </Group>
          </Table.Td>
          <Table.Td>
            <Text size="sm" fw={500}>
              ${order.total_amount.toFixed(2)}
            </Text>
          </Table.Td>
        </Table.Tr>
      ))}
    </Table.Tbody>
  </Table>
);
