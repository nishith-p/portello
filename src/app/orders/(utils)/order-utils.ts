import { OrderStatus } from '@/lib/store/types';

/**
 * Format a date string to a more user-friendly format
 */
export function formatDate(dateString?: string): string {
  if (!dateString) {
    return 'N/A';
  }

  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Get the appropriate color for an order status
 */
export function getStatusColor(status: OrderStatus): string {
  switch (status) {
    case 'pending':
      return 'yellow';
    case 'confirmed':
    case 'paid':
    case 'processing':
      return 'blue';
    case 'shipped':
      return 'indigo';
    case 'delivered':
      return 'green';
    case 'cancelled':
      return 'red';
    default:
      return 'gray';
  }
}

/**
 * Get a description of an order status
 */
export function getStatusDescription(status: OrderStatus): string {
  switch (status) {
    case 'pending':
      return 'Your order has been received and is awaiting processing.';
    case 'confirmed':
      return 'Your order has been confirmed and is being processed.';
    case 'paid':
      return 'Your order has been paid and is being processed.';
    case 'processing':
      return 'Your order is being prepared for shipping.';
    case 'shipped':
      return 'Your order has been shipped and is on its way to you.';
    case 'delivered':
      return 'Your order has been delivered.';
    case 'cancelled':
      return 'This order has been cancelled.';
    default:
      return '';
  }
}

/**
 * Format currency for display
 */
export function formatCurrency(amount: number): string {
  return `$${amount.toFixed(2)}`;
}
