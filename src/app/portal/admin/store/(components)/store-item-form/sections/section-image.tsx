import { useState } from 'react';
import { IconLink, IconPlus, IconTrash } from '@tabler/icons-react';
import { ActionIcon, Box, Button, Card, Grid, Group, Image, Text, TextInput } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { addUniqueItem } from '../unique-item';

interface ImagesSectionProps {
  images: string[];
  setImages: (images: string[]) => void;
}

export function ImagesSection({ images, setImages }: ImagesSectionProps) {
  const [newImageUrl, setNewImageUrl] = useState<string>('');

  const handleAddImage = (): void => {
    const trimmed = newImageUrl.trim();
    try {
      new URL(trimmed);
      setImages(addUniqueItem(images, trimmed, (i) => i));
      setNewImageUrl('');
    } catch {
      notifications.show({
        title: 'Invalid URL',
        message: 'Enter a valid image URL',
        color: 'red',
      });
    }
  };

  const handleRemoveImage = (index: number): void => {
    setImages(images.filter((_, i) => i !== index));
  };

  return (
    <Box>
      <Text fw={500} mb="xs">
        Product Images
      </Text>
      <Group mb="sm">
        <TextInput
          placeholder="Image URL (https://...)"
          value={newImageUrl}
          onChange={(e) => setNewImageUrl(e.currentTarget.value)}
          style={{ flex: 1 }}
          leftSection={<IconLink size={16} />}
          onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddImage())}
        />
        <Button onClick={handleAddImage} leftSection={<IconPlus size={16} />}>
          Add Image
        </Button>
      </Group>
      {images.length > 0 ? (
        <Grid mt="xs">
          {images.map((url, i) => (
            <Grid.Col span={{ base: 6, sm: 4, md: 3 }} key={i}>
              <Card p="xs" withBorder>
                <Card.Section>
                  <Image
                    src={url}
                    height={120}
                    fallbackSrc="/placeholder-image.jpg"
                    alt={`Product image ${i + 1}`}
                  />
                </Card.Section>
                <Group justify="space-between" mt="xs">
                  <Text size="xs" lineClamp={1} style={{ maxWidth: 'calc(100% - 30px)' }}>
                    {url}
                  </Text>
                  <ActionIcon color="red" variant="subtle" onClick={() => handleRemoveImage(i)}>
                    <IconTrash size={16} />
                  </ActionIcon>
                </Group>
              </Card>
            </Grid.Col>
          ))}
        </Grid>
      ) : (
        <Text size="sm" c="dimmed">
          No images added yet
        </Text>
      )}
    </Box>
  );
}
