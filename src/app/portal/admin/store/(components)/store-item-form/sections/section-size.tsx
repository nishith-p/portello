import { useState } from 'react';
import { IconPlus, IconTrash } from '@tabler/icons-react';
import {
  ActionIcon,
  Badge,
  Box,
  Button,
  Flex,
  Group,
  Select,
  Text,
  TextInput,
} from '@mantine/core';
import { addUniqueItem } from '../unique-item';

// Size templates
const SIZE_TEMPLATES = [
  { name: 'Clothing (XS-XXL)', sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'] },
  {
    name: 'Numeric (38-48)',
    sizes: ['38', '39', '40', '41', '42', '43', '44', '45', '46', '47', '48'],
  },
  { name: 'General', sizes: ['Small', 'Medium', 'Large'] },
  { name: 'Kids Age', sizes: ['0-3m', '3-6m', '6-12m', '1-2y', '2-3y', '3-4y', '4-5y'] },
];

interface SizesSectionProps {
  sizes: string[];
  setSizes: (sizes: string[]) => void;
}

export function SizesSection({ sizes, setSizes }: SizesSectionProps) {
  const [newSize, setNewSize] = useState<string>('');
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);

  const handleAddSize = (): void => {
    const trimmed = newSize.trim();
    if (!trimmed) {
      return;
    }
    setSizes(addUniqueItem(sizes, trimmed, (i) => i));
    setNewSize('');
  };

  const handleRemoveSize = (size: string): void => {
    setSizes(sizes.filter((s) => s !== size));
  };

  const handleApplySizeTemplate = (name: string | null): void => {
    const template = SIZE_TEMPLATES.find((t) => t.name === name);
    if (template) {
      setSizes(template.sizes);
    }
    setSelectedTemplate(name);
  };

  return (
    <Box>
      <Text fw={500} mb="xs">
        Sizes
      </Text>
      <Select
        label="Use a size template"
        placeholder="Select template"
        data={SIZE_TEMPLATES.map((t) => t.name)}
        value={selectedTemplate}
        onChange={handleApplySizeTemplate}
        clearable
        mb="sm"
      />
      <Group mb="sm">
        <TextInput
          placeholder="Add a size"
          value={newSize}
          onChange={(e) => setNewSize(e.currentTarget.value)}
          style={{ flex: 1 }}
          onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSize())}
        />
        <Button onClick={handleAddSize} leftSection={<IconPlus size={16} />}>
          Add Size
        </Button>
      </Group>
      {sizes.length > 0 ? (
        <Flex gap="sm" wrap="wrap">
          {sizes.map((s, i) => (
            <Badge
              key={i}
              variant="outline"
              rightSection={
                <ActionIcon
                  size="xs"
                  color="red"
                  variant="transparent"
                  onClick={() => handleRemoveSize(s)}
                >
                  <IconTrash size={12} />
                </ActionIcon>
              }
            >
              {s}
            </Badge>
          ))}
        </Flex>
      ) : (
        <Text size="sm" c="dimmed">
          No sizes added yet
        </Text>
      )}
    </Box>
  );
}
