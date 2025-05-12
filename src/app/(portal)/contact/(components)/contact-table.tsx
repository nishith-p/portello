'use client';

import { Card, Group, Paper, Stack, Table, Text, Title } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { TeamMember } from '@/app/(portal)/contact/(components)/types';

interface ContactTableProps {
  title: string;
  members: TeamMember[];
}

export const ContactTable = ({ title, members }: ContactTableProps) => {
  const isMobile = useMediaQuery('(max-width: 1200px)');

  return (
    <Paper p="md" withBorder>
      <Title order={4} mb="md" fw={600} c="blue">
        {title}
      </Title>

      {isMobile ? (
        <Stack gap="sm">
          {members.map((member) => (
            <Card key={member.id} shadow="sm" padding="md" radius="md" withBorder>
              <Text fw={500} size="sm" mb={4}>
                {member.name}
              </Text>
              <Text size="sm" c="dimmed">
                {member.position}
              </Text>

              <Group mt="sm" gap="xs">
                <Text size="sm" fw={500}>
                  Email:
                </Text>
                <Text size="sm">{member.email || <Text c="dimmed">-</Text>}</Text>
              </Group>

              <Group gap="xs">
                <Text size="sm" fw={500}>
                  Phone:
                </Text>
                <Text size="sm">{member.phone || <Text c="dimmed">-</Text>}</Text>
              </Group>

              <Group gap="xs">
                <Text size="sm" fw={500}>
                  Telegram:
                </Text>
                <Text size="sm">
                  {member.telegram ? `@${member.telegram}` : <Text c="dimmed">-</Text>}
                </Text>
              </Group>
            </Card>
          ))}
        </Stack>
      ) : (
        <Table highlightOnHover withTableBorder withColumnBorders>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Name</Table.Th>
              <Table.Th>Position</Table.Th>
              <Table.Th>Email</Table.Th>
              <Table.Th>Phone</Table.Th>
              <Table.Th>Telegram</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {members.map((member) => (
              <Table.Tr key={member.id}>
                <Table.Td>
                  <Text fw={500}>{member.name}</Text>
                </Table.Td>
                <Table.Td>{member.position}</Table.Td>
                <Table.Td>{member.email || '-'}</Table.Td>
                <Table.Td>{member.phone || '-'}</Table.Td>
                <Table.Td>{member.telegram ? `@${member.telegram}` : '-'}</Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      )}
    </Paper>
  );
};
