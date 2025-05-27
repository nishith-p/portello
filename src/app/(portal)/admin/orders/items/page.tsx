'use client';

import React, { useMemo, useState } from 'react';
import { IconAlertCircle, IconDownload, IconRefresh } from '@tabler/icons-react';
import { Alert, Button, Center, Container, Group, Loader, Stack, Title } from '@mantine/core';
import { useItemQuantityHooks } from '@/lib/store/orders/hooks';
import {
  CsvExportRow,
  ItemVariation,
  ItemWithVariations,
  PackVariation,
  PackWithVariations,
} from '@/lib/store/types';
import { exportToCsv } from '@/lib/utils';
import { ItemQuantitySearch, ItemsTable, PacksTable } from '../(components)';

export default function ItemQuantitiesPage() {
  const [searchInput, setSearchInput] = useState('');

  const { useItemQuantities } = useItemQuantityHooks();
  const { data, isLoading, error, refetch } = useItemQuantities();

  const { items, packs } = useMemo(() => {
    if (!data) {
      return { items: [], packs: [] };
    }

    let filteredItems = [...(data.items || [])];
    let filteredPacks = [...(data.packs || [])];

    if (searchInput.trim()) {
      const term = searchInput.toLowerCase();
      filteredItems = filteredItems.filter(
        (item) =>
          item.item_code.toLowerCase().includes(term) || item.name.toLowerCase().includes(term)
      );
      filteredPacks = filteredPacks.filter(
        (pack) =>
          pack.pack_code.toLowerCase().includes(term) || pack.name.toLowerCase().includes(term)
      );
    }

    return {
      items: filteredItems,
      packs: filteredPacks,
    };
  }, [data, searchInput]);

  const handleExport = () => {
    if (!data) return;

    // Create a map to aggregate quantities for items
    const itemMap = new Map<string, CsvExportRow>();

    data.items.forEach((item: ItemWithVariations) => {
      if (!item.variations || item.variations.length === 0) {
        const key = `${item.item_code}|N/A|N/A`;
        const existing = itemMap.get(key);
        if (existing) {
          existing.quantity += item.quantity;
        } else {
          itemMap.set(key, {
            type: 'Item',
            code: item.item_code,
            name: item.name,
            color: 'N/A',
            size: 'N/A',
            quantity: item.quantity,
          });
        }
        return;
      }

      item.variations.forEach((variation: ItemVariation) => {
        const key = `${item.item_code}|${variation.color || 'N/A'}|${variation.size || 'N/A'}`;
        const existing = itemMap.get(key);
        if (existing) {
          existing.quantity += variation.quantity;
        } else {
          itemMap.set(key, {
            type: 'Item',
            code: item.item_code,
            name: item.name,
            color: variation.color || 'N/A',
            size: variation.size || 'N/A',
            quantity: variation.quantity,
          });
        }
      });
    });

    // Create a map to aggregate quantities for packs
    const packMap = new Map<string, CsvExportRow>();

    data.packs.forEach((pack: PackWithVariations) => {
      if (!pack.variations || pack.variations.length === 0) {
        const key = `${pack.pack_code}|N/A|N/A`;
        const existing = packMap.get(key);
        if (existing) {
          existing.quantity += pack.quantity;
        } else {
          packMap.set(key, {
            type: 'Pack',
            code: pack.pack_code,
            name: pack.name,
            color: 'N/A',
            size: 'N/A',
            quantity: pack.quantity,
          });
        }
        return;
      }

      pack.variations.forEach((variation: PackVariation) => {
        const key = `${pack.pack_code}|${variation.color || 'N/A'}|${variation.size || 'N/A'}`;
        const existing = packMap.get(key);
        if (existing) {
          existing.quantity += variation.quantity;
        } else {
          packMap.set(key, {
            type: 'Pack',
            code: pack.pack_code,
            name: pack.name,
            color: variation.color || 'N/A',
            size: variation.size || 'N/A',
            quantity: variation.quantity,
          });
        }
      });
    });

    // Combine and export
    exportToCsv('item_quantities.csv', [
      ...Array.from(itemMap.values()),
      ...Array.from(packMap.values()),
    ]);
  };

  return (
    <Container fluid p="md">
      <Stack gap="lg">
        <Group justify="space-between">
          <Title order={2} c="gray.8">
            Item Quantities
          </Title>
          <Group>
            <Button
              leftSection={<IconDownload size={16} />}
              variant="outline"
              onClick={handleExport}
              disabled={isLoading || !data}
            >
              Export to CSV
            </Button>
            <Button
              leftSection={<IconRefresh size={16} />}
              variant="primary"
              onClick={() => refetch()}
            >
              Refresh
            </Button>
          </Group>
        </Group>

        <ItemQuantitySearch searchInput={searchInput} onSearchChange={setSearchInput} />

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
