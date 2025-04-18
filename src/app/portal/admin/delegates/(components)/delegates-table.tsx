'use client';

import { IconEye } from '@tabler/icons-react';
import { ActionIcon, ScrollArea, Table, Text } from '@mantine/core';
import { UserListItem } from '@/lib/users/types';

interface DelegatesTableProps {
  delegates: UserListItem[];
  onViewProfileAction: (userId: string) => void;
}

export function DelegatesTable({ delegates, onViewProfileAction }: DelegatesTableProps) {
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
