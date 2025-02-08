// contact/_components/ContactTable.tsx
import { Table, Avatar, Group, Text, Title, Stack, Box, Card } from '@mantine/core';
import { IconMail, IconPhone } from '@tabler/icons-react';
import { useMediaQuery } from '@mantine/hooks';

type TeamMember = {
  id: string;
  name: string;
  position: string;
  email: string;
  phone: string;
  image?: string;
};

type ContactTableProps = {
  title: string;
  members: TeamMember[];
};

export const ContactTable = ({ title, members }: ContactTableProps) => {
  const isMobile = useMediaQuery('(max-width: 768px)');

  if (isMobile) {
    return (
      <Stack>
        <Title order={3} c="gray.7">{title}</Title>
        <Stack gap="md">
          {members.map((member) => (
            <Card key={member.id} withBorder>
              <Stack gap="md">
                <Group>
                  <Avatar src={member.image} size={40} radius={40} />
                  <Box>
                    <Text fw={500}>{member.name}</Text>
                    <Text size="sm" c="dimmed">{member.position}</Text>
                  </Box>
                </Group>
                <Stack gap="xs">
                  <Group gap="xs">
                    <IconMail size={16} stroke={1.5} />
                    <Text size="sm">{member.email}</Text>
                  </Group>
                  <Group gap="xs">
                    <IconPhone size={16} stroke={1.5} />
                    <Text size="sm">{member.phone}</Text>
                  </Group>
                </Stack>
              </Stack>
            </Card>
          ))}
        </Stack>
      </Stack>
    );
  }

  return (
    <Stack>
      <Title order={3} c="gray.7">{title}</Title>
      <Box style={{ border: '1px solid var(--mantine-color-gray-3)', borderRadius: 'var(--mantine-radius-sm)', overflow: 'hidden' }}>
        <Table highlightOnHover>
          <Table.Thead>
            <Table.Tr bg="white">
              <Table.Th>Name</Table.Th>
              <Table.Th>Position</Table.Th>
              <Table.Th>Email</Table.Th>
              <Table.Th>Phone</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {members.map((member) => (
              <Table.Tr key={member.id} bg="white">
                <Table.Td>
                  <Group gap="sm">
                    <Avatar src={member.image} size={40} radius={40} />
                    <Text fw={500}>{member.name}</Text>
                  </Group>
                </Table.Td>
                <Table.Td>{member.position}</Table.Td>
                <Table.Td>
                  <Group gap="xs">
                    <IconMail size={16} stroke={1.5} />
                    <Text>{member.email}</Text>
                  </Group>
                </Table.Td>
                <Table.Td>
                  <Group gap="xs">
                    <IconPhone size={16} stroke={1.5} />
                    <Text>{member.phone}</Text>
                  </Group>
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </Box>
    </Stack>
  );
};