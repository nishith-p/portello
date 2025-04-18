import React from 'react';
import Link from 'next/link';
import { IconEdit, IconEye, IconToggleLeft, IconToggleRight } from '@tabler/icons-react';
import { ActionIcon, Badge, Group, ScrollArea, Table, Text } from '@mantine/core';
import { StorePack } from '@/lib/store/types';

interface PackTableProps {
  packs: StorePack[];
  onViewPack: (pack: StorePack) => void;
  onToggleStatus: (pack: StorePack, e: React.MouseEvent) => void;
}

export function PackTable({ packs, onViewPack, onToggleStatus }: PackTableProps) {
  return (
    <ScrollArea>
      <Table striped highlightOnHover withTableBorder>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Code</Table.Th>
            <Table.Th>Name</Table.Th>
            <Table.Th>Price</Table.Th>
            <Table.Th>Items</Table.Th>
            <Table.Th>Status</Table.Th>
            <Table.Th style={{ width: 150 }}>Actions</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {packs.length === 0 ? (
            <Table.Tr>
              <Table.Td colSpan={6}>
                <Text ta="center" c="dimmed" py="md">
                  No packs found
                </Text>
              </Table.Td>
            </Table.Tr>
          ) : (
            packs.map((pack) => (
              <Table.Tr
                key={pack.id}
                style={{ cursor: 'pointer' }}
                onClick={() => onViewPack(pack)}
              >
                <Table.Td>{pack.pack_code}</Table.Td>
                <Table.Td>{pack.name}</Table.Td>
                <Table.Td>${pack.price.toFixed(2)}</Table.Td>
                <Table.Td>
                  <Badge>{pack.pack_items ? pack.pack_items.length : 0} items</Badge>
                </Table.Td>
                <Table.Td>
                  <Badge color={pack.active ? 'green' : 'red'} variant="filled">
                    {pack.active ? 'Active' : 'Inactive'}
                  </Badge>
                </Table.Td>
                <Table.Td>
                  <Group gap="xs">
                    <ActionIcon
                      variant="subtle"
                      color="blue"
                      onClick={(e) => {
                        e.stopPropagation();
                        onViewPack(pack);
                      }}
                    >
                      <IconEye size={16} />
                    </ActionIcon>
                    <ActionIcon
                      variant="subtle"
                      component={Link}
                      href={`/portal/admin/store/packs/edit/${pack.id}`}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <IconEdit size={16} />
                    </ActionIcon>
                    <ActionIcon variant="subtle" onClick={(e) => onToggleStatus(pack, e)}>
                      {pack.active ? <IconToggleRight size={16} /> : <IconToggleLeft size={16} />}
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
