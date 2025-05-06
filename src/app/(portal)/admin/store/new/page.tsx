'use client';

import { useState } from 'react';
import { Container, Stack, Title } from '@mantine/core';
import { useCreateStoreItem } from '@/lib/store/items/hooks';
import { StoreItemInput } from '@/lib/store/types';
import { StoreItemForm } from '@/app/(portal)/admin/store/(components)';

export default function CreateStorePage() {
  const [error, setError] = useState<Error | null>(null);
  const createItemMutation = useCreateStoreItem();

  const handleCreateItem = async (formData: StoreItemInput): Promise<void> => {
    try {
      setError(null);
      await createItemMutation.mutateAsync(formData);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to create store item'));
      throw err;
    }
  };

  return (
    <Container fluid p="md">
      <Stack gap="md">
        <Title order={2} c="gray.8">
          Add Item
        </Title>

        <StoreItemForm
          onSubmitAction={handleCreateItem}
          isLoading={createItemMutation.isPending}
          error={error}
          submitButtonText="Submit"
        />
      </Stack>
    </Container>
  );
}
