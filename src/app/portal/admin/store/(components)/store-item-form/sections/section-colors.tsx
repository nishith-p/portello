import { useState } from 'react';
import { IconPlus, IconTrash } from '@tabler/icons-react';
import {
  ActionIcon,
  Badge,
  Box,
  Button,
  ColorInput,
  Flex,
  Group,
  Text,
  TextInput,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { StoreItemColor } from '@/lib/store/types';
import { addUniqueItem } from '../unique-item';

interface ColorsSectionProps {
  colors: StoreItemColor[];
  setColors: (colors: StoreItemColor[]) => void;
}

export function ColorsSection({ colors, setColors }: ColorsSectionProps) {
  const [newColorName, setNewColorName] = useState<string>('');
  const [newColorHex, setNewColorHex] = useState<string>('#000000');

  const handleAddColor = () => {
    const name = newColorName.trim();
    if (!name) {
      return notifications.show({
        title: 'Missing Color Name',
        message: 'Enter a color name',
        color: 'orange',
      });
    }
    const newColor = { name, hex: newColorHex };
    setColors(addUniqueItem(colors, newColor, (c) => c.name));
    setNewColorName('');
    setNewColorHex('#000000');
  };

  const handleRemoveColor = (index: number): void => {
    setColors(colors.filter((_, i) => i !== index));
  };

  return (
    <Box>
      <Text fw={500} mb="xs">
        Colors
      </Text>
      <Group mb="sm">
        <TextInput
          placeholder="Color name"
          value={newColorName}
          onChange={(e) => setNewColorName(e.currentTarget.value)}
          style={{ flex: 1 }}
        />
        <ColorInput
          placeholder="Pick color"
          value={newColorHex}
          onChange={setNewColorHex}
          format="hex"
          swatches={[
            '#25262b',
            '#868e96',
            '#fa5252',
            '#e64980',
            '#be4bdb',
            '#7950f2',
            '#4c6ef5',
            '#228be6',
            '#15aabf',
            '#12b886',
            '#40c057',
            '#82c91e',
            '#fab005',
            '#fd7e14',
          ]}
        />
        <Button onClick={handleAddColor} leftSection={<IconPlus size={16} />}>
          Add Color
        </Button>
      </Group>
      {colors.length > 0 ? (
        <Flex gap="sm" wrap="wrap">
          {colors.map((color, i) => (
            <Badge
              key={i}
              variant="outline"
              leftSection={
                <Box
                  w={12}
                  h={12}
                  style={{
                    borderRadius: '50%',
                    backgroundColor: color.hex,
                    border: '1px solid #e0e0e0',
                  }}
                />
              }
              rightSection={
                <ActionIcon
                  size="xs"
                  color="red"
                  variant="transparent"
                  onClick={() => handleRemoveColor(i)}
                >
                  <IconTrash size={12} />
                </ActionIcon>
              }
            >
              {color.name}
            </Badge>
          ))}
        </Flex>
      ) : (
        <Text size="sm" c="dimmed">
          No colors added yet
        </Text>
      )}
    </Box>
  );
}
