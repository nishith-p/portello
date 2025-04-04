import { ValidationError } from '@/lib/api/errors';
import { BasicUser, UserStatus } from '@/types/user';

/**
 * Validate user data
 */
export function validateUser(userData: Partial<BasicUser>): void {
  const errors: string[] = [];

  // Required fields
  if (!userData.kinde_id) errors.push('Kinde ID is required');
  if (!userData.first_name) errors.push('First name is required');
  if (!userData.last_name) errors.push('Last name is required');
  
  // Optional fields with validation
  if (userData.status) {
    const validStatuses: UserStatus[] = ['pending', 'approved', 'rejected', 'admin'];
    if (!validStatuses.includes(userData.status)) {
      errors.push(`Status must be one of: ${validStatuses.join(', ')}`);
    }
  }

  // Validate entity and position if they exist
  if (userData.entity !== undefined && typeof userData.entity !== 'string') {
    errors.push('Entity must be a string');
  }
  
  if (userData.position !== undefined && typeof userData.position !== 'string') {
    errors.push('Position must be a string');
  }
  
  // If there are any validation errors, throw an error with details
  if (errors.length > 0) {
    throw new ValidationError('User validation failed', errors);
  }
}

/**
 * Validate user status
 */
export function validateUserStatus(status: string): void {
  const validStatuses: UserStatus[] = ['pending', 'approved', 'rejected', 'admin'];
  
  if (!validStatuses.includes(status as UserStatus)) {
    throw new ValidationError(
      'Invalid user status', 
      `Status must be one of: ${validStatuses.join(', ')}`
    );
  }
}