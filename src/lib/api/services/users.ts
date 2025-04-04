import { supabaseServer } from '@/lib/supabase';
import { NotFoundError, ConflictError, ValidationError } from '@/lib/api/errors';
import { User, BasicUser, UserStatus } from '@/types/user';

/**
 * Get a user by Kinde ID
 */
export async function getUserByKindeId(kindeId: string): Promise<User | null> {
  const { data, error } = await supabaseServer
    .from('users')
    .select('*')
    .eq('kinde_id', kindeId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return null; // No user found is not an error
    }
    throw error;
  }
  
  return data;
}

/**
 * Create a new user profile
 */
export async function createUser(userData: BasicUser): Promise<User> {
  // Validate required fields
  if (!userData.kinde_id || !userData.first_name || !userData.last_name) {
    throw new ValidationError('Missing required user fields', {
      required: ['kinde_id', 'first_name', 'last_name']
    });
  }

  // Check if user already exists
  const existingUser = await getUserByKindeId(userData.kinde_id);
  if (existingUser) {
    throw new ConflictError('User profile already exists');
  }

  // Set default status if not provided
  if (!userData.status) {
    userData.status = 'pending';
  }

  const { data, error } = await supabaseServer
    .from('users')
    .insert([userData])
    .select()
    .single();

  if (error) {
    throw error;
  }
  
  return data;
}

/**
 * Update a user profile
 */
export async function updateUser(kindeId: string, userData: Partial<BasicUser>): Promise<User> {
  // Check if user exists
  const existingUser = await getUserByKindeId(kindeId);
  if (!existingUser) {
    throw new NotFoundError(`User with ID ${kindeId} not found`);
  }

  const { data, error } = await supabaseServer
    .from('users')
    .update(userData)
    .eq('kinde_id', kindeId)
    .select()
    .single();

  if (error) {
    throw error;
  }
  
  return data;
}

/**
 * Update a user's status
 */
export async function updateUserStatus(kindeId: string, status: UserStatus): Promise<User> {
  // Check if user exists
  const existingUser = await getUserByKindeId(kindeId);
  if (!existingUser) {
    throw new NotFoundError(`User with ID ${kindeId} not found`);
  }

  // Validate status
  const validStatuses: UserStatus[] = ['pending', 'approved', 'rejected', 'admin'];
  if (!validStatuses.includes(status)) {
    throw new ValidationError(
      'Invalid status',
      `Status must be one of: ${validStatuses.join(', ')}`
    );
  }

  const { data, error } = await supabaseServer
    .from('users')
    .update({ status })
    .eq('kinde_id', kindeId)
    .select()
    .single();

  if (error) {
    throw error;
  }
  
  return data;
}

/**
 * Get all users (admin only)
 */
export async function getAllUsers(): Promise<User[]> {
  const { data, error } = await supabaseServer
    .from('users')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    throw error;
  }
  
  return data;
}