'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { IconAlertCircle, IconPlus, IconSearch, IconTrash } from '@tabler/icons-react';
import {
  ActionIcon,
  Alert,
  Box,
  Button,
  Card,
  Divider,
  Group,
  Modal,
  NumberInput,
  Paper,
  ScrollArea,
  Stack,
  Switch,
  Table,
  Text,
  Textarea,
  TextInput,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { useStoreItemSearch } from '@/lib/store/items/hooks';
import { StoreItem, StorePack } from '@/lib/store/types';

interface PackFormProps {
  initialValues?: Partial<StorePack>;
  onSubmitAction: (values: StorePack) => Promise<void>;
  isLoading: boolean;
  error: Error | null;
  submitButtonText: string;
}

export function PackForm({
  initialValues = {},
  onSubmitAction,
  isLoading,
  error,
  submitButtonText,
}: PackFormProps) {
  const router = useRouter();
  const [isEditing] = useState<boolean>(!!initialValues.id);
  const [selectedItems, setSelectedItems] = useState<Array<{ item: StoreItem; quantity: number }>>(
    []
  );
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isSearchModalOpen, setIsSearchModalOpen] = useState<boolean>(false);

  const { data: searchResults, isLoading: isSearching } = useStoreItemSearch({
    search: searchQuery,
    active: true,
    limit: 10,
  });

  const form = useForm({
    initialValues: {
      pack_code: '',
      name: '',
      description: '',
      price: 0,
      images: [] as string[],
      active: true,
      ...initialValues,
    },
    validate: {
      pack_code: (value) => (value.trim() === '' ? 'Pack code is required' : null),
      name: (value) => (value.trim() === '' ? 'Name is required' : null),
      price: (value) => (value <= 0 ? 'Price must be greater than 0' : null),
      description: (value) => (value.trim() === '' ? 'Description is required' : null),
    },
  });

  useEffect(() => {
    if (isEditing && initialValues?.pack_items) {
      const items = initialValues.pack_items.map((pi) => ({
        item: pi.item as StoreItem,
        quantity: pi.quantity,
      }));
      setSelectedItems(items);
    }
  }, [isEditing, initialValues]);

  const handleAddItem = (item: StoreItem) => {
    if (selectedItems.find((si) => si.item.id === item.id)) {
      notifications.show({
        title: 'Info',
        message: 'This item is already in the pack',
        color: 'blue',
      });
      return;
    }
    setSelectedItems([...selectedItems, { item, quantity: 1 }]);
    setIsSearchModalOpen(false);
    setSearchQuery('');
  };

  const handleRemoveItem = (itemId: string) => {
    setSelectedItems(selectedItems.filter((si) => si.item.id !== itemId));
  };

  const handleQuantityChange = (itemId: string, quantity: number) => {
    setSelectedItems(selectedItems.map((si) => (si.item.id === itemId ? { ...si, quantity } : si)));
  };

  const [imageUrl, setImageUrl] = useState<string>('');

  const handleAddImage = () => {
    if (imageUrl.trim()) {
      form.setFieldValue('images', [...form.values.images, imageUrl.trim()]);
      setImageUrl('');
    }
  };

  const handleRemoveImage = (index: number) => {
    form.setFieldValue(
      'images',
      form.values.images.filter((_, i) => i !== index)
    );
  };

  const handleSubmit = async (values: typeof form.values) => {
    if (selectedItems.length === 0) {
      notifications.show({
        title: 'Error',
        message: 'Pack must contain at least one item',
        color: 'red',
      });
      return;
    }

    try {
      const packData = {
        ...values,
        pack_items: selectedItems.map((si) => ({
          item_id: si.item.id,
          quantity: si.quantity,
          item: si.item,
        })),
      };
      await onSubmitAction(packData as StorePack);
      form.reset();
      router.push('/portal/admin/store/packs');
    } catch (err) {
      notifications.show({
        title: 'Error',
        message: err instanceof Error ? err.message : 'Failed to save store pack',
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
                label="Pack Code"
                placeholder="e.g. BUNDLE-001"
                {...form.getInputProps('pack_code')}
                required
              />
              <TextInput
                label="Name"
                placeholder="Pack name"
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
                  Pack will be visible in the store
                </Text>
              </Stack>
            </Group>

            <Textarea
              label="Description"
              placeholder="Pack description"
              minRows={4}
              {...form.getInputProps('description')}
              required
            />

            <Divider label="Pack Images" labelPosition="center" />

            <Box>
              <Group justify="space-between" mb="xs">
                <Text size="sm" fw={500}>
                  Images
                </Text>
              </Group>
              <Group align="flex-end" mb="md">
                <TextInput
                  label="Image URL"
                  placeholder="Enter image URL"
                  style={{ flex: 1 }}
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.currentTarget.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddImage()}
                />
                <Button onClick={handleAddImage} leftSection={<IconPlus size={14} />}>
                  Add
                </Button>
              </Group>
              {form.values.images.length === 0 ? (
                <Text size="sm" c="dimmed">
                  No images added yet
                </Text>
              ) : (
                <Group>
                  {form.values.images.map((url, index) => (
                    <Card key={index} p="xs" withBorder>
                      <Group justify="end" mb="xs">
                        <ActionIcon
                          color="red"
                          variant="light"
                          size="sm"
                          onClick={() => handleRemoveImage(index)}
                        >
                          <IconTrash size={14} />
                        </ActionIcon>
                      </Group>
                      <Text size="xs" fw={500} mb="xs">
                        Image {index + 1}
                      </Text>
                      <Text size="xs" c="dimmed" style={{ wordBreak: 'break-all' }}>
                        {url.length > 30 ? `${url.substring(0, 30)}...` : url}
                      </Text>
                    </Card>
                  ))}
                </Group>
              )}
            </Box>

            <Divider label="Pack Items" labelPosition="center" />

            <Box>
              <Group justify="space-between" mb="md">
                <Text size="sm" fw={500}>
                  Items in this Pack
                </Text>
                <Button
                  size="xs"
                  leftSection={<IconSearch size={14} />}
                  onClick={() => setIsSearchModalOpen(true)}
                >
                  Add Items
                </Button>
              </Group>
              {selectedItems.length === 0 ? (
                <Alert icon={<IconAlertCircle size={16} />} color="orange">
                  No items added to this pack yet. Please add at least one item.
                </Alert>
              ) : (
                <ScrollArea>
                  <Table withTableBorder highlightOnHover>
                    <Table.Thead>
                      <Table.Tr>
                        <Table.Th>Item Code</Table.Th>
                        <Table.Th>Name</Table.Th>
                        <Table.Th>Base Price</Table.Th>
                        <Table.Th>Quantity</Table.Th>
                        <Table.Th style={{ width: 100 }}>Actions</Table.Th>
                      </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                      {selectedItems.map((selectedItem) => (
                        <Table.Tr key={selectedItem.item.id}>
                          <Table.Td>{selectedItem.item.item_code}</Table.Td>
                          <Table.Td>{selectedItem.item.name}</Table.Td>
                          <Table.Td>${selectedItem.item.price.toFixed(2)}</Table.Td>
                          <Table.Td>
                            <NumberInput
                              min={1}
                              max={10}
                              value={selectedItem.quantity}
                              onChange={(value) =>
                                handleQuantityChange(selectedItem.item.id, Number(value) || 1)
                              }
                              style={{ width: 80 }}
                              size="xs"
                            />
                          </Table.Td>
                          <Table.Td>
                            <ActionIcon
                              color="red"
                              onClick={() => handleRemoveItem(selectedItem.item.id)}
                            >
                              <IconTrash size={16} />
                            </ActionIcon>
                          </Table.Td>
                        </Table.Tr>
                      ))}
                    </Table.Tbody>
                  </Table>
                </ScrollArea>
              )}
            </Box>

            <Group justify="flex-end" mt="xl">
              <Button variant="outline" component={Link} href="/portal/admin/store/packs">
                Cancel
              </Button>
              <Button type="submit" loading={isLoading}>
                {submitButtonText}
              </Button>
            </Group>
          </Stack>
        </form>
      </Paper>

      <Modal
        opened={isSearchModalOpen}
        onClose={() => {
          setIsSearchModalOpen(false);
          setSearchQuery('');
        }}
        title="Add Items to Pack"
        size="lg"
      >
        <Stack>
          <TextInput
            placeholder="Search for items by name or code"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.currentTarget.value)}
            rightSection={isSearching ? <Text size="xs">Searching...</Text> : null}
          />

          <ScrollArea h={400}>
            <Table striped highlightOnHover>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Code</Table.Th>
                  <Table.Th>Name</Table.Th>
                  <Table.Th>Price</Table.Th>
                  <Table.Th>Action</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {searchResults?.items && searchResults.items.length === 0 ? (
                  <Table.Tr>
                    <Table.Td colSpan={4}>
                      <Text ta="center" c="dimmed" py="md">
                        No items found
                      </Text>
                    </Table.Td>
                  </Table.Tr>
                ) : (
                  searchResults?.items.map((item) => {
                    const isSelected = selectedItems.some((si) => si.item.id === item.id);
                    return (
                      <Table.Tr key={item.id}>
                        <Table.Td>{item.item_code}</Table.Td>
                        <Table.Td>{item.name}</Table.Td>
                        <Table.Td>${item.price.toFixed(2)}</Table.Td>
                        <Table.Td>
                          <Button
                            size="xs"
                            variant={isSelected ? 'light' : 'filled'}
                            color={isSelected ? 'gray' : 'blue'}
                            onClick={() => !isSelected && handleAddItem(item)}
                            disabled={isSelected}
                          >
                            {isSelected ? 'Added' : 'Add'}
                          </Button>
                        </Table.Td>
                      </Table.Tr>
                    );
                  })
                )}
              </Table.Tbody>
            </Table>
          </ScrollArea>
        </Stack>
      </Modal>
    </Box>
  );
}
