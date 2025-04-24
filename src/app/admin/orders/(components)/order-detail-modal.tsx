import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import {
  Badge,
  Box,
  Button,
  Card,
  Divider,
  Flex,
  Grid,
  Group,
  Modal,
  Select,
  Stack,
  Text,
  Tooltip,
} from '@mantine/core';
import { Order, OrderItem, OrderStatus, StatusColorMap } from '@/lib/store/types';

interface OrderDetailModalProps {
  opened: boolean;
  onClose: () => void;
  order: Order | null;
  onUpdateStatus: (orderId: string, status: OrderStatus) => void;
  isUpdating: boolean;
}

const statusColorMap: StatusColorMap = {
  pending: 'orange',
  confirmed: 'blue',
  paid: 'teal',
  processing: 'indigo',
  shipped: 'cyan',
  delivered: 'green',
  cancelled: 'red',
};

// Helper to truncate long IDs with tooltips
const TruncatedId = ({ id, label }: { id: string; label?: string }) => (
  <Tooltip label={id} position="bottom" withArrow multiline>
    <Text size="sm" style={{ wordBreak: 'break-all' }}>
      {label && (
        <Text fw={500} span>
          {label}:{' '}
        </Text>
      )}
      {id.length > 12 ? `${id.substring(0, 8)}...` : id}
    </Text>
  </Tooltip>
);

