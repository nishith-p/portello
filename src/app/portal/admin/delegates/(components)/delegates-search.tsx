'use client';

import React, { Dispatch, SetStateAction } from 'react';
import { IconSearch } from '@tabler/icons-react';
import { Button, Group, Select, Stack, TextInput } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { ENTITIES } from '@/lib/core/constants';
import { UserSearchParams } from '@/lib/users/types';

interface DelegatesSearchProps {
  searchInput: string;
  setSearchInputAction: Dispatch<SetStateAction<string>>;
  setSearchParamsAction: Dispatch<
    SetStateAction<
      Required<Pick<UserSearchParams, 'limit' | 'offset'>> &
        Omit<UserSearchParams, 'limit' | 'offset'>
    >
  >;
  onSearchAction: () => void;
}

export function DelegatesSearch({
  searchInput,
  setSearchInputAction,
  setSearchParamsAction,
  onSearchAction,
}: DelegatesSearchProps) {
  const isMobile = useMediaQuery('(max-width: 768px)');

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Enter') {
      onSearchAction();
    }
  };

  if (isMobile) {
    return (
      <Stack mb="md" gap="xs">
        <TextInput
          placeholder="Search by name or email"
          leftSection={<IconSearch size={16} />}
          value={searchInput}
          onChange={(e) => setSearchInputAction(e.currentTarget.value)}
          onKeyDown={handleKeyDown}
          w="100%"
        />

        <Group grow>
          <Select
            placeholder="Entity"
            data={ENTITIES}
            clearable
            onChange={(value) =>
              setSearchParamsAction((prev) => ({ ...prev, entity: value || undefined, offset: 0 }))
            }
          />

          <Select
            placeholder="Round"
            data={['1', '2', '3']} // Replace with your rounds
            clearable
            onChange={(value) => {
              const round = value ? parseInt(value, 10) : undefined;
              setSearchParamsAction((prev) => ({ ...prev, round, offset: 0 }));
            }}
          />
        </Group>

        <Button onClick={onSearchAction}>Search</Button>
      </Stack>
    );
  }

  return (
    <Group mb="md" justify="space-between">
      <Group>
        <TextInput
          placeholder="Search by name or email"
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
          placeholder="Entity"
          data={ENTITIES}
          clearable
          onChange={(value) =>
            setSearchParamsAction((prev) => ({ ...prev, entity: value || undefined, offset: 0 }))
          }
        />
        <Select
          placeholder="Round"
          data={['1', '2', '3']} // Replace with your rounds
          clearable
          onChange={(value) => {
            const round = value ? parseInt(value, 10) : undefined;
            setSearchParamsAction((prev) => ({ ...prev, round, offset: 0 }));
          }}
        />
      </Group>
    </Group>
  );
}
