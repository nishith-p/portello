import { Group, Modal, Stack, Table, Text } from '@mantine/core';
import { ItemSizeColorQuantity, ItemWithQuantity } from '@/lib/store/types';

export function ItemVariationsModal({
  item,
  opened,
  onClose,
}: {
  item: ItemWithQuantity | null;
  opened: boolean;
  onClose: () => void;
}) {
  if (!item) {
    return null;
  }

  if (!item.variations || item.variations.length === 0) {
    return (
      <Modal opened={opened} onClose={onClose} size="lg" withCloseButton={false} centered>
        <Text c="dimmed">No variations available.</Text>
      </Modal>
    );
  }

  const getColorKey = (variation: ItemSizeColorQuantity): string => {
    return variation.color || 'No Color';
  };

  const colorGroups = new Map<string, ItemSizeColorQuantity[]>();

  item.variations.forEach((variation) => {
    const colorKey = getColorKey(variation);
    const group = colorGroups.get(colorKey) || [];
    group.push(variation);
    colorGroups.set(colorKey, group);
  });

  const sortedColors = Array.from(colorGroups.keys()).sort((a, b) => {
    if (a === 'No Color') {
      return 1;
    }
    if (b === 'No Color') {
      return -1;
    }
    return a.localeCompare(b);
  });

  const sizeOrder = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'];

  return (
    <Modal opened={opened} onClose={onClose} size="lg" withCloseButton={false} centered>
      <Stack gap="sm">
        {sortedColors.map((color) => {
          const variations = colorGroups.get(color) || [];
          const hasSizes = variations.some((v) => v.size);
          const sizeGroups: Record<string, number> = {};

          if (hasSizes) {
            variations.forEach((v) => {
              const sizeKey = v.size || 'Default';
              sizeGroups[sizeKey] = (sizeGroups[sizeKey] || 0) + v.quantity;
            });
          }

          const sortedSizes = Object.keys(sizeGroups).sort((a, b) => {
            if (a === 'Default') {
              return -1;
            }
            if (b === 'Default') {
              return 1;
            }
            return sizeOrder.indexOf(a) - sizeOrder.indexOf(b);
          });

          return (
            <div key={color}>
              <Text fw={500} mb="xs" component="div">
                {color === 'No Color' ? (
                  'Standard'
                ) : (
                  <Group gap="xs">
                    {variations[0]?.color_hex && (
                      <div
                        style={{
                          width: 16,
                          height: 16,
                          backgroundColor: variations[0].color_hex,
                          borderRadius: '50%',
                          border: '1px solid black',
                        }}
                      />
                    )}
                    {color}
                  </Group>
                )}
              </Text>
              <Table>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>Size</Table.Th>
                    <Table.Th>Quantity</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {hasSizes ? (
                    sortedSizes.map((size) => (
                      <Table.Tr key={`${color}-${size}`}>
                        <Table.Td>{size}</Table.Td>
                        <Table.Td>{sizeGroups[size]}</Table.Td>
                      </Table.Tr>
                    ))
                  ) : (
                    <Table.Tr>
                      <Table.Td>Default</Table.Td>
                      <Table.Td>{variations.reduce((sum, v) => sum + v.quantity, 0)}</Table.Td>
                    </Table.Tr>
                  )}
                </Table.Tbody>
              </Table>
            </div>
          );
        })}
      </Stack>
    </Modal>
  );
}
