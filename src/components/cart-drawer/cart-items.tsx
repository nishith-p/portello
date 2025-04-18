'use client';

import { IconMinus, IconPlus, IconTrash } from '@tabler/icons-react';
import { ActionIcon, Badge, Box, Collapse, Flex, Group, Image, Stack, Text } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useCart } from '@/context/cart';
import { CartPackItem } from '@/lib/store/types';
import { formatCurrency } from '@/lib/utils';

interface CartPackItemProps {
  item: CartPackItem;
  index: number;
}

export function CartPackItemComponent({ item, index }: CartPackItemProps) {
  const { removeFromCart, updateQuantity } = useCart();
  const [detailsOpened, { toggle: toggleDetails }] = useDisclosure(false);

  const itemId = `pack_item_${index}`;

  return (
    <Box
      p="sm"
      style={{
        borderBottom: '1px solid var(--mantine-color-gray-2)',
      }}
    >
      <Flex justify="space-between" align="flex-start" gap="md">
        {item.image && (
          <Box
            w={70}
            h={70}
            style={{
              overflow: 'hidden',
              borderRadius: 'var(--mantine-radius-sm)',
              border: '1px solid var(--mantine-color-gray-3)',
            }}
          >
            <Image src={item.image} alt={item.name} fit="cover" h={70} w={70} />
          </Box>
        )}

        <Box style={{ flex: 1 }}>
          <Flex justify="space-between" align="center" mb="xs">
            <Group gap="xs">
              <Text fw={500}>{item.name}</Text>
              <Badge color="blue">Pack</Badge>
            </Group>
            <ActionIcon
              variant="subtle"
              color="red"
              onClick={() => removeFromCart(itemId)}
              aria-label="Remove pack"
            >
              <IconTrash size={16} />
            </ActionIcon>
          </Flex>

          <Text size="xs" c="dimmed" mb="xs">
            Pack ID: {item.pack_code}
          </Text>

          <Text size="sm" style={{ cursor: 'pointer' }} onClick={toggleDetails} c="blue" mb="xs">
            {detailsOpened ? 'Hide details' : `Show details (${item.pack_items.length} items)`}
          </Text>

          <Collapse in={detailsOpened}>
            <Stack gap="xs" mt="xs" mb="md" pl="xs">
              {item.pack_items.map((packItem, idx) => (
                <Group
                  key={`${item.id}_detail_${idx}`}
                  justify="space-between"
                  wrap="nowrap"
                  gap="xs"
                >
                  <Text size="xs" lineClamp={1} style={{ flex: 1 }}>
                    {packItem.quantity}x {packItem.name}
                  </Text>
                  <Group gap={4} wrap="nowrap">
                    {packItem.size && (
                      <Badge size="xs" variant="outline">
                        {packItem.size}
                      </Badge>
                    )}
                    {packItem.color && (
                      <Badge
                        size="xs"
                        variant="outline"
                        leftSection={
                          packItem.colorHex ? (
                            <div
                              style={{
                                width: 8,
                                height: 8,
                                borderRadius: '50%',
                                backgroundColor: packItem.colorHex,
                                border: '1px solid rgba(0, 0, 0, 0.1)',
                              }}
                            />
                          ) : null
                        }
                      >
                        {packItem.color}
                      </Badge>
                    )}
                  </Group>
                </Group>
              ))}
            </Stack>
          </Collapse>

          <Flex justify="space-between" align="center">
            <Flex gap="xs" align="center">
              <ActionIcon
                size="sm"
                variant="subtle"
                onClick={() => updateQuantity(itemId, item.quantity - 1)}
                disabled={item.quantity <= 1}
                aria-label="Decrease quantity"
              >
                <IconMinus size={14} />
              </ActionIcon>

              <Text size="sm">{item.quantity}</Text>

              <ActionIcon
                size="sm"
                variant="subtle"
                onClick={() => updateQuantity(itemId, item.quantity + 1)}
                aria-label="Increase quantity"
              >
                <IconPlus size={14} />
              </ActionIcon>
            </Flex>

            <Text fw={500}>{formatCurrency(item.price * item.quantity)}</Text>
          </Flex>
        </Box>
      </Flex>
    </Box>
  );
}
