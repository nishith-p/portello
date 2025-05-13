// (portal)/payments/(components)/delegate-payment-card.tsx
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Badge, Button, Card, Group, Stack, Text } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { User } from '@/lib/users/types';

interface DelegatePaymentFormProps {
  user: User;
}

export function DelegatePaymentCard({ user }: DelegatePaymentFormProps) {
  const router = useRouter();
  const paymentStatus = user.payment ? 'paid' : 'pending';

  // Check for existing pending delegate fee order
  const { data: pendingOrder, refetch: refetchPendingOrder } = useQuery({
    queryKey: ['pendingDelegateOrder', user.kinde_id],
    queryFn: async () => {
      const res = await fetch(`/api/payments/pending-delegate?user_id=${user.kinde_id}`);
      if (!res.ok) return null;
      return res.json();
    },
    staleTime: 0, // Optional: Ensures it's always considered stale
  });

  useEffect(() => {
    refetchPendingOrder();
  }, []);

  const createDelegateOrder = useMutation({
    mutationFn: async () => {
      const response = await fetch('/api/payments/delegate-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user_id: user.kinde_id }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        // If we have an existing order ID, redirect to it
        if (errorData.existingOrderId) {
          router.push(`/orders/${errorData.existingOrderId}`);
          return;
        }
        throw new Error(errorData.error || 'Failed to create delegate order');
      }
      return response.json();
    },
    onSuccess: (data) => {
      notifications.show({
        title: 'Order Created',
        message: 'Your delegate fee order has been created',
        color: 'green',
      });
      router.push(`/orders/${data.id}`);
    },
    onError: (error) => {
      notifications.show({
        title: 'Error',
        message: error.message || 'Failed to create delegate order',
        color: 'red',
      });
      console.error('Delegate order creation error:', error);
    },
  });

  const { data: paymentRecord } = useQuery({
    queryKey: ['delegatePaymentRecord', user.kinde_id],
    queryFn: async () => {
      if (!user.payment) return null;
      const res = await fetch(`/api/payments/latest?user_id=${user.kinde_id}`);
      if (!res.ok) throw new Error('Failed to fetch payment record');
      return res.json();
    },
  });

  // If user has a pending order, show View Order button
  if (pendingOrder?.id && paymentStatus !== 'paid') {
    return (
      <Card withBorder p="lg">
        <Stack>
          <Group justify="space-between">
            <Text size="lg" fw={500}>
              Delegate Fee Payment
            </Text>
            <Badge color="yellow">PENDING</Badge>
          </Group>
          <Text>You have a pending delegate fee payment.</Text>
          <Button onClick={() => router.push(`/orders/${pendingOrder.id}`)}>View Order</Button>
        </Stack>
      </Card>
    );
  }

  return (
    <Card withBorder p="lg">
      <Stack>
        <Group justify="space-between">
          <Text size="lg" fw={500}>
            Delegate Fee Payment
          </Text>
          <Badge color={paymentStatus === 'paid' ? 'green' : 'yellow'}>
            {paymentStatus.toUpperCase()}
          </Badge>
        </Group>

        {paymentStatus === 'paid' ? (
          <>
            <Text c="green">Your payment has been successfully processed.</Text>
            <Text size="sm" c="dimmed">
              Transaction ID: {user.payment}
            </Text>
            {paymentRecord && (
              <Text size="sm" c="dimmed">
                Paid on: {new Date(paymentRecord.created_at).toLocaleDateString()}
              </Text>
            )}
          </>
        ) : (
          <>
            <Text>Complete your delegate fee payment to finish registration.</Text>
            <Button
              onClick={() => createDelegateOrder.mutate()}
              loading={createDelegateOrder.isPending}
              disabled={createDelegateOrder.isPending}
            >
              Complete Payment
            </Button>
          </>
        )}
      </Stack>
    </Card>
  );
}
