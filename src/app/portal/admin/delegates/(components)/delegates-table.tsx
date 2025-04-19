'use client';

import { IconEye } from '@tabler/icons-react';
import {
  ActionIcon,
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
import { UserListItem } from '@/lib/users/types';

interface DelegatesTableProps {
  delegates: UserListItem[];
  onViewProfileAction: (userId: string) => void;
}

export function DelegatesTable({ delegates, onViewProfileAction }: DelegatesTableProps) {
  const isMobile = useMediaQuery('(max-width: 768px)');

  if (isMobile) {
    return (
      <Stack>
        {delegates.length === 0 ? (
          <Paper p="md" withBorder radius="md">
            <Text ta="center" c="dimmed">
              No delegates found
            </Text>
          </Paper>
        ) : (
          delegates.map((user: UserListItem) => (
            <Card
              key={user.kinde_id}
              shadow="sm"
              padding="md"
              radius="md"
              withBorder
              onClick={() => onViewProfileAction(user.kinde_id)}
              style={{ cursor: 'pointer' }}
            >
              <Stack gap="xs">
                <Group justify="space-between">
                  <Text fw={500} size="sm">
                    Name
                  </Text>
                  <Text size="sm" c="dimmed">
                    {user.full_name}
                  </Text>
                </Group>

                <Group justify="space-between">
                  <Text fw={500} size="sm">
                    Position
                  </Text>
                  <Text size="sm" c="dimmed">
                    {user.position}
                  </Text>
                </Group>

                <Group justify="space-between">
                  <Text fw={500} size="sm">
                    Entity
                  </Text>
                  <Text size="sm" c="dimmed">
                    {user.entity}
                  </Text>
                </Group>

                <Group justify="space-between">
                  <Text fw={500} size="sm">
                    Sub Entity
                  </Text>
                  <Text size="sm" c="dimmed">
                    {user.sub_entity || '-'}
                  </Text>
                </Group>

                <Group justify="space-between">
                  <Text fw={500} size="sm">
                    AIESEC Email
                  </Text>
                  <Text size="sm" c="dimmed">
                    {user.aiesec_email}
                  </Text>
                </Group>

                <Group justify="space-between">
                  <Text fw={500} size="sm">
                    Round
                  </Text>
                  <Text size="sm" c="dimmed">
                    {user.round || '-'}
                  </Text>
                </Group>

                <Divider my="xs" />

                <Group justify="flex-end">
                  <ActionIcon
                    variant="subtle"
                    color="blue"
                    onClick={(e) => {
                      e.stopPropagation();
                      onViewProfileAction(user.kinde_id);
                    }}
                  >
                    <IconEye size={18} />
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
            <Table.Th>Name</Table.Th>
            <Table.Th>Position</Table.Th>
            <Table.Th>Entity</Table.Th>
            <Table.Th>Sub Entity</Table.Th>
            <Table.Th>AIESEC Email</Table.Th>
            <Table.Th>Round</Table.Th>
            <Table.Th>Actions</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {delegates.length > 0 ? (
            delegates.map((user: UserListItem) => (
              <Table.Tr
                key={user.kinde_id}
                style={{ cursor: 'pointer' }}
                onClick={() => onViewProfileAction(user.kinde_id)}
              >
                <Table.Td>{user.full_name}</Table.Td>
                <Table.Td>{user.position}</Table.Td>
                <Table.Td>{user.entity}</Table.Td>
                <Table.Td>{user.sub_entity || '-'}</Table.Td>
                <Table.Td>{user.aiesec_email}</Table.Td>
                <Table.Td>{user.round || '-'}</Table.Td>
                <Table.Td>
                  <ActionIcon
                    variant="subtle"
                    color="blue"
                    onClick={(e) => {
                      e.stopPropagation();
                      onViewProfileAction(user.kinde_id);
                    }}
                  >
                    <IconEye size={16} />
                  </ActionIcon>
                </Table.Td>
              </Table.Tr>
            ))
          ) : (
            <Table.Tr>
              <Table.Td colSpan={7}>
                <Text ta="center" c="dimmed" py="md">
                  No delegates found
                </Text>
              </Table.Td>
            </Table.Tr>
          )}
        </Table.Tbody>
      </Table>
    </ScrollArea>
  );
}
