'use client';

import React, { Dispatch, SetStateAction } from 'react';
import { IconSearch } from '@tabler/icons-react';
import { Button, Group, Select, Stack, TextInput } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';

interface SearchParams {
  search?: string;
  active?: boolean;
  limit: number;
  offset: number;
}

interface StoreItemSearchProps {
  searchInput: string;
  setSearchInputAction: Dispatch<SetStateAction<string>>;
  activeFilter: boolean | undefined;
  setActiveFilterAction: Dispatch<SetStateAction<boolean | undefined>>;
  setSearchParams: Dispatch<SetStateAction<SearchParams>>;
  onSearchAction: () => void;
}

export function StoreItemSearch({
  searchInput,
  setSearchInputAction,
  activeFilter,
  setActiveFilterAction,
  onSearchAction,
}: StoreItemSearchProps) {
  const isMobile = useMediaQuery('(max-width: 768px)');

  // Handle enter key in search input
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Enter') {
      onSearchAction();
    }
  };

  // Status options for dropdown
  const statusOptions = [
    { value: 'true', label: 'Active' },
    { value: 'false', label: 'Inactive' },
  ];

  if (isMobile) {
    return (
      <Stack mb="md" gap="xs">
        <TextInput
          placeholder="Search items"
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
            value={activeFilter === undefined ? null : activeFilter.toString()}
            onChange={(value) => {
              const active = value === 'true' ? true : value === 'false' ? false : undefined;
              setActiveFilterAction(active);
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
          placeholder="Search items"
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
          value={activeFilter === undefined ? null : activeFilter.toString()}
          onChange={(value) => {
            const active = value === 'true' ? true : value === 'false' ? false : undefined;
            setActiveFilterAction(active);
          }}
        />
      </Group>
    </Group>
  );
}
