'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { IconAlertCircle, IconPlus } from '@tabler/icons-react';
import {
  Alert,
  Button,
  Center,
  Container,
  Group,
  Loader,
  Paper,
  Stack,
  Title,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useStoreItemSearch, useUpdateStoreItemStatus } from '@/lib/store/items/hooks';
import { StoreItem, StoreItemSearchParams } from '@/lib/store/types';
import {
  StoreItemDetailModal,
  StoreItemPagination,
  StoreItemSearch,
  StoreItemTable,
} from './(components)';

export default function AdminStorePage() {
  const [searchParams, setSearchParams] = useState<
    Required<Pick<StoreItemSearchParams, 'limit' | 'offset'>> &
      Omit<StoreItemSearchParams, 'limit' | 'offset'>
  >({
    limit: 10,
    offset: 0,
  });

  const [searchInput, setSearchInput] = useState<string>('');
  const [activeFilter, setActiveFilter] = useState<boolean | undefined>(undefined);

  const [opened, { open, close }] = useDisclosure(false);
  const [selectedItem, setSelectedItem] = useState<StoreItem | null>(null);

  const { data, isLoading, error } = useStoreItemSearch(searchParams);
  const updateStatusMutation = useUpdateStoreItemStatus();

  const handleSearch = (): void => {
    setSearchParams((prev) => ({
      ...prev,
      search: searchInput,
      active: activeFilter,
      offset: 0, // Reset pagination when searching
    }));
  };

  const handleViewItem = (item: StoreItem): void => {
    setSelectedItem(item);
    open();
  };

  const handleToggleStatus = (item: StoreItem, e: React.MouseEvent): void => {
    e.stopPropagation();
    updateStatusMutation.mutate(
      {
        id: item.id,
        active: !item.active,
      },
      {
        onSuccess: () => {
          // Update the selected item if it's currently being viewed
          if (selectedItem && selectedItem.id === item.id) {
            setSelectedItem({
              ...selectedItem,
              active: !selectedItem.active,
            });
          }
        },
      }
    );
  };

  const handlePageChange = (newOffset: number): void => {
    setSearchParams((prev) => ({
      ...prev,
      offset: newOffset,
    }));
  };

  return (
    <Container fluid p="md">
      <Stack gap="lg">
        <Group justify="space-between">
          <Title order={2} c="gray.8">
            Item Management
          </Title>
          <Button
            component={Link}
            href="/portal/admin/store/new"
            leftSection={<IconPlus size={16} />}
          >
            Add Item
          </Button>
        </Group>

        <Paper p="md" radius="md" withBorder>
          <StoreItemSearch
            searchInput={searchInput}
            setSearchInputAction={setSearchInput}
            activeFilter={activeFilter}
            setActiveFilterAction={setActiveFilter}
            setSearchParams={setSearchParams}
            onSearchAction={handleSearch}
          />

          {isLoading ? (
            <Center my="xl">
              <Loader size="md" />
            </Center>
          ) : error ? (
            <Alert
              icon={<IconAlertCircle size={16} />}
              title="Error loading store items"
              color="red"
            >
              {error.message}
            </Alert>
          ) : (
            <>
              <StoreItemTable
                items={data?.items || []}
                onViewItemAction={handleViewItem}
                onToggleStatusAction={handleToggleStatus}
              />

              {data && (
                <StoreItemPagination
                  currentOffset={searchParams.offset}
                  limit={searchParams.limit}
                  total={data.total}
                  onPageChange={handlePageChange}
                />
              )}
            </>
          )}
        </Paper>
      </Stack>

      <StoreItemDetailModal opened={opened} onClose={close} item={selectedItem} />
    </Container>
  );
}
