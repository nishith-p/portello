'use client';

import React, { Dispatch, SetStateAction } from 'react';
import { IconSearch } from '@tabler/icons-react';
import { Button, Group, Select, Stack, TextInput } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { OrderStatus } from '@/lib/store/types';

interface OrderSearchProps {
  searchInput: string;
  setSearchInputAction: Dispatch<SetStateAction<string>>;
  statusFilterAction: OrderStatus | undefined;
  setStatusFilterAction: Dispatch<SetStateAction<OrderStatus | undefined>>;
  onSearchAction: () => void;
}

export function OrderSearch({
  searchInput,
  setSearchInputAction,
  statusFilterAction,
  setStatusFilterAction,
  onSearchAction,
}: OrderSearchProps) {
  const isMobile = useMediaQuery('(max-width: 768px)');

  // Handle enter key in search input
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Enter') {
      onSearchAction();
    }
  };

  // Status options for the dropdown
  const statusOptions = [
    { value: 'pending', label: 'Pending' },
    { value: 'confirmed', label: 'Confirmed' },
    { value: 'paid', label: 'Paid' },
    { value: 'processing', label: 'Processing' },
    { value: 'shipped', label: 'Shipped' },
    { value: 'delivered', label: 'Delivered' },
    { value: 'cancelled', label: 'Cancelled' },
  ];

  if (isMobile) {
    return (
      <Stack mb="md" gap="xs">
        <TextInput
          placeholder="Search by Order ID or Name"
          leftSection={<IconSearch size={16} />}
          value={searchInput}
          onChange={(e) => setSearchInputAction(e.currentTarget.value)}
          onKeyDown={handleKeyDown}
          w="100%"
        />

        <Group grow>
          <Select
            placeholder="Status"
            data={statusOptions}
            clearable
            value={statusFilterAction || null}
            onChange={(value) => {
              setStatusFilterAction(value as OrderStatus | undefined);
            }}
          />

          <Button onClick={onSearchAction}>Search</Button>
        </Group>
      </Stack>
    );
  }

  return (
    <Group mb="md" justify="space-between">
      <Group>
        <TextInput
          placeholder="Search by Order ID or Name"
          leftSection={<IconSearch size={16} />}
          value={searchInput}
          onChange={(e) => setSearchInputAction(e.currentTarget.value)}
          onKeyDown={handleKeyDown}
          style={{ width: '300px' }}
        />
        <Button onClick={onSearchAction}>Search</Button>
      </Group>

      <Group>
        <Select
          placeholder="Status"
          data={statusOptions}
          clearable
          value={statusFilterAction || null}
          onChange={(value) => {
            setStatusFilterAction(value as OrderStatus | undefined);
          }}
        />
      </Group>
    </Group>
  );
}
