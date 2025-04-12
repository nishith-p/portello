'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { notifications } from '@mantine/notifications';
import { CartItem } from '@/context'; // Import CartItem from your context
import { Order } from '@/types/store';

interface PlaceOrderInput {
  items: CartItem[];
  total_amount: number;
}

/**
 * Hook for order-related operations
 */
export function useOrders() {
  const queryClient = useQueryClient();

  // Fetch user's orders
  const {
    data: orders,
    isLoading,
    error,
    refetch,
  } = useQuery<Order[]>({
    queryKey: ['orders', 'my'],
    queryFn: async () => {
      const response = await fetch('/api/store/orders/my');
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Failed to fetch orders');
      }
      return response.json();
    },
  });

  // Fetch a specific order
  const fetchOrder = async (orderId: string): Promise<Order> => {
    const response = await fetch(`/api/store/orders/${orderId}`);
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Failed to fetch order details');
    }
    return response.json();
  };

  // Place a new order
  const placeOrderMutation = useMutation<Order, Error, PlaceOrderInput>({
    mutationFn: async (orderData: PlaceOrderInput) => {
      // Map cart items to order items
      const orderItems = orderData.items.map((item) => ({
        // Use item_code if available, otherwise fall back to id
        // This ensures we're using the correct item_code that matches the store_items table
        item_code: item.item_code || item.id,
        quantity: item.quantity,
        price: item.price,
        size: item.size,
        color: item.color,
        color_hex: item.colorHex,
        name: item.name,
        image: item.image,
      }));

      const payload = {
        items: orderItems,
        total_amount: orderData.total_amount,
      };

      const response = await fetch('/api/store/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Failed to place order');
      }

      return response.json();
    },
    onSuccess: () => {
      // Invalidate orders query to refresh the list
      queryClient.invalidateQueries({ queryKey: ['orders'] });

      notifications.show({
        title: 'Order Placed',
        message: 'Your order has been successfully placed!',
        color: 'green',
      });
    },
    onError: (error) => {
      notifications.show({
        title: 'Error',
        message: error.message || 'Failed to place order. Please try again.',
        color: 'red',
      });
    },
  });

  // Place order function
  const placeOrder = (items: CartItem[], total_amount: number) => {
    return placeOrderMutation.mutate({
      items,
      total_amount,
    });
  };

  return {
    orders,
    isLoading,
    error,
    refetch,
    fetchOrder,
    placeOrder,
    placeOrderMutation,
  };
}
