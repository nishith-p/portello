// (portal)/payments/(components)/delegate-payment-card.tsx
'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Badge, Button, Card, Group, Stack, Text } from '@mantine/core';
import { User } from '@/lib/users/types';
import { PaymentForm } from './payment-form';

interface DelegatePaymentFormProps {
  user: User;
}

export function DelegatePaymentCard({ user }: DelegatePaymentFormProps) {
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const amount = ['MCPc', 'MCPe'].includes(user.position) ? 100 : 70;

  // Check payment status from user.payment
  const paymentStatus = user.payment ? 'paid' : 'pending';

  const handleCompletePayment = () => {
    setShowPaymentForm(true);
  };

  const { data: paymentRecord } = useQuery({
    queryKey: ['delegatePaymentRecord', user.kinde_id],
    queryFn: async () => {
      if (!user.payment) return null;

      const res = await fetch(`/api/payments/latest?user_id=${user.kinde_id}`);
      if (!res.ok) throw new Error('Failed to fetch payment record');
      return res.json();
    },
  });

  if (showPaymentForm) {
    return (
      <PaymentForm
        currency="EUR"
        customer={{
          first_name: user.first_name,
          last_name: user.last_name,
          aiesec_email: user.aiesec_email,
          position: user.position,
        }}
      />
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

        <Text size="lg" fw={500}>
          Amount: €{amount.toFixed(2)}
        </Text>
        <Text c="dimmed">
          {['MCPc', 'MCPe'].includes(user.position)
            ? 'As an MCP, your delegate fee is €100'
            : 'Standard delegate fee is €70'}
        </Text>

        {paymentStatus === 'pending' ? (
          <Button onClick={handleCompletePayment}>Complete Payment</Button>
        ) : (
          <>
            {user.payment && (
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
            )}
          </>
        )}
      </Stack>
    </Card>
  );
}
