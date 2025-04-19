'use client';

import React from 'react';
import Link from 'next/link';
import { IconEdit, IconEye, IconToggleLeft, IconToggleRight } from '@tabler/icons-react';
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
import { StoreItem } from '@/lib/store/types';

interface StoreItemTableProps {
  items: StoreItem[];
  onViewItemAction: (item: StoreItem) => void;
  onToggleStatusAction: (item: StoreItem, e: React.MouseEvent) => void;
}

export function StoreItemTable({
  items,
  onViewItemAction,
  onToggleStatusAction,
}: StoreItemTableProps) {
  const isMobile = useMediaQuery('(max-width: 768px)');

  if (isMobile) {
    return (
      <Stack>
        {items.length === 0 ? (
          <Paper p="md" withBorder radius="md">
            <Text ta="center" c="dimmed">
              No store items found
            </Text>
          </Paper>
        ) : (
          items.map((item) => (
            <Card
              key={item.id}
              shadow="sm"
              padding="md"
              radius="md"
              withBorder
              onClick={() => onViewItemAction(item)}
              style={{ cursor: 'pointer' }}
            >
              <Stack gap="xs">
                <Group justify="space-between">
                  <Text fw={500} size="sm">
                    Code
                  </Text>
                  <Text size="sm" c="dimmed">
                    {item.item_code}
                  </Text>
                </Group>

                <Group justify="space-between">
                  <Text fw={500} size="sm">
                    Name
                  </Text>
                  <Text size="sm" c="dimmed">
                    {item.name}
                  </Text>
                </Group>

                <Group justify="space-between">
                  <Text fw={500} size="sm">
                    Price
                  </Text>
                  <Text size="sm" c="dimmed">
                    ${item.price.toFixed(2)}
                  </Text>
                </Group>

                <Group justify="space-between">
                  <Text fw={500} size="sm">
                    Status
                  </Text>
                  <Badge color={item.active ? 'green' : 'red'} variant="filled">
                    {item.active ? 'Active' : 'Inactive'}
                  </Badge>
                </Group>

                <Divider my="xs" />

                <Group justify="flex-end">
                  <ActionIcon
                    variant="subtle"
                    color="blue"
                    onClick={(e) => {
                      e.stopPropagation();
                      onViewItemAction(item);
                    }}
                  >
                    <IconEye size={18} />
                  </ActionIcon>

                  <ActionIcon
                    variant="subtle"
                    component={Link}
                    href={`/portal/admin/store/edit/${item.id}`}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <IconEdit size={18} />
                  </ActionIcon>

                  <ActionIcon
                    variant="subtle"
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleStatusAction(item, e);
                    }}
                  >
                    {item.active ? <IconToggleRight size={18} /> : <IconToggleLeft size={18} />}
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
                onClick={() => onViewItemAction(item)}
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
                  <Group justify="flex-start" gap="xs">
                    <ActionIcon
                      variant="subtle"
                      color="blue"
                      onClick={(e) => {
                        e.stopPropagation();
                        onViewItemAction(item);
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

                    <ActionIcon
                      variant="subtle"
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleStatusAction(item, e);
                      }}
                    >
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
