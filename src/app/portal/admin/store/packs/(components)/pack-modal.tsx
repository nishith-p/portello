import Link from 'next/link';
import { Badge, Button, Divider, Group, Modal, Stack, Table, Text } from '@mantine/core';
import { StorePack } from '@/lib/store/types';

interface PackDetailModalProps {
  opened: boolean;
  onClose: () => void;
  pack: StorePack | null;
}

export function PackDetailModal({ opened, onClose, pack }: PackDetailModalProps) {
  if (!pack) {
    return <></>;
  }

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={
        <Text fw={700} size="lg">
          Details
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
          <Text>{pack.id}</Text>
        </Group>

        <Group>
          <Text fw={600} size="sm" style={{ width: 120 }}>
            Code:
          </Text>
          <Text>{pack.pack_code}</Text>
        </Group>

        <Group>
          <Text fw={600} size="sm" style={{ width: 120 }}>
            Name:
          </Text>
          <Text>{pack.name}</Text>
        </Group>

        <Group>
          <Text fw={600} size="sm" style={{ width: 120 }}>
            Price:
          </Text>
          <Text>${pack.price.toFixed(2)}</Text>
        </Group>

        <Group align="flex-start">
          <Text fw={600} size="sm" style={{ width: 120 }}>
            Description:
          </Text>
          <Text style={{ flex: 1 }}>{pack.description}</Text>
        </Group>

        <Group>
          <Text fw={600} size="sm" style={{ width: 120 }}>
            Status:
          </Text>
          <Badge color={pack.active ? 'green' : 'red'}>{pack.active ? 'Active' : 'Inactive'}</Badge>
        </Group>

        <Group align="flex-start">
          <Text fw={600} size="sm" style={{ width: 120 }}>
            Images:
          </Text>
          <div>
            {pack.images.length > 0 ? (
              <Group gap="xs">
                {pack.images.map((_, index) => (
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

        <Divider my="sm" label="Pack Items" labelPosition="center" />

        {pack.pack_items && pack.pack_items.length > 0 ? (
          <Table striped>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Item</Table.Th>
                <Table.Th>Code</Table.Th>
                <Table.Th>Quantity</Table.Th>
                <Table.Th>Unit Price</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {pack.pack_items.map((packItem) => (
                <Table.Tr key={packItem.id}>
                  <Table.Td>{packItem.item?.name || 'Unknown Item'}</Table.Td>
                  <Table.Td>{packItem.item?.item_code || 'Unknown Code'}</Table.Td>
                  <Table.Td>{packItem.quantity}</Table.Td>
                  <Table.Td>${packItem.item?.price.toFixed(2) || '0.00'}</Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        ) : (
          <Text c="dimmed" ta="center">
            No items in this pack
          </Text>
        )}

        <Group mt={20} justify="flex-end">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button component={Link} href={`/portal/admin/store/packs/edit/${pack.id}`} color="blue">
            Edit
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
}
