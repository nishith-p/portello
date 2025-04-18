import React, { Dispatch, SetStateAction } from 'react';
import { IconSearch } from '@tabler/icons-react';
import { Button, Group, Select, TextInput } from '@mantine/core';

interface SearchParams {
  search?: string;
  active?: boolean;
  limit: number;
  offset: number;
}

interface StoreItemSearchProps {
  searchInput: string;
  setSearchInput: Dispatch<SetStateAction<string>>;
  activeFilter: boolean | undefined;
  setActiveFilter: Dispatch<SetStateAction<boolean | undefined>>;
  setSearchParams: Dispatch<SetStateAction<SearchParams>>;
  onSearch: () => void;
}

export function StoreItemSearch({
  searchInput,
  setSearchInput,
  activeFilter,
  setActiveFilter,
  onSearch,
}: StoreItemSearchProps) {
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
          placeholder="Search items"
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
            { value: 'true', label: 'Active' },
            { value: 'false', label: 'Inactive' },
          ]}
          clearable
          value={activeFilter === undefined ? null : activeFilter.toString()}
          onChange={(value) => {
            const active = value === 'true' ? true : value === 'false' ? false : undefined;
            setActiveFilter(active);
          }}
        />
      </Group>
    </Group>
  );
}
