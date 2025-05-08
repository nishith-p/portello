// components/store/orders/(components)/item-quantity-table.tsx
import { useState } from 'react';
import { IconArrowDown, IconArrowsVertical, IconArrowUp } from '@tabler/icons-react';
import { Group, Paper, Table, Text, Title } from '@mantine/core';
import { ItemWithQuantity, PackWithQuantity } from '@/lib/store/types';
import { ItemVariationsModal } from './item-variation-modal';

export function ItemsTable({ items }: { items: ItemWithQuantity[] }) {
  const [sortBy, setSortBy] = useState<'quantity' | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [selectedItem, setSelectedItem] = useState<ItemWithQuantity | null>(null);

  const toggleSort = (column: 'quantity') => {
    if (sortBy === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortDirection('asc');
    }
  };

  const sortedItems = [...items].sort((a, b) => {
    if (!sortBy) return 0;
    if (sortDirection === 'asc') {
      return a.quantity - b.quantity;
    } else {
      return b.quantity - a.quantity;
    }
  });

  return (
    <Paper withBorder p="md" mb="md">
      <Title order={3} mb="sm">
        Items
      </Title>

      {/* Single modal instance outside the table */}
      <ItemVariationsModal
        item={selectedItem}
        opened={!!selectedItem}
        onClose={() => setSelectedItem(null)}
      />

      <Table striped highlightOnHover withTableBorder>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Item Code</Table.Th>
            <Table.Th>Name</Table.Th>
            <Table.Th style={{ cursor: 'pointer' }} onClick={() => toggleSort('quantity')}>
              <Group gap="xs">
                Quantity Ordered
                {sortBy === 'quantity' ? (
                  sortDirection === 'asc' ? (
                    <IconArrowUp size={14} />
                  ) : (
                    <IconArrowDown size={14} />
                  )
                ) : (
                  <IconArrowsVertical size={14} opacity={0.5} />
                )}
              </Group>
            </Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {sortedItems.length > 0 ? (
            sortedItems.map((item) => (
              <Table.Tr
                key={item.item_code}
                style={{ cursor: 'pointer' }}
                onClick={() => setSelectedItem(item)}
              >
                <Table.Td>{item.item_code}</Table.Td>
                <Table.Td>{item.name}</Table.Td>
                <Table.Td>{item.quantity}</Table.Td>
              </Table.Tr>
            ))
          ) : (
            <Table.Tr>
              <Table.Td colSpan={3}>
                <Text ta="center" c="dimmed">
                  No items found
                </Text>
              </Table.Td>
            </Table.Tr>
          )}
        </Table.Tbody>
      </Table>
    </Paper>
  );
}

// PacksTable remains unchanged
export function PacksTable({ packs }: { packs: PackWithQuantity[] }) {
  const [sortBy, setSortBy] = useState<'quantity' | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const toggleSort = (column: 'quantity') => {
    if (sortBy === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortDirection('asc');
    }
  };

  const sortedPacks = [...packs].sort((a, b) => {
    if (!sortBy) return 0;
    if (sortDirection === 'asc') {
      return a.quantity - b.quantity;
    } else {
      return b.quantity - a.quantity;
    }
  });

  return (
    <Paper withBorder p="md">
      <Title order={3} mb="sm">
        Packs
      </Title>
      <Table striped highlightOnHover withTableBorder>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Pack Code</Table.Th>
            <Table.Th>Name</Table.Th>
            <Table.Th style={{ cursor: 'pointer' }} onClick={() => toggleSort('quantity')}>
              <Group gap="xs">
                Quantity Ordered
                {sortBy === 'quantity' ? (
                  sortDirection === 'asc' ? (
                    <IconArrowUp size={14} />
                  ) : (
                    <IconArrowDown size={14} />
                  )
                ) : (
                  <IconArrowsVertical size={14} opacity={0.5} />
                )}
              </Group>
            </Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {sortedPacks.length > 0 ? (
            sortedPacks.map((pack) => (
              <Table.Tr key={pack.pack_code}>
                <Table.Td>{pack.pack_code}</Table.Td>
                <Table.Td>{pack.name}</Table.Td>
                <Table.Td>{pack.quantity}</Table.Td>
              </Table.Tr>
            ))
          ) : (
            <Table.Tr>
              <Table.Td colSpan={3}>
                <Text ta="center" c="dimmed">
                  No packs found
                </Text>
              </Table.Td>
            </Table.Tr>
          )}
        </Table.Tbody>
      </Table>
    </Paper>
  );
}
