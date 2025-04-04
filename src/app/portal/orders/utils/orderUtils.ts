import { Order, StatusColorMap } from '../types';

/**
 * Maps order status to corresponding color
 */
export const getStatusColor = (status: Order['status']): string => {
  const statusColors: StatusColorMap = {
    pending: 'yellow',
    confirmed: 'blue',
    paid: 'cyan',
    delivered: 'green',
    cancelled: 'red',
  };
  return statusColors[status] || 'gray';
};

/**
 * Formats date string to a readable format
 */
export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};