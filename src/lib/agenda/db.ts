import { supabaseServer } from "../core/supabase";
import { Day, Session } from "./types";


// Queries
export const getDaysWithData = async (): Promise<Day[]> => {
  // Get all days
  const { data: days, error: daysError } = await supabaseServer
    .from('days')
    .select('*')
    .order('display_order', { ascending: true });

  if (daysError) throw daysError;

  // Get all tracks
  const { data: tracks, error: tracksError } = await supabaseServer
    .from('tracks')
    .select('*');

  if (tracksError) throw tracksError;

  // Get all sessions
  const { data: sessions, error: sessionsError } = await supabaseServer
    .from('sessions')
    .select('*')
    .order('display_order', { ascending: true });

  if (sessionsError) throw sessionsError;

  // Get all session targets
  const { data: sessionTargets, error: targetsError } = await supabaseServer
    .from('session_targets')
    .select('*');

  if (targetsError) throw targetsError;

  // Combine the data
  return days.map(day => {
    const dayTracks = tracks.filter(track => track.day_id === day.id);
    const daySessions = sessions
      .filter(session => session.day_id === day.id)
      .map(session => {
        const sessionTargetIds = sessionTargets
          .filter(st => st.session_id === session.id)
          .map(st => st.track_id);
        
        const targetRoles = dayTracks
          .filter(track => sessionTargetIds.includes(track.id))
          .map(track => track.name);

        return {
          ...session,
          targetRoles
        };
      });

    return {
      ...day,
      tracks: dayTracks,
      sessions: daySessions
    };
  });
};

export const updateSession = async (sessionId: number, updates: Partial<Session>) => {
  const { data, error } = await supabaseServer
    .from('sessions')
    .update(updates)
    .eq('id', sessionId)
    .select();

  if (error) throw error;
  return data;
};
