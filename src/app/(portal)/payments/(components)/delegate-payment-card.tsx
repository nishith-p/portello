'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Badge, Button, Card, Group, List, Stack, Text } from '@mantine/core';
import {
  useCreateDelegateOrder,
  useLatestPaymentRecord,
  usePendingDelegateOrder,
} from '@/lib/users/payments/hooks';
import { User } from '@/lib/users/types';

interface DelegatePaymentFormProps {
  user: User;
}

export function DelegatePaymentCard({ user }: DelegatePaymentFormProps) {
  const router = useRouter();
  const paymentStatus = user.payment ? 'paid' : 'pending';

  // Check for existing pending delegate fee order
  const { data: pendingOrder, refetch: refetchPendingOrder } = usePendingDelegateOrder(
    user.kinde_id
  );

  const createDelegateOrder = useCreateDelegateOrder(user.kinde_id);
  const { data: paymentRecord } = useLatestPaymentRecord(user.kinde_id, !!user.payment);

  useEffect(() => {
    refetchPendingOrder();
  }, []);

  if (pendingOrder?.id && paymentStatus !== 'paid') {
    return (
      <Card withBorder p="lg">
        <Stack>
          <Badge color="yellow">PENDING</Badge>

          <Text>You have a pending delegate fee payment.</Text>
          <Button onClick={() => router.push(`/orders/${pendingOrder.id}`)}>
            Complete Payment
          </Button>
        </Stack>
      </Card>
    );
  }

  return (
    <Card withBorder p="lg">
      <Stack>
        <Badge color={paymentStatus === 'paid' ? 'green' : 'yellow'}>
          {paymentStatus.toUpperCase()}
        </Badge>
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
            <List ml="xl">
              <List.Item>
                <Group>
                  <Text>MCP Elect =</Text>
                  <Text fw={700}>€630</Text>
                </Group>
              </List.Item>
              <List.Item>
                <Group>
                  <Text>MCP Current / MCVP Current / MCVP Elect / LCP / Other =</Text>
                  <Text fw={700}>€560</Text>
                </Group>
              </List.Item>
            </List>
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
