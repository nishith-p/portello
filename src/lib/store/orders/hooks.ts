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
  PayhereCheckoutInput,
  PayhereCheckoutResponse,
  PlaceOrderInput,
  UpdateOrderStatusInput,
} from '@/lib/store/types';

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
      refetchOnMount: true, // Always fetch fresh data when component mounts
      refetchOnWindowFocus: true, // Optionally fetch again if user switches back to tab
      staleTime: 0, // Consider data stale immediately so it's always fresh
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
  const usePlaceOrder = () => {
    const queryClient = useQueryClient();

    return useMutation<Order, Error, PlaceOrderInput>({
      mutationFn: async (orderData: PlaceOrderInput) => {
        const orderItems: (CreateOrderItemInput | CreateOrderPackItem)[] = [];

        for (const item of orderData.items) {
          if (isPackItem(item)) {
            const packItemInput: CreateOrderPackItem = {
              item_code: item.pack_code,
              quantity: item.quantity,
              price: item.price,
              pre_price: item.pre_price,
              discount_perc: item.discount_perc,
              name: item.name,
              image: item.image,
              is_pack: true,
              pack_items: item.pack_items.map((packItem: CartPackItemDetail) => ({
                item_code: packItem.item_code,
                quantity: packItem.quantity || 1,
                price: 0,
                size: packItem.size,
                color: packItem.color,
                color_hex: packItem.colorHex,
                name: packItem.name,
                image: packItem.image,
              })),
              // Add selected optional item if it exists
              ...(item.selected_optional_item && {
                selected_optional_item: {
                  item_code: item.selected_optional_item.item_code,
                  quantity: item.selected_optional_item.quantity || 1,
                  price: 0,
                  size: item.selected_optional_item.size,
                  color: item.selected_optional_item.color,
                  color_hex: item.selected_optional_item.colorHex,
                  name: item.selected_optional_item.name,
                  image: item.selected_optional_item.image,
                },
              }),
            };

            orderItems.push(packItemInput);
          } else {
            const regularItem: CreateOrderItemInput = {
              item_code: item.item_code,
              quantity: item.quantity,
              price: item.price,
              pre_price: item.pre_price || 0,
              discount_perc: item.discount_perc || 0,
              size: item.size,
              color: item.color,
              color_hex: item.colorHex,
              name: item.name,
              image: item.image,
            };

            orderItems.push(regularItem);
          }
        }

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

  const usePayhereCheckout = () => {
  return useMutation<PayhereCheckoutResponse, Error, PayhereCheckoutInput>({
    mutationFn: async (payload: PayhereCheckoutInput) => {
      const response = await fetch('/api/payhere/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create checkout session');
      }

      return response.json();
    },
    onError: (error) => {
      notifications.show({
        title: 'Payment Error',
        message: error.message,
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
    usePayhereCheckout
  };
}

/**
 * Hook for item quantity-related operations
 */
export function useItemQuantityHooks() {
  const queryClient = useQueryClient();

  const useItemQuantities = () => {
    return useQuery({
      queryKey: ['itemQuantities'],
      queryFn: async () => {
        const response = await fetch('/api/store/orders/items');
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error?.message || 'Failed to fetch item quantities');
        }
        return response.json();
      },
    });
  };

  return {
    useItemQuantities,
  };
}
