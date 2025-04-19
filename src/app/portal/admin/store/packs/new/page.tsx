'use client';

import { useState } from 'react';
import { Container, Stack, Title } from '@mantine/core';
import { useCreateStorePack } from '@/lib/store/packs/hooks';
import { StorePack } from '@/lib/store/types';
import { PackForm } from '../(components)/pack-form';

export default function CreatePackPage() {
  const [error, setError] = useState<Error | null>(null);
  const createPackMutation = useCreateStorePack();

  // Handle form submission to create a new store pack
  const handleCreatePack = async (formData: StorePack): Promise<void> => {
    try {
      setError(null);
      await createPackMutation.mutateAsync({
        pack_code: formData.pack_code,
        name: formData.name,
        description: formData.description,
        price: formData.price,
        images: formData.images,
        active: formData.active,
        pre_price: formData.pre_price,
        discount_perc: formData.discount_perc,
        pack_items:
          formData.pack_items?.map((item) => ({
            item_id: item.item_id,
            quantity: item.quantity,
          })) || [],
      });
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to create store pack'));
      throw err; // Re-throw to let the form component handle it
    }
  };

  return (
    <Container fluid p="md">
      <Stack gap="md">
        <Title order={2} c="gray.8">
          Create Pack
        </Title>

        <PackForm
          onSubmitAction={handleCreatePack}
          isLoading={createPackMutation.isPending}
          error={error}
          submitButtonText="Create Pack"
        />
      </Stack>
    </Container>
  );
}
