import { ValidationError } from '@/lib/core/errors';
import { Order, OrderStatus } from '@/lib/store/types';

/**
 * Validate order status
 */
export function validateOrderStatus(status: string): void {
  const validStatuses: OrderStatus[] = [
    'pending',
    'processing',
    'shipped',
    'delivered',
    'cancelled',
  ];

  if (!validStatuses.includes(status as OrderStatus)) {
    throw new ValidationError('Invalid order status', {
      status: `Status must be one of: ${validStatuses.join(', ')}`,
    });
  }
}

/**
 * Validate order data
 */
export function validateOrder(order: Order): void {
  // Validate required fields
  if (!order.user_id) {
    throw new ValidationError('Missing user ID', { user_id: 'User ID is required' });
  }

  if (!order.total_amount && order.total_amount !== 0) {
    throw new ValidationError('Missing total amount', { total_amount: 'Total amount is required' });
  }

  if (order.total_amount < 0) {
    throw new ValidationError('Invalid total amount', {
      total_amount: 'Total amount must be greater than or equal to 0',
    });
  }

  if (!order.items || !Array.isArray(order.items) || order.items.length === 0) {
    throw new ValidationError('Missing order items', {
      items: 'Order must have at least one item',
    });
  }

  // Validate each item
  order.items.forEach((item, index) => {
    if (!item.item_code) {
      throw new ValidationError('Missing item code', {
        [`items[${index}].item_code`]: 'Item code is required',
      });
    }

    if (!item.quantity || item.quantity <= 0) {
      throw new ValidationError('Invalid quantity', {
        [`items[${index}].quantity`]: 'Quantity must be greater than 0',
      });
    }

    if (!item.price && item.price !== 0) {
      throw new ValidationError('Missing price', {
        [`items[${index}].price`]: 'Price is required',
      });
    }

    if (item.price < 0) {
      throw new ValidationError('Invalid price', {
        [`items[${index}].price`]: 'Price must be greater than or equal to 0',
      });
    }
  });

  // Validate status if provided
  if (order.status) {
    validateOrderStatus(order.status);
  }
}
