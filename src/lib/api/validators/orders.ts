import { ValidationError } from '@/lib/api/errors';
import { Order, OrderStatus } from '@/types/store';

/**
 * Valid order statuses
 */
const VALID_STATUSES: OrderStatus[] = [
  'pending', 
  'confirmed', 
  'paid', 
  'delivered', 
  'cancelled'
];

/**
 * Validate order input
 */
export function validateOrder(order: Partial<Order>): void {
  const errors: string[] = [];

  // Required fields
  if (!order.user_id) errors.push('User ID is required');
  if (order.total_amount === undefined || order.total_amount < 0) {
    errors.push('Total amount must be greater than or equal to 0');
  }
  
  // Items array validation
  if (!Array.isArray(order.items) || order.items.length === 0) {
    errors.push('Order must include at least one item');
  } else {
    // Validate each item
    order.items.forEach((item, index) => {
      if (!item.item_code) errors.push(`Item at index ${index} is missing an item code`);
      if (!item.quantity || item.quantity <= 0) {
        errors.push(`Item at index ${index} must have a quantity greater than 0`);
      }
      if (item.price === undefined || item.price < 0) {
        errors.push(`Item at index ${index} must have a valid price`);
      }
    });
  }
  
  // Status validation
  if (order.status && !VALID_STATUSES.includes(order.status)) {
    errors.push(`Invalid status. Must be one of: ${VALID_STATUSES.join(', ')}`);
  }
  
  // If there are any validation errors, throw an error with details
  if (errors.length > 0) {
    throw new ValidationError('Order validation failed', errors);
  }
}

/**
 * Validate order status
 */
export function validateOrderStatus(status: string): void {
  if (!VALID_STATUSES.includes(status as OrderStatus)) {
    throw new ValidationError(
      'Invalid order status', 
      `Status must be one of: ${VALID_STATUSES.join(', ')}`
    );
  }
}