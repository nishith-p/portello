import { ValidationError } from '@/lib/api/errors';
import { StoreItem } from '@/types/store';

/**
 * Validate store item input
 */
export function validateStoreItem(item: Partial<StoreItem>): void {
  const errors: string[] = [];

  // Required fields
  if (!item.item_code) errors.push('Item code is required');
  if (!item.name) errors.push('Name is required');
  if (item.price === undefined || item.price <= 0) errors.push('Price must be greater than 0');
  if (!item.description) errors.push('Description is required');
  
  // Validate arrays
  if (!Array.isArray(item.images)) errors.push('Images must be an array');
  if (!Array.isArray(item.sizes)) errors.push('Sizes must be an array');
  if (!Array.isArray(item.colors)) errors.push('Colors must be an array');
  
  // Validate color objects if they exist
  if (Array.isArray(item.colors)) {
    item.colors.forEach((color, index) => {
      if (!color.name) errors.push(`Color at index ${index} is missing a name`);
      if (!color.hex) errors.push(`Color at index ${index} is missing a hex value`);
    });
  }
  
  // If there are any validation errors, throw an error with details
  if (errors.length > 0) {
    throw new ValidationError('Store item validation failed', errors);
  }
}

/**
 * Validate item code format
 */
export function validateItemCode(code: string): void {
  if (!/^[A-Z0-9]{2,10}$/.test(code)) {
    throw new ValidationError(
      'Invalid item code format', 
      'Item code must be 2-10 uppercase letters or numbers'
    );
  }
}