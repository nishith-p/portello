'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { IconAlertCircle, IconArrowLeft, IconPlus, IconTrash } from '@tabler/icons-react';
import {
  ActionIcon,
  Alert,
  Badge,
  Box,
  Button,
  Card,
  ColorInput,
  Container,
  Divider,
  Group,
  MultiSelect,
  NumberInput,
  Paper,
  SimpleGrid,
  Switch,
  Text,
  Textarea,
  TextInput,
  Title,
  useMantineTheme,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { useCreateStoreItem } from '@/lib/store/items/hooks';
import { StoreItemColor, StoreItemInput } from '@/lib/store/types';

// Common T-shirt sizes for convenience
const COMMON_SIZES = ['XXS', 'XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'];

export default function AddStoreItemPage(): JSX.Element {
  const router = useRouter();
  const theme = useMantineTheme();
  const createItemMutation = useCreateStoreItem();

  // State for colors
  const [colors, setColors] = useState<StoreItemColor[]>([]);
  const [colorName, setColorName] = useState('');
  const [colorHex, setColorHex] = useState('#000000');

  // State for images
  const [images, setImages] = useState<string[]>([]);
  const [newImageUrl, setNewImageUrl] = useState('');

  // Form for the create item
  const form = useForm<Omit<StoreItemInput, 'colors' | 'images'> & { active: boolean }>({
    initialValues: {
      item_code: '',
      name: '',
      price: 0,
      description: '',
      sizes: [] as string[],
      active: true,
    },
    validate: {
      item_code: (value) => (value.trim() ? null : 'Item code is required'),
      name: (value) => (value.trim() ? null : 'Name is required'),
      price: (value) => (value > 0 ? null : 'Price must be greater than 0'),
      description: (value) => (value.trim() ? null : 'Description is required'),
    },
  });

  // Add a create color
  const handleAddColor = () => {
    if (!colorName.trim()) {
      notifications.show({
        title: 'Error',
        message: 'Color name is required',
        color: 'red',
      });
      return;
    }

    setColors([...colors, { name: colorName, hex: colorHex }]);
    setColorName('');
    setColorHex('#000000');
  };

  // Remove a color
  const handleRemoveColor = (index: number) => {
    setColors(colors.filter((_, i) => i !== index));
  };

  // Add a create image URL
  const handleAddImage = () => {
    if (!newImageUrl.trim()) {
      notifications.show({
        title: 'Error',
        message: 'Image URL is required',
        color: 'red',
      });
      return;
    }

    setImages([...images, newImageUrl]);
    setNewImageUrl('');
  };

  // Remove an image
  const handleRemoveImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  // Form submission
  const handleSubmit = (
    values: Omit<StoreItemInput, 'colors' | 'images'> & { active: boolean }
  ) => {
    // Create the complete store item input
    const storeItem: StoreItemInput = {
      ...values,
      colors,
      images,
    };

    // Submit to API
    createItemMutation.mutate(storeItem, {
      onSuccess: () => {
        router.push('/admin/store');
      },
    });
  };

  return (
    <Container fluid p="md">
      <Group mb="xl">
        <Button
          variant="outline"
          leftSection={<IconArrowLeft size={16} />}
          onClick={() => router.push('/admin/store')}
        >
          Back to Store Management
        </Button>
        <Title order={2} c="gray.8">
          Add New Store Item
        </Title>
      </Group>

      <form onSubmit={form.onSubmit(handleSubmit)}>
        <SimpleGrid cols={{ base: 1, md: 2 }} spacing="xl">
          <div>
            <Card shadow="sm" padding="lg" radius="md" withBorder mb="lg">
              <Title order={4} mb="md">
                Basic Information
              </Title>

              <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
                <TextInput
                  required
                  label="Item Code"
                  placeholder="Enter unique item code"
                  {...form.getInputProps('item_code')}
                />

                <TextInput
                  required
                  label="Name"
                  placeholder="Enter item name"
                  {...form.getInputProps('name')}
                />
              </SimpleGrid>

              <NumberInput
                required
                label="Price ($)"
                placeholder="Enter price"
                min={0.01}
                mt="md"
                {...form.getInputProps('price')}
              />

              <Textarea
                required
                label="Description"
                placeholder="Enter item description"
                minRows={4}
                maxRows={6}
                mt="md"
                {...form.getInputProps('description')}
              />

              <Switch
                label="Item is active and available for purchase"
                mt="md"
                {...form.getInputProps('active', { type: 'checkbox' })}
              />
            </Card>

            <Card shadow="sm" padding="lg" radius="md" withBorder>
              <Title order={4} mb="md">
                Sizes
              </Title>

              <MultiSelect
                label="Available Sizes"
                placeholder="Select available sizes"
                data={COMMON_SIZES}
                searchable
                creatable
                getCreateLabel={(query) => `+ Add ${query}`}
                {...form.getInputProps('sizes')}
              />
            </Card>
          </div>

          <div>
            <Card shadow="sm" padding="lg" radius="md" withBorder mb="lg">
              <Title order={4} mb="md">
                Colors
              </Title>

              <Group align="flex-end">
                <TextInput
                  label="Color Name"
                  placeholder="e.g., Navy Blue"
                  value={colorName}
                  onChange={(e) => setColorName(e.currentTarget.value)}
                  style={{ flex: 1 }}
                />

                <ColorInput
                  label="Color"
                  format="hex"
                  value={colorHex}
                  onChange={setColorHex}
                  withEyeDropper
                />

                <Button leftSection={<IconPlus size={16} />} onClick={handleAddColor}>
                  Add
                </Button>
              </Group>

              {colors.length > 0 ? (
                <div style={{ marginTop: 20 }}>
                  <Divider label="Added Colors" labelPosition="center" mb="sm" />
                  <Group>
                    {colors.map((color, index) => (
                      <Badge
                        key={index}
                        size="lg"
                        variant="outline"
                        rightSection={
                          <ActionIcon
                            size="xs"
                            color="red"
                            radius="xl"
                            variant="transparent"
                            onClick={() => handleRemoveColor(index)}
                          >
                            <IconTrash size={14} />
                          </ActionIcon>
                        }
                        leftSection={
                          <Box
                            style={{
                              width: 16,
                              height: 16,
                              borderRadius: '50%',
                              backgroundColor: color.hex,
                              border: `1px solid ${theme.colors.gray[3]}`,
                            }}
                          />
                        }
                      >
                        {color.name}
                      </Badge>
                    ))}
                  </Group>
                </div>
              ) : (
                <Alert
                  icon={<IconAlertCircle size={16} />}
                  color="blue"
                  title="No Colors Added"
                  mt="md"
                >
                  Add at least one color for the item.
                </Alert>
              )}
            </Card>

            <Card shadow="sm" padding="lg" radius="md" withBorder>
              <Title order={4} mb="md">
                Images
              </Title>

              <Group align="flex-end">
                <TextInput
                  label="Image URL"
                  placeholder="Enter image URL"
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.currentTarget.value)}
                  style={{ flex: 1 }}
                />

                <Button leftSection={<IconPlus size={16} />} onClick={handleAddImage}>
                  Add
                </Button>
              </Group>

              {images.length > 0 ? (
                <div style={{ marginTop: 20 }}>
                  <Divider label="Added Images" labelPosition="center" mb="sm" />
                  <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="sm">
                    {images.map((_, index) => (
                      <Paper key={index} p="xs" withBorder>
                        <Group>
                          <Text size="sm" truncate style={{ maxWidth: '200px' }}>
                            Image {index + 1}
                          </Text>
                          <ActionIcon color="red" onClick={() => handleRemoveImage(index)}>
                            <IconTrash size={16} />
                          </ActionIcon>
                        </Group>
                      </Paper>
                    ))}
                  </SimpleGrid>
                </div>
              ) : (
                <Alert
                  icon={<IconAlertCircle size={16} />}
                  color="blue"
                  title="No Images Added"
                  mt="md"
                >
                  Add at least one image for the item.
                </Alert>
              )}
            </Card>
          </div>
        </SimpleGrid>

        <Group mt="xl" justify="flex-end">
          <Button variant="outline" onClick={() => router.push('/admin/store')}>
            Cancel
          </Button>
          <Button type="submit" color="blue" loading={createItemMutation.isPending}>
            Create Item
          </Button>
        </Group>
      </form>
    </Container>
  );
}
