// lib/users/payments/hooks.ts
import { useMutation, useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { notifications } from '@mantine/notifications';

export function usePendingDelegateOrder(userId: string) {
  return useQuery({
    queryKey: ['pendingDelegateOrder', userId],
    queryFn: async () => {
      const res = await fetch(`/api/payments/pending-delegate?user_id=${userId}`);
      if (!res.ok) return null;
      return res.json();
    },
    staleTime: 0,
  });
}

export function useCreateDelegateOrder(userId: string) {
  const router = useRouter();

  return useMutation({
    mutationFn: async () => {
      const res = await fetch('/api/payments/delegate-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        if (errorData.existingOrderId) {
          router.push(`/orders/${errorData.existingOrderId}`);
          return;
        }
        throw new Error(errorData.error || 'Failed to create delegate order');
      }

      return res.json();
    },
    onSuccess: (data) => {
      notifications.show({
        title: 'Order Created',
        message: 'Your delegate fee order has been created',
        color: 'green',
      });
      router.push(`/orders/${data.id}`);
    },
    onError: (error: any) => {
      notifications.show({
        title: 'Error',
        message: error.message || 'Failed to create delegate order',
        color: 'red',
      });
      console.error('Delegate order creation error:', error);
    },
  });
}

export function useLatestPaymentRecord(userId: string, hasPayment: boolean) {
  return useQuery({
    queryKey: ['delegatePaymentRecord', userId],
    queryFn: async () => {
      if (!hasPayment) return null;
      const res = await fetch(`/api/payments/latest?user_id=${userId}`);
      if (!res.ok) throw new Error('Failed to fetch payment record');
      return res.json();
    },
    enabled: hasPayment,
  });
}
