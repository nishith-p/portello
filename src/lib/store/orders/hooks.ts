'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { notifications } from '@mantine/notifications';
import { isPackItem } from '@/context/cart';
import {
  CartItem,
  CartPackItem,
  CartPackItemDetail,
  CreateOrderItemInput,
  CreateOrderPackItem,
  Order,
  OrderStatus,
} from '@/lib/store/types';

interface PlaceOrderInput {
  items: (CartItem | CartPackItem)[];
  total_amount: number;
}

interface UpdateOrderStatusInput {
  orderId: string;
  status: OrderStatus;
}

/**
 * Hook for order-related operations
 */
export function useOrderHooks() {
  const queryClient = useQueryClient();

  // Fetch user's orders
  const useUserOrders = () => {
    return useQuery<Order[]>({
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
  };

  // Fetch all orders (admin only)
  const useAllOrders = () => {
    return useQuery<Order[]>({
      queryKey: ['orders', 'all'],
      queryFn: async () => {
        const response = await fetch('/api/store/orders');
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error?.message || 'Failed to fetch all orders');
        }
        return response.json();
      },
    });
  };

  // Fetch a specific order
  const useOrder = (orderId: string) => {
    return useQuery<Order>({
      queryKey: ['orders', orderId],
      queryFn: async () => {
        const response = await fetch(`/api/store/orders/${orderId}`);
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error?.message || 'Failed to fetch order details');
        }
        return response.json();
      },
      enabled: Boolean(orderId),
    });
  };

  // Place a new order
  // The fixed usePlaceOrder function with proper user_id handling
  // Fixed usePlaceOrder hook with proper handling of user_id
  const usePlaceOrder = () => {
    const queryClient = useQueryClient();

    return useMutation<Order, Error, PlaceOrderInput>({
      mutationFn: async (orderData: PlaceOrderInput) => {
        // Transform cart items to order items, handling both regular items and pack items
        const orderItems: (CreateOrderItemInput | CreateOrderPackItem)[] = [];

        for (const item of orderData.items) {
          if (isPackItem(item)) {
            // It's a pack item - transform it to match the expected structure for the backend
            const packItemInput: CreateOrderPackItem = {
              item_code: item.pack_code,
              quantity: item.quantity,
              price: item.price,
              name: item.name,
              image: item.image,
              is_pack: true,
              pack_items: item.pack_items.map((packItem: CartPackItemDetail) => ({
                item_code: packItem.item_code,
                quantity: packItem.quantity || 1,
                price: 0, // Individual pack items don't have separate prices in cart
                size: packItem.size,
                color: packItem.color,
                color_hex: packItem.colorHex,
                name: packItem.name,
                image: packItem.image,
              })),
            };

            orderItems.push(packItemInput);
          } else {
            // Regular item
            const regularItem: CreateOrderItemInput = {
              item_code: item.item_code,
              quantity: item.quantity,
              price: item.price,
              size: item.size,
              color: item.color,
              color_hex: item.colorHex,
              name: item.name,
              image: item.image,
            };

            orderItems.push(regularItem);
          }
        }

        // Create the payload - user_id is omitted, it will be set from auth on the server
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
      onSuccess: async () => {
        await queryClient.invalidateQueries({ queryKey: ['orders'] });

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
  };

  // Update order status (admin only)
  const useUpdateOrderStatus = () => {
    return useMutation<Order, Error, UpdateOrderStatusInput>({
      mutationFn: async ({ orderId, status }: UpdateOrderStatusInput) => {
        const response = await fetch(`/api/store/orders/${orderId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ status }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error?.message || 'Failed to update order status');
        }

        return response.json();
      },
      onSuccess: async (_, variables) => {
        // Invalidate the specific order query and all orders
        await queryClient.invalidateQueries({ queryKey: ['orders', variables.orderId] });
        await queryClient.invalidateQueries({ queryKey: ['orders'] });

        notifications.show({
          title: 'Order Updated',
          message: `Order status has been updated to ${variables.status}`,
          color: 'green',
        });
      },
      onError: (error) => {
        notifications.show({
          title: 'Error',
          message: error.message || 'Failed to update order status. Please try again.',
          color: 'red',
        });
      },
    });
  };

  return {
    useUserOrders,
    useAllOrders,
    useOrder,
    usePlaceOrder,
    useUpdateOrderStatus,
  };
}
