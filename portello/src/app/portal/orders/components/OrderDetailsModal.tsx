import { Badge, Box, Divider, Group, Modal, ScrollArea, Stack, Text } from '@mantine/core';
import { Order } from '../types';
import { formatDate, getStatusColor } from '../utils/orderUtils';
import { OrderItemCard } from './OrderItemCard';

interface OrderDetailsModalProps {
  order: Order | null;
  opened: boolean;
  onClose: () => void;
}

export const OrderDetailsModal = ({
  order,
  opened,
  onClose,
}: OrderDetailsModalProps): JSX.Element => (
  <Modal
    opened={opened}
    onClose={onClose}
    title="Order Details"
    size="lg"
    padding="lg"
    centered
    overlayProps={{
      backgroundOpacity: 0.55,
      blur: 3,
    }}
    styles={{
      body: {
        maxHeight: '80vh',
        display: 'flex',
        flexDirection: 'column',
      },
      content: {
        display: 'flex',
        flexDirection: 'column',
      },
    }}
  >
    {order && (
      <>
        <Box mb="md">
          <Group justify="space-between" mb="xs">
            <Text size="sm" c="dimmed">
              Order ID
            </Text>
            <Text size="sm">{order.id}</Text>
          </Group>
          <Group justify="space-between" mb="xs">
            <Text size="sm" c="dimmed">
              Date
            </Text>
            <Text size="sm">{formatDate(order.created_at)}</Text>
          </Group>
          <Group justify="space-between" mb="xs">
            <Text size="sm" c="dimmed">
              Status
            </Text>
            <Badge color={getStatusColor(order.status)} variant="light">
              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
            </Badge>
          </Group>
          <Group justify="space-between" mb="xs">
            <Text size="sm" c="dimmed">
              Total
            </Text>
            <Text size="sm" fw={700}>
              ${order.total_amount.toFixed(2)}
            </Text>
          </Group>
        </Box>

        <Divider my="md" label="Order Items" labelPosition="center" />

        <ScrollArea.Autosize mah={400} type="always">
          <Stack gap="md">
            {order.order_items.map((item) => (
              <OrderItemCard key={item.id} item={item} />
            ))}
          </Stack>
        </ScrollArea.Autosize>
      </>
    )}
  </Modal>
);
