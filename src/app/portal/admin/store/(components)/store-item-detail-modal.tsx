import Link from 'next/link';
import { Badge, Button, Flex, Group, Modal, Stack, Text } from '@mantine/core';
import { StoreItem } from '@/lib/store/types';

interface StoreItemDetailModalProps {
  opened: boolean;
  onClose: () => void;
  item: StoreItem | null;
}

export function StoreItemDetailModal({ opened, onClose, item }: StoreItemDetailModalProps) {
  if (!item) {
    return <></>;
  }

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={
        <Text fw={700} size="lg">
          Item Details
        </Text>
      }
      size="lg"
      centered
    >
      <Stack>
        <Group>
          <Text fw={600} size="sm" style={{ width: 120 }}>
            ID:
          </Text>
          <Text>{item.id}</Text>
        </Group>

        <Group>
          <Text fw={600} size="sm" style={{ width: 120 }}>
            Code:
          </Text>
          <Text>{item.item_code}</Text>
        </Group>

        <Group>
          <Text fw={600} size="sm" style={{ width: 120 }}>
            Name:
          </Text>
          <Text>{item.name}</Text>
        </Group>

        <Group>
          <Text fw={600} size="sm" style={{ width: 120 }}>
            Price:
          </Text>
          {item.pre_price !== 0 && item.discount_perc !== 0 ? (
            <>
              <Flex gap={8} align="center">
                <Text td="line-through" c="red">
                  ${item.pre_price?.toFixed(2)}
                </Text>
                <Text fw={700}>${item.price.toFixed(2)}</Text>
                <Badge variant="light" color="red">
                  -${item.discount_perc}%
                </Badge>
              </Flex>
            </>
          ) : (
            <Text>${item.price.toFixed(2)}</Text>
          )}
        </Group>

        <Group align="flex-start">
          <Text fw={600} size="sm" style={{ width: 120 }}>
            Description:
          </Text>
          <Text style={{ flex: 1 }}>{item.description}</Text>
        </Group>

        <Group>
          <Text fw={600} size="sm" style={{ width: 120 }}>
            Status:
          </Text>
          <Badge color={item.active ? 'green' : 'red'}>{item.active ? 'Active' : 'Inactive'}</Badge>
        </Group>

        <Group align="flex-start">
          <Text fw={600} size="sm" style={{ width: 120 }}>
            Sizes:
          </Text>
          <div>
            {item.sizes.length > 0 ? (
              <Group gap="xs">
                {item.sizes.map((size, index) => (
                  <Badge key={index} variant="outline">
                    {size}
                  </Badge>
                ))}
              </Group>
            ) : (
              <Text c="dimmed" size="sm">
                No sizes specified
              </Text>
            )}
          </div>
        </Group>

        <Group align="flex-start">
          <Text fw={600} size="sm" style={{ width: 120 }}>
            Colors:
          </Text>
          <div>
            {item.colors.length > 0 ? (
              <Group gap="xs">
                {item.colors.map((color, index) => (
                  <Badge
                    key={index}
                    variant="outline"
                    leftSection={
                      <div
                        style={{
                          width: 12,
                          height: 12,
                          borderRadius: '50%',
                          backgroundColor: color.hex,
                          border: '1px solid #e0e0e0',
                        }}
                      />
                    }
                  >
                    {color.name}
                  </Badge>
                ))}
              </Group>
            ) : (
              <Text c="dimmed" size="sm">
                No colors specified
              </Text>
            )}
          </div>
        </Group>

        <Group align="flex-start">
          <Text fw={600} size="sm" style={{ width: 120 }}>
            Images:
          </Text>
          <div>
            {item.images.length > 0 ? (
              <Group gap="xs">
                {item.images.map((_, index) => (
                  <Text key={index} size="sm">
                    Image {index + 1}
                  </Text>
                ))}
              </Group>
            ) : (
              <Text c="dimmed" size="sm">
                No images uploaded
              </Text>
            )}
          </div>
        </Group>

        <Group mt={20} justify="flex-end">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button component={Link} href={`/portal/admin/store/edit/${item.id}`} color="blue">
            Edit
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
}
