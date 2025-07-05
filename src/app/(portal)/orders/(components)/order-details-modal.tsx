// (portal)/orders/(components)/order-details-modal.tsx
'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
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
  Stack,
  Text,
  Tooltip,
} from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { Order, OrderItem, OrderStatus } from '@/lib/store/types';
import { formatCurrency, formatDate } from '@/lib/utils';
import { notifications } from '@mantine/notifications';
import { useCreditPayment, useWallet } from '@/lib/wallet/hooks';

interface OrderDetailsModalProps {
  opened: boolean;
  onCloseAction: () => void;
  order: Order | null;
}

const statusColorMap: Record<OrderStatus, string> = {
  pending: 'orange',
  confirmed: 'blue',
  paid: 'teal',
  'paid with credit': 'teal',
  processing: 'indigo',
  shipped: 'cyan',
  delivered: 'green',
  cancelled: 'red',
  'payment pending': 'orange',
  'payment cancelled': 'red',
  'payment failed': 'red',
  'charged back': 'purple',
  failed: 'red',
};

export function OrderDetailsModal({ opened, onCloseAction, order }: OrderDetailsModalProps) {
  const isMobile = useMediaQuery('(max-width: 768px)');
  const router = useRouter();
  const { processCreditPayment } = useCreditPayment();
  const { walletData, refetch: refetchWallet } = useWallet();
  const [localLoading, setLocalLoading] = useState(false);

  const handlePayNow = (orderData: Order) => {
    router.push(`/orders/${orderData.id}`);
  };

  const handleCreditPay = async (orderData: Order) => {
    if (!walletData?.wallet) {
      notifications.show({
        title: 'Error',
        message: 'Unable to fetch wallet information',
        color: 'red',
      });
      return;
    }

    const userCredit = walletData.wallet.credit;
    const orderAmount = orderData.total_amount*1000;

    // Check if user has sufficient credit (1 euro = 1 credit)
    if (userCredit < orderAmount) {
      notifications.show({
        title: 'Insufficient Credit',
        message: `You need ${orderAmount.toFixed(2)} credits but only have ${userCredit.toFixed(2)} credits available.`,
        color: 'orange',
      });
      return;
    }

    try {
      setLocalLoading(true);
      
      const result = await processCreditPayment(orderData.id, orderAmount);

      if (result.success) {
        notifications.show({
          title: 'Payment Success',
          message: 'Your order has been paid successfully using credits!',
          color: 'green',
        });

        // Refresh wallet data to show updated balance
        refetchWallet();
        
        // Close modal and potentially refresh orders
        onCloseAction();
        
        // Optionally redirect or refresh the page
        setTimeout(() => {
          window.location.reload(); // Or use a more sophisticated state update
        }, 1000);
      } else {
        notifications.show({
          title: 'Payment Failed',
          message: result.error || 'Failed to process credit payment',
          color: 'red',
        });
      }
    } catch (error) {
      notifications.show({
        title: 'Payment Error',
        message: 'An unexpected error occurred while processing payment',
        color: 'red',
      });
    } finally {
      setLocalLoading(false);
    }
  };

  const isDelegateFeeOrder = order?.items?.some((item) => item.item_code === 'DELEGATE_FEE');

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
          {isDelegateFeeOrder ? 'Delegate Fee Payment' : 'Order Details'}
        </Text>
      }
      size={isMobile ? '95%' : 'lg'}
      centered
    >
      <Stack gap="md">
        <Card withBorder padding="md">
          <Text fw={600} mb="md">
            {isDelegateFeeOrder ? 'Payment Information' : 'Order Information'}
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
                    {isDelegateFeeOrder ? 'Payment ID:' : 'Order ID:'}
                  </Text>
                  {order.id}
                </Text>
              </Tooltip>
            </Box>

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

        <Card withBorder padding="md">
          <Text fw={600} mb="md">
            {isDelegateFeeOrder ? 'Payment Details' : `Order Items (${orderItems.length})`}
          </Text>

          {orderItems.length === 0 ? (
            <Text c="dimmed">No items in this order</Text>
          ) : (
            <Stack gap="md">
              {orderItems.map((item) => (
                <Card key={item.id} withBorder>
                  <Grid gutter="md" align="center">
                    <Grid.Col span={{ base: 3, sm: 2 }}>
                      {item.image ? (
                        <Box
                          style={{
                            width: 60,
                            height: 60,
                            position: 'relative',
                            margin: '0 auto',
                            borderRadius: '50%',
                            overflow: 'hidden',
                          }}
                        >
                          <Image
                            src={item.image}
                            alt={item.name || 'Product image'}
                            fill
                            sizes='md'
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
                      <Text fw={500}>{item.name || `Item ${item.item_code}`}</Text>
                      <Group gap="xs">
                        {item.size && (
                          <Badge size="sm" variant="outline">
                            Size: {item.size}
                          </Badge>
                        )}
                        {item.color && (
                          <Badge
                            size="sm"
                            variant="outline"
                            leftSection={
                              item.color_hex ? (
                                <div
                                  style={{
                                    width: 10,
                                    height: 10,
                                    borderRadius: '50%',
                                    backgroundColor: item.color_hex,
                                    border: '1px solid rgba(0, 0, 0, 0.1)',
                                  }}
                                />
                              ) : null
                            }
                          >
                            {item.color}
                          </Badge>
                        )}
                      </Group>

                      {item.item_code === 'DELEGATE_FEE' && item.description && (
                        <Text size="sm" c="dimmed">
                          {item.description}
                        </Text>
                      )}
                    </Grid.Col>
                    <Grid.Col span={{ base: 12, sm: 4 }}>
                      <Flex justify={isMobile ? 'space-between' : 'flex-end'} align="center" gap='xs'>
                        <Text>
                          {formatCurrency(item.price)} × {item.quantity}
                        </Text>
                        <Text fw={700}>{formatCurrency(item.price * item.quantity)}</Text>
                      </Flex>
                    </Grid.Col>
                  </Grid>
                </Card>
              ))}
            </Stack>
          )}

          <Divider my="lg" label="Summary" labelPosition="center" />

          <Card p="md" withBorder bg="gray.0">
            <Group justify="space-between">
              <Text fw={500}>{isDelegateFeeOrder ? 'Payment Total' : 'Order Total'}</Text>
              <Text fw={700} size="lg">
                {formatCurrency(order.total_amount)}
              </Text>
            </Group>
          </Card>

          {order.status !== 'paid' && order.status !== 'paid with credit' && (
            <Group>
              <Button color="green" size="md" mt="md" fullWidth onClick={() => handlePayNow(order)}>
                {isDelegateFeeOrder ? 'Pay Delegate Fee' : 'Checkout with Payhere'}
              </Button>
              <Button
                color="green"
                variant="outline"
                size="md"
                fullWidth
                onClick={() => handleCreditPay(order)}
              >
                Checkout with Credit (Credits {order.total_amount*1000})
              </Button>
            </Group>
          )}
        </Card>
      </Stack>
    </Modal>
  );
}
