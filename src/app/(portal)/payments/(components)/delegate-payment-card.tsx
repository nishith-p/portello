// (portal)/payments/(components)/delegate-payment-card.tsx
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Badge, Button, Card, Group, Stack, Text } from '@mantine/core';
import { User } from '@/lib/users/types';
import {
  useCreateDelegateOrder,
  useLatestPaymentRecord,
  usePendingDelegateOrder,
} from '@/lib/users/payments/hooks';

interface DelegatePaymentFormProps {
  user: User;
}

export function DelegatePaymentCard({ user }: DelegatePaymentFormProps) {
  const router = useRouter();
  const paymentStatus = user.payment ? 'paid' : 'pending';

  // Check for existing pending delegate fee order
  const {
    data: pendingOrder,
    refetch: refetchPendingOrder,
  } = usePendingDelegateOrder(user.kinde_id);

  const createDelegateOrder = useCreateDelegateOrder(user.kinde_id);
  const { data: paymentRecord } = useLatestPaymentRecord(user.kinde_id, !!user.payment);

  useEffect(() => {
    refetchPendingOrder();
  }, []);

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
          <Button onClick={() => router.push(`/orders/${pendingOrder.id}`)}>Complete Payment</Button>
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
