'use client';

import React, { Dispatch, SetStateAction } from 'react';
import { IconSearch } from '@tabler/icons-react';
import { Button, Group, Select, TextInput } from '@mantine/core';
import { ENTITIES } from '@/lib/core/constants';
import { UserSearchParams } from '@/lib/users/types';

interface DelegatesSearchProps {
  searchInput: string;
  setSearchInput: Dispatch<SetStateAction<string>>;
  setSearchParams: Dispatch<
    SetStateAction<
      Required<Pick<UserSearchParams, 'limit' | 'offset'>> &
        Omit<UserSearchParams, 'limit' | 'offset'>
    >
  >;
  onSearch: () => void;
}

export function DelegatesSearch({
  searchInput,
  setSearchInput,
  setSearchParams,
  onSearch,
}: DelegatesSearchProps): JSX.Element {
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
          placeholder="Search by name or email"
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
          placeholder="Entity"
          data={ENTITIES}
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
  );
}
