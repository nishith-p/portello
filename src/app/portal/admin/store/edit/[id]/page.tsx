'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { IconAlertCircle } from '@tabler/icons-react';
import { Alert, Center, Container, Loader, Stack, Title } from '@mantine/core';
import { useStoreItem, useUpdateStoreItem } from '@/lib/store/items/hooks';
import { StoreItemInput } from '@/lib/store/types';
import { StoreItemForm } from '../../(components)/store-item-form';

export default function EditStorePage() {
  const params = useParams();
  const itemId = Array.isArray(params.id) ? params.id[0] : params.id;

  const [error, setError] = useState<Error | null>(null);
  const { data: item, isLoading, error: fetchError } = useStoreItem(itemId as string);
  const updateItemMutation = useUpdateStoreItem();

  // Handle form submission to update an existing store item
  const handleUpdateItem = async (formData: StoreItemInput): Promise<void> => {
    try {
      setError(null);
      await updateItemMutation.mutateAsync({
        id: itemId as string,
        data: formData,
      });
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to update store item'));
      throw err; // Re-throw to let the form component handle it
    }
  };

  if (isLoading) {
    return (
      <Container fluid p="md">
        <Center my="xl">
          <Loader size="lg" />
        </Center>
      </Container>
    );
  }

  if (fetchError || !item) {
    return (
      <Container fluid p="md">
        <Alert icon={<IconAlertCircle size={16} />} title="Error loading store item" color="red">
          {fetchError instanceof Error ? fetchError.message : 'Failed to load store item details'}
        </Alert>
      </Container>
    );
  }

  return (
    <Container fluid p="md">
      <Stack gap="md">
        <Title order={2} c="gray.8">
          Edit Item
        </Title>

        <StoreItemForm
          initialValues={item}
          onSubmitAction={handleUpdateItem}
          isLoading={updateItemMutation.isPending}
          error={error}
          submitButtonText="Update Item"
        />
      </Stack>
    </Container>
  );
}
