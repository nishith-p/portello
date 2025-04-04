import { supabaseServer } from '@/lib/supabase';
import { User, UserDocuments, UserListItem, UserProfile, UserSearchParams } from '@/types/users';

/**
 * Get a user by their Kinde ID
 */
export async function getUserByKindeId(kindeId: string): Promise<User | null> {
  const { data, error } = await supabaseServer
    .from('users')
    .select('*')
    .eq('kinde_id', kindeId)
    .single();

  if (error) {
    console.error('Error fetching user:', error);
    return null;
  }

  return data as User;
}

/**
 * Get user documents by user Kinde ID
 */
export async function getUserDocuments(kindeId: string): Promise<UserDocuments | null> {
  const { data, error } = await supabaseServer
    .from('user_documents')
    .select('*')
    .eq('user_id', kindeId)
    .single();

  if (error && error.code !== 'PGRST116') { // PGRST116 is not found
    console.error('Error fetching user documents:', error);
    return null;
  }

  return data as UserDocuments;
}

/**
 * Get a complete user profile (user data + documents)
 */
export async function getUserProfile(kindeId: string): Promise<UserProfile | null> {
  const [user, documents] = await Promise.all([
    getUserByKindeId(kindeId),
    getUserDocuments(kindeId)
  ]);

  if (!user) {return null;}

  return {
    user,
    documents
  };
}

/**
 * Search and filter users for admin panel
 */
export async function searchUsers(params: UserSearchParams): Promise<{ users: UserListItem[]; total: number }> {
  const {
    search = '',
    entity,
    position,
    round,
    limit = 10,
    offset = 0
  } = params;

  // Start building the query
  let query = supabaseServer
    .from('users')
    .select('id, kinde_id, first_name, last_name, position, entity, sub_entity, aiesec_email, round', {
      count: 'exact'
    });

  // Add filters if provided
  if (search) {
    query = query.or(
      `first_name.ilike.%${search}%,last_name.ilike.%${search}%,aiesec_email.ilike.%${search}%`
    );
  }

  if (entity) {
    query = query.eq('entity', entity);
  }

  if (position) {
    query = query.eq('position', position);
  }

  if (round !== undefined) {
    query = query.eq('round', round);
  }

  // Add pagination
  query = query
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  // Execute the query
  const { data, error, count } = await query;

  if (error) {
    console.error('Error searching users:', error);
    throw error;
  }

  // Format the response to match the UserListItem interface
  const users = data.map(user => ({
    id: user.id,
    kinde_id: user.kinde_id,
    full_name: `${user.first_name} ${user.last_name}`,
    position: user.position,
    entity: user.entity,
    sub_entity: user.sub_entity,
    aiesec_email: user.aiesec_email,
    round: user.round
  }));

  return {
    users,
    total: count || 0
  };
}