// components/store/orders/(components)/item-quantity-table.tsx
import { Paper, Table, Text, Title } from '@mantine/core';
import { ItemWithQuantity, PackWithQuantity } from '@/lib/store/types';

export function ItemsTable({ items }: { items: ItemWithQuantity[] }) {
  return (
    <Paper withBorder p="md" mb="md">
      <Title order={3} mb="sm">Items</Title>
      <Table striped highlightOnHover withTableBorder>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Item Code</Table.Th>
            <Table.Th>Name</Table.Th>
            <Table.Th>Quantity Ordered</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {items.length > 0 ? (
            items.map((item) => (
              <Table.Tr key={item.item_code}>
                <Table.Td>{item.item_code}</Table.Td>
                <Table.Td>{item.name}</Table.Td>
                <Table.Td>{item.quantity}</Table.Td>
              </Table.Tr>
            ))
          ) : (
            <Table.Tr>
              <Table.Td colSpan={3}>
                <Text ta="center" c="dimmed">No items found</Text>
              </Table.Td>
            </Table.Tr>
          )}
        </Table.Tbody>
      </Table>
    </Paper>
  );
}

export function PacksTable({ packs }: { packs: PackWithQuantity[] }) {
  return (
    <Paper withBorder p="md">
      <Title order={3} mb="sm">Packs</Title>
      <Table striped highlightOnHover withTableBorder>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Pack Code</Table.Th>
            <Table.Th>Name</Table.Th>
            <Table.Th>Quantity Ordered</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {packs.length > 0 ? (
            packs.map((pack) => (
              <Table.Tr key={pack.pack_code}>
                <Table.Td>{pack.pack_code}</Table.Td>
                <Table.Td>{pack.name}</Table.Td>
                <Table.Td>{pack.quantity}</Table.Td>
              </Table.Tr>
            ))
          ) : (
            <Table.Tr>
              <Table.Td colSpan={3}>
                <Text ta="center" c="dimmed">No packs found</Text>
              </Table.Td>
            </Table.Tr>
          )}
        </Table.Tbody>
      </Table>
    </Paper>
  );
}