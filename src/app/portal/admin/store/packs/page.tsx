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
import { useStorePackSearch, useUpdateStorePackStatus } from '@/lib/store/packs/hooks';
import { StorePack, StorePackSearchParams } from '@/lib/store/types';
import { PackDetailModal, PackTable } from './(components)';

export default function AdminPacksPage() {
  const [searchParams, setSearchParams] = useState<
    Required<Pick<StorePackSearchParams, 'limit' | 'offset'>> &
      Omit<StorePackSearchParams, 'limit' | 'offset'>
  >({
    limit: 10,
    offset: 0,
  });

  // State for pack details modal
  const [opened, { open, close }] = useDisclosure(false);
  const [selectedPack, setSelectedPack] = useState<StorePack | null>(null);

  // Fetch store packs with search parameters
  const { data, isLoading, error } = useStorePackSearch(searchParams);
  const updateStatusMutation = useUpdateStorePackStatus();

  // View pack details
  const handleViewPack = (pack: StorePack): void => {
    setSelectedPack(pack);
    open();
  };

  // Toggle pack active status
  const handleToggleStatus = (pack: StorePack, e: React.MouseEvent): void => {
    e.stopPropagation();
    updateStatusMutation.mutate(
      {
        id: pack.id,
        active: !pack.active,
      },
      {
        onSuccess: () => {
          // Update the selected pack if it's currently being viewed
          if (selectedPack && selectedPack.id === pack.id) {
            setSelectedPack({
              ...selectedPack,
              active: !selectedPack.active,
            });
          }
        },
      }
    );
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
        <Group justify="space-between">
          <Title order={2} c="gray.8">
            Pack Management
          </Title>
          <Button
            component={Link}
            href="/portal/admin/store/packs/new"
            leftSection={<IconPlus size={16} />}
          >
            Create Pack
          </Button>
        </Group>

        <Paper p="md" radius="md" withBorder>
          {isLoading ? (
            <Center my="xl">
              <Loader size="md" />
            </Center>
          ) : error ? (
            <Alert
              icon={<IconAlertCircle size={16} />}
              title="Error loading store packs"
              color="red"
            >
              {error.message}
            </Alert>
          ) : (
            <>
              <PackTable
                packs={data?.packs || []}
                onViewPackAction={handleViewPack}
                onToggleStatusAction={handleToggleStatus}
              />

              {data && data.total > searchParams.limit && (
                <Group gap="center" mt="md">
                  <Button
                    disabled={searchParams.offset === 0}
                    onClick={() =>
                      handlePageChange(Math.max(0, searchParams.offset - searchParams.limit))
                    }
                    variant="subtle"
                  >
                    Previous
                  </Button>
                  <Button
                    disabled={searchParams.offset + searchParams.limit >= data.total}
                    onClick={() => handlePageChange(searchParams.offset + searchParams.limit)}
                    variant="subtle"
                  >
                    Next
                  </Button>
                </Group>
              )}
            </>
          )}
        </Paper>
      </Stack>

      <PackDetailModal opened={opened} onClose={close} pack={selectedPack} />
    </Container>
  );
}
