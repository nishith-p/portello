'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { IconAlertCircle } from '@tabler/icons-react';
import {
  Alert,
  Box,
  Button,
  Group,
  NumberInput,
  Paper,
  Stack,
  Switch,
  Text,
  Textarea,
  TextInput,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { StoreItemInput } from '@/lib/store/types';
import { ColorsSection, ImagesSection, SizesSection } from './sections';

export interface StoreItemFormProps {
  initialValues?: Partial<StoreItemInput>;
  onSubmitAction: (values: StoreItemInput) => Promise<void>;
  isLoading: boolean;
  error: Error | null;
  submitButtonText: string;
}

export function StoreItemForm({
  initialValues = {},
  onSubmitAction,
  isLoading,
  error,
  submitButtonText,
}: StoreItemFormProps) {
  const router = useRouter();

  const form = useForm<StoreItemInput>({
    initialValues: {
      item_code: '',
      name: '',
      price: 0,
      description: '',
      images: [],
      sizes: [],
      colors: [],
      active: true,
      ...initialValues,
    },
    validate: {
      item_code: (v) => (v ? null : 'Item code is required'),
      name: (v) => (v ? null : 'Name is required'),
      price: (v) => (v >= 0 ? null : 'Price must be a positive number'),
      description: (v) => (v ? null : 'Description is required'),
    },
  });

  const handleSubmit = async (values: StoreItemInput) => {
    try {
      await onSubmitAction(values);
      form.reset();
      router.push('/portal/admin/store');
    } catch (err) {
      notifications.show({
        title: 'Error',
        message: err instanceof Error ? err.message : 'Failed to save store item',
        color: 'red',
      });
    }
  };

  return (
    <Box>
      <Paper p="md" radius="md" withBorder mb="lg">
        {error && (
          <Alert icon={<IconAlertCircle size={16} />} title="Error" color="red" mb="md">
            {error.message}
          </Alert>
        )}

        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack gap="md">
            <Group grow>
              <TextInput
                label="Item Code"
                placeholder="e.g. SHIRT-001"
                {...form.getInputProps('item_code')}
                required
              />
              <TextInput
                label="Name"
                placeholder="Product name"
                {...form.getInputProps('name')}
                required
              />
            </Group>

            <Group grow align="flex-end">
              <NumberInput
                label="Price (USD)"
                placeholder="0.00"
                min={0}
                {...form.getInputProps('price')}
                required
              />
              <Stack gap={0}>
                <Switch
                  label="Active"
                  checked={form.values.active}
                  onChange={(e) => form.setFieldValue('active', e.currentTarget.checked)}
                />
                <Text size="xs" c="dimmed">
                  Item will be visible in the store
                </Text>
              </Stack>
            </Group>

            <Textarea
              label="Description"
              placeholder="Product description"
              minRows={4}
              {...form.getInputProps('description')}
              required
            />

            <ImagesSection
              images={form.values.images}
              setImages={(images) => form.setFieldValue('images', images)}
            />

            <SizesSection
              sizes={form.values.sizes}
              setSizes={(sizes) => form.setFieldValue('sizes', sizes)}
            />

            <ColorsSection
              colors={form.values.colors}
              setColors={(colors) => form.setFieldValue('colors', colors)}
            />

            <Group justify="flex-end">
              <Button variant="outline" component={Link} href="/portal/admin/store">
                Cancel
              </Button>
              <Button type="submit" loading={isLoading}>
                {submitButtonText}
              </Button>
            </Group>
          </Stack>
        </form>
      </Paper>
    </Box>
  );
}
