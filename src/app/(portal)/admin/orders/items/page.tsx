'use client';

import React, { useMemo, useState } from 'react';
import { IconAlertCircle, IconRefresh } from '@tabler/icons-react';
import {
  Alert,
  Button,
  Center,
  Container,
  Group,
  Loader,
  Stack,
  Title,
} from '@mantine/core';
import { ItemQuantitySearch, ItemsTable, PacksTable } from '../(components)';
import { useItemQuantityHooks } from '@/lib/store/orders/hooks';

export default function ItemQuantitiesPage() {
  const [searchInput, setSearchInput] = useState('');

  const { useItemQuantities } = useItemQuantityHooks();
  const { data, isLoading, error, refetch } = useItemQuantities();

  const { items, packs } = useMemo(() => {
    if (!data) {return { items: [], packs: [] };}

    let filteredItems = [...(data.items || [])];
    let filteredPacks = [...(data.packs || [])];

    if (searchInput.trim()) {
      const term = searchInput.toLowerCase();
      filteredItems = filteredItems.filter((item) =>
        item.item_code.toLowerCase().includes(term) ||
        item.name.toLowerCase().includes(term)
      );
      filteredPacks = filteredPacks.filter((pack) =>
        pack.pack_code.toLowerCase().includes(term) ||
        pack.name.toLowerCase().includes(term)
      );
    }

    return {
      items: filteredItems,
      packs: filteredPacks,
    };
  }, [data, searchInput]);

  return (
    <Container fluid p="md">
      <Stack gap="lg">
        <Group justify="space-between">
          <Title order={2} c="gray.8">
            Item Quantities
          </Title>
          <Button
            leftSection={<IconRefresh size={16} />}
            variant="primary"
            onClick={() => refetch()}
          >
            Refresh
          </Button>
        </Group>

        <ItemQuantitySearch
          searchInput={searchInput}
          onSearchChange={setSearchInput}
        />

        {isLoading ? (
          <Center>
            <Loader />
          </Center>
        ) : error ? (
          <Alert
            icon={<IconAlertCircle size={16} />}
            title="Error loading item quantities"
            color="red"
          >
            {error.message}
          </Alert>
        ) : (
          <Stack>
            <ItemsTable items={items} />
            <PacksTable packs={packs} />
          </Stack>
        )}
      </Stack>
    </Container>
  );
}
