'use client';

import { useState } from 'react';
import { IconAlertCircle } from '@tabler/icons-react';
import { Alert, Center, Container, Loader, Paper, Stack, Title } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useUserSearch } from '@/lib/users/hooks';
import { UserSearchParams } from '@/lib/users/types';
import {
  DelegateProfileModal,
  DelegatesPagination,
  DelegatesSearch,
  DelegatesTable,
} from './(components)';

export default function DelegatesPage() {
  // State for search parameters
  const [searchParams, setSearchParams] = useState<
    Required<Pick<UserSearchParams, 'limit' | 'offset'>> &
      Omit<UserSearchParams, 'limit' | 'offset'>
  >({
    limit: 10,
    offset: 0,
  });

  // State for quick search input
  const [searchInput, setSearchInput] = useState<string>('');

  // State for profile modal
  const [opened, { open, close }] = useDisclosure(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  // Fetch delegates data
  const { data, isLoading, error } = useUserSearch(searchParams);

  // Handle search form submission
  const handleSearch = (): void => {
    setSearchParams((prev) => ({
      ...prev,
      search: searchInput,
      offset: 0, // Reset pagination when searching
    }));
  };

  // Handle row click to view profile
  const handleViewProfile = (userId: string): void => {
    setSelectedUserId(userId);
    open();
  };

  // Handle pagination
  const handlePageChange = (newOffset: number): void => {
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
          <DelegatesSearch
            searchInput={searchInput}
            setSearchInputAction={setSearchInput}
            setSearchParamsAction={setSearchParams}
            onSearchAction={handleSearch}
          />

          {isLoading ? (
            <Center my="xl">
              <Loader size="md" />
            </Center>
          ) : error ? (
            <Alert icon={<IconAlertCircle size={16} />} title="Error loading delegates" color="red">
              {error.message}
            </Alert>
          ) : (
            <>
              <DelegatesTable
                delegates={data?.users || []}
                onViewProfileAction={handleViewProfile}
              />

              {data && (
                <DelegatesPagination
                  currentOffset={searchParams.offset}
                  limit={searchParams.limit}
                  total={data.total}
                  onPageChangeAction={handlePageChange}
                />
              )}
            </>
          )}
        </Paper>
      </Stack>

      <DelegateProfileModal opened={opened} onCloseAction={close} userId={selectedUserId} />
    </Container>
  );
}