const formatDate = (dateString?: string): string => {
  if (!dateString) {
    return 'N/A';
  }
  return new Date(dateString).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

export function OrderDetailModal({
  opened,
  onClose,
  order,
  onUpdateStatus,
  isUpdating,
}: OrderDetailModalProps) {
  const [newStatus, setNewStatus] = useState<OrderStatus | null>(null);

  useEffect(() => {
    if (order) {
      setNewStatus(null);
    }
  }, [order]);

  if (!order) {
    return <></>;
  }

  const orderItems: OrderItem[] = order.items || [];

  const handleUpdateStatus = () => {
    if (newStatus && order) {
      onUpdateStatus(order.id, newStatus);
      setNewStatus(null);
    }
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={
        <Text fw={700} size="lg">
          Order Details
        </Text>
      }
      size="lg"
      centered
    >
      <Stack gap="md">
        <Card withBorder padding="md">
          <Text fw={600} mb="md">
            Order Information
          </Text>

          <Stack gap="xs">
            {/* Order ID - full row */}
            <Box py={5} px="sm" bg="gray.0" style={{ borderRadius: 4 }}>
              <Text size="sm">
                <Text span fw={500}>
                  Order ID:{' '}
                </Text>
                {order.id}
              </Text>
            </Box>

            {/* User ID - full row */}
            <Box py={5} px="sm" bg="gray.0" style={{ borderRadius: 4 }}>
              <Text size="sm">
                <Text span fw={500}>
                  Full Name:{' '}
                </Text>
                {order.user_id}
              </Text>
            </Box>

            {/* Date and Status */}
            <Grid gutter="xs">
              <Grid.Col span={6}>
                <Box py={5} px="sm">
                  <Text size="sm">
                    <Text span fw={500}>
                      Date:{' '}
                    </Text>
                    {formatDate(order.created_at)}
                  </Text>
                </Box>
              </Grid.Col>

              <Grid.Col span={6}>
                <Box py={5} px="sm">
                  <Group gap="xs">
                    <Text size="sm" fw={500}>
                      Status:
                    </Text>
                    <Badge color={statusColorMap[order.status]}>{order.status.toUpperCase()}</Badge>
                  </Group>
                </Box>
              </Grid.Col>
            </Grid>

            {/* Total Amount */}
            <Box py={5} px="sm" bg="gray.0" style={{ borderRadius: 4 }}>
              <Group justify="space-between">
                <Text size="sm" fw={500}>
                  Total Amount:
                </Text>
                <Text fw={700} size="md">
                  {formatCurrency(order.total_amount)}
                </Text>
              </Group>
            </Box>

            {/* Last Status Change */}
            {order.last_status_change && (
              <Box py={5} px="sm">
                <Text size="sm">
                  <Text span fw={500}>
                    Last Status Change:{' '}
                  </Text>
                  {formatDate(order.last_status_change)}
                </Text>
              </Box>
            )}

            {/* Updated By */}
            {order.updated_by && (
              <Box py={5} px="sm" bg="gray.0" style={{ borderRadius: 4 }}>
                <TruncatedId id={order.updated_by} label="Updated By" />
              </Box>
            )}
          </Stack>

          <Divider my="lg" />

          {/* Status Update Section */}
          <Text fw={600} mb="md">
            Update Status
          </Text>

          <Flex gap="md">
            <Select
              placeholder="Select new status"
              data={Object.keys(statusColorMap).map((key) => ({
                value: key,
                label: key.charAt(0).toUpperCase() + key.slice(1),
              }))}
              value={newStatus}
              onChange={(value) => setNewStatus(value as OrderStatus)}
              style={{ flex: 1 }}
            />
            <Button
              onClick={handleUpdateStatus}
              disabled={!newStatus || newStatus === order.status}
              loading={isUpdating}
            >
              Update
            </Button>
          </Flex>
        </Card>

        {/* Order Items Section */}
        <Card withBorder padding="md">
          <Text fw={600} mb="md">
            Order Items ({orderItems.length})
          </Text>

          {orderItems.length === 0 ? (
            <Text c="dimmed">No items in this order</Text>
          ) : (
            <Stack gap="md">
              {orderItems.map((item) => (
                <Card key={item.id} withBorder>
                  <Grid gutter="md">
                    <Grid.Col span={{ base: 3, sm: 2 }}>
                      {item.image ? (
                        <Box
                          style={{ width: 60, height: 60, position: 'relative', margin: '0 auto' }}
                        >
                          <Image
                            src={item.image}
                            alt={item.name || 'Product image'}
                            fill
                            style={{ objectFit: 'cover', borderRadius: 4 }}
                          />
                        </Box>
                      ) : (
                        <Box
                          style={{
                            width: 60,
                            height: 60,
                            backgroundColor: '#f0f0f0',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderRadius: 4,
                            margin: '0 auto',
                          }}
                        >
                          <Text size="xs" c="dimmed">
                            No image
                          </Text>
                        </Box>
                      )}
                    </Grid.Col>

                    <Grid.Col span={{ base: 9, sm: 6 }}>
                      <Text fw={500}>{item.name || `Product ${item.item_code}`}</Text>
                      <Text size="sm" c="dimmed">
                        Code: {item.item_code}
                      </Text>
                      <Group mt={5} gap="xs">
                        {item.size && (
                          <Badge variant="outline" size="sm">
                            Size: {item.size}
                          </Badge>
                        )}
                        {item.color && (
                          <Badge
                            variant="outline"
                            size="sm"
                            leftSection={
                              item.color_hex && (
                                <div
                                  style={{
                                    width: 10,
                                    height: 10,
                                    borderRadius: '50%',
                                    backgroundColor: item.color_hex,
                                  }}
                                />
                              )
                            }
                          >
                            Color: {item.color}
                          </Badge>
                        )}
                      </Group>
                    </Grid.Col>

                    <Grid.Col span={{ base: 12, sm: 4 }}>
                      <Flex
                        justify={{ base: 'flex-start', sm: 'flex-end' }}
                        gap="md"
                        direction={{ base: 'row', sm: 'column' }}
                      >
                        <Text>
                          {formatCurrency(item.price)} × {item.quantity}
                        </Text>
                        <Text fw={700}>{formatCurrency(item.price * item.quantity)}</Text>
                      </Flex>
                      <Text fz={10} c="red">
                        {item.pre_price !== 0 && item.discount_perc !== 0
                          ? `Incl. Discount: ${item.discount_perc}%`
                          : null}
                      </Text>
                    </Grid.Col>
                  </Grid>
                </Card>
              ))}
            </Stack>
          )}

          <Divider my="lg" label="Summary" labelPosition="center" />

          <Card p="md" withBorder bg="gray.0">
            <Group justify="space-between">
              <Text fw={500}>Order Total</Text>
              <Text fw={700} size="lg">
                {formatCurrency(order.total_amount)}
              </Text>
            </Group>
          </Card>
        </Card>
      </Stack>
    </Modal>
  );
}
