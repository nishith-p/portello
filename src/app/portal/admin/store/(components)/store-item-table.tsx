import React from 'react';
import Link from 'next/link';
import { IconEdit, IconEye, IconToggleLeft, IconToggleRight } from '@tabler/icons-react';
import { ActionIcon, Badge, Group, ScrollArea, Table, Text } from '@mantine/core';
import { StoreItem } from '@/lib/store/types';

interface StoreItemTableProps {
  items: StoreItem[];
  onViewItem: (item: StoreItem) => void;
  onToggleStatus: (item: StoreItem, e: React.MouseEvent) => void;
}

export function StoreItemTable({ items, onViewItem, onToggleStatus }: StoreItemTableProps) {
  return (
    <ScrollArea>
      <Table striped highlightOnHover withTableBorder>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Code</Table.Th>
            <Table.Th>Name</Table.Th>
            <Table.Th>Price</Table.Th>
            <Table.Th>Status</Table.Th>
            <Table.Th style={{ width: 150 }}>Actions</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {items.length === 0 ? (
            <Table.Tr>
              <Table.Td colSpan={5}>
                <Text ta="center" c="dimmed" py="md">
                  No store items found
                </Text>
              </Table.Td>
            </Table.Tr>
          ) : (
            items.map((item) => (
              <Table.Tr
                key={item.id}
                style={{ cursor: 'pointer' }}
                onClick={() => onViewItem(item)}
              >
                <Table.Td>{item.item_code}</Table.Td>
                <Table.Td>{item.name}</Table.Td>
                <Table.Td>${item.price.toFixed(2)}</Table.Td>
                <Table.Td>
                  <Badge color={item.active ? 'green' : 'red'} variant="filled">
                    {item.active ? 'Active' : 'Inactive'}
                  </Badge>
                </Table.Td>
                <Table.Td>
                  <Group gap="xs">
                    <ActionIcon
                      variant="subtle"
                      color="blue"
                      onClick={(e) => {
                        e.stopPropagation();
                        onViewItem(item);
                      }}
                    >
                      <IconEye size={16} />
                    </ActionIcon>
                    <ActionIcon
                      variant="subtle"
                      component={Link}
                      href={`/portal/admin/store/edit/${item.id}`}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <IconEdit size={16} />
                    </ActionIcon>
                    <ActionIcon variant="subtle" onClick={(e) => onToggleStatus(item, e)}>
                      {item.active ? <IconToggleRight size={16} /> : <IconToggleLeft size={16} />}
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
