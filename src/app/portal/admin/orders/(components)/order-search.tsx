import React, { Dispatch, SetStateAction } from 'react';
import { IconSearch } from '@tabler/icons-react';
import { Button, Group, Select, TextInput } from '@mantine/core';
import { OrderStatus } from '@/lib/store/types';

interface OrderSearchProps {
  searchInput: string;
  setSearchInput: Dispatch<SetStateAction<string>>;
  statusFilter: OrderStatus | undefined;
  setStatusFilter: Dispatch<SetStateAction<OrderStatus | undefined>>;
  onSearch: () => void;
}

export function OrderSearch({
  searchInput,
  setSearchInput,
  statusFilter,
  setStatusFilter,
  onSearch,
}: OrderSearchProps) {
  // Handle enter key in search input
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Enter') {
      onSearch();
    }
  };

  return (
    <Group mb="md" justify="space-between">
      <Group>
        <TextInput
          placeholder="Search by Order ID or Name"
          leftSection={<IconSearch size={16} />}
          value={searchInput}
          onChange={(e) => setSearchInput(e.currentTarget.value)}
          onKeyDown={handleKeyDown}
          style={{ width: '300px' }}
        />
        <Button onClick={onSearch}>Search</Button>
      </Group>

      <Group>
        <Select
          placeholder="Status"
          data={[
            { value: 'pending', label: 'Pending' },
            { value: 'confirmed', label: 'Confirmed' },
            { value: 'paid', label: 'Paid' },
            { value: 'processing', label: 'Processing' },
            { value: 'shipped', label: 'Shipped' },
            { value: 'delivered', label: 'Delivered' },
            { value: 'cancelled', label: 'Cancelled' },
          ]}
          clearable
          value={statusFilter || null}
          onChange={(value) => {
            setStatusFilter(value as OrderStatus | undefined);
          }}
        />
      </Group>
    </Group>
  );
}
