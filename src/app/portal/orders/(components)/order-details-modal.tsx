'use client';

import React from 'react';
import Image from 'next/image';
import {
  Badge,
  Box,
  Card,
  Divider,
  Flex,
  Grid,
  Group,
  Modal,
  Stack,
  Text,
  Tooltip,
} from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { Order, OrderItem, OrderStatus } from '@/lib/store/types';
import { formatCurrency, formatDate } from '@/lib/utils';

interface OrderDetailsModalProps {
  opened: boolean;
  onCloseAction: () => void;
  order: Order | null;
}

const statusColorMap: Record<OrderStatus, string> = {
  pending: 'orange',
  confirmed: 'blue',
  paid: 'teal',
  processing: 'indigo',
  shipped: 'cyan',
  delivered: 'green',
  cancelled: 'red',
};

export function OrderDetailsModal({ opened, onCloseAction, order }: OrderDetailsModalProps) {
  const isMobile = useMediaQuery('(max-width: 768px)');
  if (!order) {
    return <></>;
  }

  const orderItems: OrderItem[] = order.items || [];

  return (
    <Modal
      opened={opened}
      onClose={onCloseAction}
      title={
        <Text fw={700} size="lg">
          Order Details
        </Text>
      }
      size={isMobile ? '95%' : 'lg'}
      centered
    >
      <Stack gap="md">
        <Card withBorder padding="md">
          <Text fw={600} mb="md">
            Order Information
          </Text>

          <Stack gap="xs">
            <Box py={5} px="sm" bg="gray.0" style={{ borderRadius: 4 }}>
              <Tooltip label="Click to copy" position="right">
                <Text
                  size="sm"
                  style={{ cursor: 'pointer' }}
                  onClick={async () => {
                    await navigator.clipboard.writeText(order.id);
                  }}
                >
                  <Text span fw={500}>
                    Order ID:{' '}
                  </Text>
                  {order.id}
                </Text>
              </Tooltip>
            </Box>

            {/* Date and Status */}
            <Grid gutter="xs">
              <Grid.Col span={isMobile ? 12 : 6}>
                <Box py={5} px="sm">
                  <Text size="sm">
                    <Text span fw={500}>
                      Date:{' '}
                    </Text>
                    {formatDate(order.created_at)}
                  </Text>
                </Box>
              </Grid.Col>

              <Grid.Col span={isMobile ? 12 : 6}>
                <Box py={5} px="sm">
                  <Group gap="xs">
                    <Text size="sm" fw={500}>
                      Status:
                    </Text>
                    <Badge color={statusColorMap[order.status]} variant="light">
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </Badge>
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
          </Stack>
        </Card>

        {/* Order Items */}
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
                  <Grid gutter="md" align="center">
                    <Grid.Col span={{ base: 12, sm: 2 }}>
                      {item.image ? (
                        <Box
                          style={{
                            width: 60,
                            height: 60,
                            position: 'relative',
                            margin: isMobile ? '0 auto 8px' : '0 auto',
                          }}
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
                            margin: isMobile ? '0 auto 8px' : '0 auto',
                          }}
                        >
                          <Text size="xs" c="dimmed">
                            No image
                          </Text>
                        </Box>
                      )}
                    </Grid.Col>

                    <Grid.Col span={{ base: 12, sm: 6 }}>
                      <Text fw={500}>{item.name || `Product ${item.item_code}`}</Text>
                      <Text size="sm" c="dimmed">
                        Code: {item.item_code}
                      </Text>
                      <Group mt={5} gap="xs" wrap="wrap">
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
                        justify={isMobile ? 'space-between' : 'flex-end'}
                        align={isMobile ? 'center' : 'flex-end'}
                        direction={isMobile ? 'row' : 'column'}
                        wrap="wrap"
                        gap="sm"
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
