'use client';

import { useState } from 'react';
import { IconAlertCircle, IconEye, IconSearch } from '@tabler/icons-react';
import {
  ActionIcon,
  Alert,
  Button,
  Center,
  Container,
  Group,
  Loader,
  Modal,
  Paper,
  ScrollArea,
  Select,
  Stack,
  Table,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useUserProfile, useUserSearch } from '@/lib/api/hooks/useUsers';
import { UserListItem, UserSearchParams } from '@/types/users';
import { DelegateProfile } from './DelegatesProfile';

const DelegatesPage = () => {
  // State for search parameters
  const [searchParams, setSearchParams] = useState<
    Required<Pick<UserSearchParams, 'limit' | 'offset'>> &
      Omit<UserSearchParams, 'limit' | 'offset'>
  >({
    limit: 10,
    offset: 0,
  });

  // State for quick search input
  const [searchInput, setSearchInput] = useState('');

  // State for profile modal
  const [opened, { open, close }] = useDisclosure(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  // Fetch delegates data
  const { data, isLoading, error } = useUserSearch(searchParams);

  // Fetch selected user profile
  const { data: userProfile, isLoading: isProfileLoading } = useUserProfile(selectedUserId);

  // Handle search form submission
  const handleSearch = () => {
    setSearchParams((prev) => ({
      ...prev,
      search: searchInput,
      offset: 0, // Reset pagination when searching
    }));
  };

  // Handle enter key in search input
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // Handle row click to view profile
  const handleViewProfile = (userId: string) => {
    setSelectedUserId(userId);
    open();
  };

  // Handle pagination
  const handlePageChange = (newOffset: number) => {
    setSearchParams((prev) => ({
      ...prev,
      offset: newOffset,
    }));
  };

  return (
    <Container fluid p="md">
      <Stack gap="lg">
        <Title order={2} c="gray.8">
          Delegates
        </Title>

        <Paper p="md" radius="md" withBorder>
          <Group mb="md" justify="space-between">
            <Group>
              <TextInput
                placeholder="Search by name or email"
                leftSection={<IconSearch size={16} />}
                value={searchInput}
                onChange={(e) => setSearchInput(e.currentTarget.value)}
                onKeyDown={handleKeyDown}
                style={{ width: '300px' }}
              />
              <Button onClick={handleSearch}>Search</Button>
            </Group>

            <Group>
              <Select
                placeholder="Entity"
                data={['AIESEC International', 'AIESEC Germany', 'AIESEC India']}
                clearable
                onChange={(value) =>
                  setSearchParams((prev) => ({ ...prev, entity: value || undefined, offset: 0 }))
                }
              />
              <Select
                placeholder="Round"
                data={['1', '2', '3']} // Replace with your rounds
                clearable
                onChange={(value) => {
                  const round = value ? parseInt(value, 10) : undefined;
                  setSearchParams((prev) => ({ ...prev, round, offset: 0 }));
                }}
              />
            </Group>
          </Group>

          {isLoading ? (
            <Center my="xl">
              <Loader size="md" />
            </Center>
          ) : error ? (
            <Alert icon={<IconAlertCircle size={16} />} title="Error loading delegates" color="red">
              {error.message || 'Failed to load delegates. Please try again.'}
            </Alert>
          ) : (
            <>
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
                    {data?.users.length ? (
                      data.users.map((user: UserListItem) => (
                        <Table.Tr
                          key={user.kinde_id}
                          style={{ cursor: 'pointer' }}
                          onClick={() => handleViewProfile(user.kinde_id)}
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
                                handleViewProfile(user.kinde_id);
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

              {data && data.total > 0 && (
                <Group justify="space-between" mt="md">
                  <Text size="sm" c="dimmed">
                    Showing {Math.min(searchParams.offset + 1, data.total)} -{' '}
                    {Math.min(searchParams.offset + searchParams.limit, data.total)} of {data.total}{' '}
                    delegates
                  </Text>
                  <Group>
                    <Button
                      variant="outline"
                      disabled={searchParams.offset === 0}
                      onClick={() =>
                        handlePageChange(Math.max(0, searchParams.offset - searchParams.limit))
                      }
                    >
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      disabled={searchParams.offset + searchParams.limit >= (data?.total || 0)}
                      onClick={() => handlePageChange(searchParams.offset + searchParams.limit)}
                    >
                      Next
                    </Button>
                  </Group>
                </Group>
              )}
            </>
          )}
        </Paper>
      </Stack>

      <Modal
        opened={opened}
        onClose={close}
        title={
          <Text fw={700} size="lg">
            Delegate Profile
          </Text>
        }
        size="xl"
        centered
      >
        {isProfileLoading ? (
          <Center p="xl">
            <Loader />
          </Center>
        ) : userProfile?.user ? (
          <DelegateProfile user={userProfile.user} documents={userProfile.documents} />
        ) : (
          <Alert color="red" icon={<IconAlertCircle size={16} />}>
            Failed to load delegate profile
          </Alert>
        )}
      </Modal>
    </Container>
  );
};

export default DelegatesPage;
