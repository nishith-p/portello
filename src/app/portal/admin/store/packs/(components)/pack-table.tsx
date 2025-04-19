'use client';

import React from 'react';
import Link from 'next/link';
import {
  IconEdit,
  IconEye,
  IconPackage,
  IconToggleLeft,
  IconToggleRight,
} from '@tabler/icons-react';
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
import { StorePack } from '@/lib/store/types';

interface PackTableProps {
  packs: StorePack[];
  onViewPackAction: (pack: StorePack) => void;
  onToggleStatusAction: (pack: StorePack, e: React.MouseEvent) => void;
}

export function PackTable({ packs, onViewPackAction, onToggleStatusAction }: PackTableProps) {
  const isMobile = useMediaQuery('(max-width: 768px)');

  if (isMobile) {
    return (
      <Stack gap="sm">
        {packs.length === 0 ? (
          <Paper p="md" withBorder radius="md">
            <Text ta="center" c="dimmed">
              No packs found
            </Text>
          </Paper>
        ) : (
          packs.map((pack) => (
            <Card
              key={pack.id}
              shadow="sm"
              padding="md"
              radius="md"
              withBorder
              onClick={() => onViewPackAction(pack)}
              style={{ cursor: 'pointer' }}
            >
              <Stack gap="xs">
                <Group justify="space-between">
                  <Text fw={500} size="sm">
                    Code
                  </Text>
                  <Text size="sm" c="dimmed">
                    {pack.pack_code}
                  </Text>
                </Group>

                <Group justify="space-between">
                  <Text fw={500} size="sm">
                    Name
                  </Text>
                  <Text size="sm" c="dimmed">
                    {pack.name}
                  </Text>
                </Group>

                <Group justify="space-between">
                  <Text fw={500} size="sm">
                    Price
                  </Text>
                  <Text size="sm" c="dimmed">
                    ${pack.price.toFixed(2)}
                  </Text>
                </Group>

                <Group justify="space-between">
                  <Text fw={500} size="sm">
                    Items
                  </Text>
                  <Group gap="xs">
                    <IconPackage size={16} />
                    <Badge>{pack.pack_items?.length ?? 0} items</Badge>
                  </Group>
                </Group>

                <Group justify="space-between">
                  <Text fw={500} size="sm">
                    Status
                  </Text>
                  <Badge color={pack.active ? 'green' : 'red'} variant="filled">
                    {pack.active ? 'Active' : 'Inactive'}
                  </Badge>
                </Group>

                <Divider my="xs" />

                <Group justify="flex-end" gap="xs">
                  <ActionIcon
                    variant="subtle"
                    color="blue"
                    onClick={(e) => {
                      e.stopPropagation();
                      onViewPackAction(pack);
                    }}
                  >
                    <IconEye size={18} />
                  </ActionIcon>
                  <ActionIcon
                    variant="subtle"
                    component={Link}
                    href={`/portal/admin/store/packs/edit/${pack.id}`}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <IconEdit size={18} />
                  </ActionIcon>
                  <ActionIcon
                    variant="subtle"
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleStatusAction(pack, e);
                    }}
                  >
                    {pack.active ? <IconToggleRight size={18} /> : <IconToggleLeft size={18} />}
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
                onClick={() => onViewPackAction(pack)}
              >
                <Table.Td>{pack.pack_code}</Table.Td>
                <Table.Td>{pack.name}</Table.Td>
                <Table.Td>${pack.price.toFixed(2)}</Table.Td>
                <Table.Td>
                  <Badge>{pack.pack_items?.length ?? 0} items</Badge>
                </Table.Td>
                <Table.Td>
                  <Badge color={pack.active ? 'green' : 'red'} variant="filled">
                    {pack.active ? 'Active' : 'Inactive'}
                  </Badge>
                </Table.Td>
                <Table.Td>
                  <Group gap="xs" justify="flex-end">
                    <ActionIcon
                      variant="subtle"
                      color="blue"
                      onClick={(e) => {
                        e.stopPropagation();
                        onViewPackAction(pack);
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
                    <ActionIcon
                      variant="subtle"
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleStatusAction(pack, e);
                      }}
                    >
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
