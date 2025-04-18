import { ValidationError } from '@/lib/core/errors';
import { Order, OrderItem, OrderItemExtended, OrderStatus } from '@/lib/store/types';

export function validateOrder(data: Order): void {
  const errors: Record<string, string> = {};

  // Check for required fields
  if (!data.user_id) {
    errors.user_id = 'User ID is required';
  }

  if (!data.status) {
    errors.status = 'Status is required';
  }

  if (
    data.total_amount == null ||
    isNaN(Number(data.total_amount)) ||
    Number(data.total_amount) < 0
  ) {
    errors.total_amount = 'Valid total amount is required';
  }

  if (!data.items || !Array.isArray(data.items) || data.items.length === 0) {
    errors.items = 'At least one item is required';
  } else {
    // Validate each item
    const itemErrors: Record<number, Record<string, string>> = {};

    data.items.forEach((item, index) => {
      const itemError: Record<string, string> = {};

      // Check if item is a pack item (has is_pack property set to true)
      const isPack = 'is_pack' in item && item.is_pack === true;

      // Regular item validation
      if (!isPack) {
        if (!item.item_code) {
          itemError.item_code = 'Item code is required';
        }

        if (item.quantity == null || isNaN(Number(item.quantity)) || Number(item.quantity) <= 0) {
          itemError.quantity = 'Valid quantity is required';
        }

        if (item.price == null || isNaN(Number(item.price)) || Number(item.price) < 0) {
          itemError.price = 'Valid price is required';
        }
      }
      // Pack item validation
      else {
        const packItem = item as OrderItemExtended & { pack_items?: OrderItem[] };

        if (!packItem.item_code) {
          itemError.item_code = 'Pack code is required';
        }

        if (
          packItem.quantity == null ||
          isNaN(Number(packItem.quantity)) ||
          Number(packItem.quantity) <= 0
        ) {
          itemError.quantity = 'Valid quantity is required';
        }

        if (packItem.price == null || isNaN(Number(packItem.price)) || Number(packItem.price) < 0) {
          itemError.price = 'Valid price is required';
        }

        // If it's a pack, validate each pack item
        if (
          !packItem.pack_items ||
          !Array.isArray(packItem.pack_items) ||
          packItem.pack_items.length === 0
        ) {
          itemError.pack_items = 'At least one pack item is required';
        } else {
          // Validate each pack item
          const packItemErrors: Record<number, Record<string, string>> = {};

          packItem.pack_items.forEach((packItemDetail, packIndex) => {
            const packItemError: Record<string, string> = {};

            if (!packItemDetail.item_code) {
              packItemError.item_code = 'Item code is required for pack item';
            }

            if (
              packItemDetail.quantity == null ||
              isNaN(Number(packItemDetail.quantity)) ||
              Number(packItemDetail.quantity) <= 0
            ) {
              packItemError.quantity = 'Valid quantity is required for pack item';
            }

            if (Object.keys(packItemError).length > 0) {
              packItemErrors[packIndex] = packItemError;
            }
          });

          if (Object.keys(packItemErrors).length > 0) {
            itemError.pack_items_errors = JSON.stringify(packItemErrors);
          }
        }
      }

      if (Object.keys(itemError).length > 0) {
        itemErrors[index] = itemError;
      }
    });

    if (Object.keys(itemErrors).length > 0) {
      errors.items_validation = JSON.stringify(itemErrors);
    }
  }

  if (Object.keys(errors).length > 0) {
    throw new ValidationError('Invalid order data', errors);
  }
}

export function validateOrderStatus(status: string): void {
  const validStatuses: OrderStatus[] = [
    'pending',
    'confirmed',
    'paid',
    'processing',
    'shipped',
    'delivered',
    'cancelled',
  ];

  if (!validStatuses.includes(status as OrderStatus)) {
    throw new ValidationError(`Invalid order status: ${status}.`);
  }
}
