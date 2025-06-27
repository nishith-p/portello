import { PANELS, TRACKS } from '@/app/(portal)/(components)/user-dashboard/const-ysf-tracks';
import { supabaseServer } from '@/lib/core/supabase';
import {
  User,
  UserDocuments,
  UserListItem,
  UserProfile,
  UserSearchParams,
} from '@/lib/users/types';

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

  if (error && error.code !== 'PGRST116') {
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
    getUserDocuments(kindeId),
  ]);

  if (!user) {
    return null;
  }

  return {
    user,
    documents,
  };
}

/**
 * Search and filter users for admin panel
 */
export async function searchUsers(
  params: UserSearchParams
): Promise<{ users: UserListItem[]; total: number }> {
  const { search = '', entity, position, round, limit = 10, offset = 0 } = params;

  let query = supabaseServer
    .from('users')
    .select(
      'id, kinde_id, first_name, last_name, position, entity, sub_entity, aiesec_email, round',
      {
        count: 'exact',
      }
    );

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
  query = query.order('created_at', { ascending: false }).range(offset, offset + limit - 1);

  const { data, error, count } = await query;

  if (error) {
    console.error('Error searching users:', error);
    throw error;
  }

  const users = data.map((user) => ({
    id: user.id,
    kinde_id: user.kinde_id,
    full_name: `${user.first_name} ${user.last_name}`,
    position: user.position,
    entity: user.entity,
    sub_entity: user.sub_entity,
    aiesec_email: user.aiesec_email,
    round: user.round,
  }));

  return {
    users,
    total: count || 0,
  };
}

/**
 * Update a user's delete request status
 */
export async function updateUserDeleteRequest(
  kindeId: string,
  deleteRequested: boolean
): Promise<User | null> {
  const { data, error } = await supabaseServer
    .from('users')
    .update({ delete_requested: deleteRequested })
    .eq('kinde_id', kindeId)
    .select('*')
    .single();

  if (error) {
    throw error;
  }

  return data as User;
}

/**
 * Get all track and panel statistics
 */
export async function getAllTrackStats(): Promise<{
  track1Stats: Record<string, number>;
  track2Stats: Record<string, number>;
  panelStats: Record<string, number>;
}> {
  const { data: users, error } = await supabaseServer
    .from('users')
    .select('ysf_track_1, ysf_track_2, ysf_panel')
    .or('ysf_track_1.not.is.null,ysf_track_2.not.is.null,ysf_panel.not.is.null');

  if (error) {
    console.error('Error fetching track stats:', error);
    throw error;
  }

  // Initialize stats
  const track1Stats: Record<string, number> = {};
  const track2Stats: Record<string, number> = {};
  const panelStats: Record<string, number> = {};

  TRACKS.forEach(track => {
    track1Stats[track.id] = 0;
    track2Stats[track.id] = 0;
  });

  PANELS.forEach(panel => {
    panelStats[panel.id] = 0;
  });

  // Count selections
  users?.forEach(user => {
    if (user.ysf_track_1 && track1Stats.hasOwnProperty(user.ysf_track_1)) {
      track1Stats[user.ysf_track_1]++;
    }
    if (user.ysf_track_2 && track2Stats.hasOwnProperty(user.ysf_track_2)) {
      track2Stats[user.ysf_track_2]++;
    }
    if (user.ysf_panel && panelStats.hasOwnProperty(user.ysf_panel)) {
      panelStats[user.ysf_panel]++;
    }
  });

  return { track1Stats, track2Stats, panelStats };
}

/**
 * Update user's session selections
 */
export async function updateUserSelections(
  kindeId: string,
  selections: {
    track1: string;
    track2: string;
    panel: string;
  }
): Promise<{ success: boolean }> {
  // Validate tracks
  const validTracks = TRACKS.map(t => t.id);
  if (!validTracks.includes(selections.track1) || !validTracks.includes(selections.track2)) {
    throw new Error('Invalid track selection');
  }

  // Validate panel
  const validPanels = PANELS.map(p => p.id);
  if (!validPanels.includes(selections.panel)) {
    throw new Error('Invalid panel selection');
  }

  const { error } = await supabaseServer
    .from('users')
    .update({
      ysf_track_1: selections.track1,
      ysf_track_2: selections.track2,
      ysf_panel: selections.panel
    })
    .eq('kinde_id', kindeId);

  if (error) {
    console.error('Error updating user selections:', error);
    throw error;
  }

  return { success: true };
}

/**
 * Get user's current selections and submission status
 */
export async function getUserSelectionInfo(kindeId: string): Promise<{
  selections: {
    track1: string | null;
    track2: string | null;
    panel: string | null;
  };
  hasSubmitted: boolean;
}> {
  const { data, error } = await supabaseServer
    .from('users')
    .select('ysf_track_1, ysf_track_2, ysf_panel')
    .eq('kinde_id', kindeId)
    .single();

  if (error) {
    console.error('Error fetching user selection info:', error);
    throw error;
  }

  return {
    selections: {
      track1: data.ysf_track_1,
      track2: data.ysf_track_2,
      panel: data.ysf_panel
    },
    hasSubmitted: !!(data.ysf_track_1 && data.ysf_track_2 && data.ysf_panel)
  };
}
