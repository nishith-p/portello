import { supabaseServer } from "../core/supabase";

export interface YSFSelection {
  email: string;
  full_name: string;
  track1: string;
  track2: string;
  panel: string;
  has_submitted: boolean;
  internal: boolean;
}

export async function checkInternalUser(email: string): Promise<boolean> {
  const { data, error } = await supabaseServer
    .from('users')
    .select('kinde_email')
    .eq('kinde_email', email.toLowerCase())
    .single();

  return !!data;
}

export async function getYSFSelectionByEmail(email: string): Promise<{
  selections: {
    track1: string;
    track2: string;
    panel: string;
  };
  hasSubmitted: boolean;
  full_name?: string;
  internal?: boolean;
}> {
  try {
    const { data, error } = await supabaseServer
      .from('ysf_track')
      .select('track1, track2, panel, has_submitted, full_name, internal')
      .eq('email', email.toLowerCase())
      .single();

    if (error || !data) {
      console.debug('No existing selection found for email:', email);
      return {
        selections: { track1: '', track2: '', panel: '' },
        hasSubmitted: false,
      };
    }

    return {
      selections: {
        track1: data.track1 || '',
        track2: data.track2 || '',
        panel: data.panel || '',
      },
      hasSubmitted: data.has_submitted || false,
      full_name: data.full_name || undefined,
      internal: data.internal || false,
    };
  } catch (error) {
    console.error('Error fetching selection by email:', error);
    throw error;
  }
}

export async function createYSFSelection(
  email: string,
  selections: {
    track1: string;
    track2: string;
    panel: string;
    full_name: string;
  },
  internal: boolean
): Promise<void> {
  try {
    const { error } = await supabaseServer
      .from('ysf_track')
      .insert({
        email: email.toLowerCase(),
        track1: selections.track1,
        track2: selections.track2,
        panel: selections.panel,
        full_name: selections.full_name,
        internal: internal,
        has_submitted: true,
        created_at: new Date().toISOString(),
      });

    if (error) {
      console.error('Error creating YSF selection:', error);
      throw error;
    }
  } catch (error) {
    console.error('Error in createYSFSelection:', error);
    throw error;
  }
}

export async function getAllYSFStats(): Promise<{
  track1Stats: Record<string, number>;
  track2Stats: Record<string, number>;
  panelStats: Record<string, number>;
}> {
  try {
    const { data, error } = await supabaseServer
      .from('ysf_track')
      .select('track1, track2, panel');

    if (error) {
      console.error('Error fetching all YSF stats:', error);
      return {
        track1Stats: {},
        track2Stats: {},
        panelStats: {},
      };
    }

    const stats = {
      track1Stats: {} as Record<string, number>,
      track2Stats: {} as Record<string, number>,
      panelStats: {} as Record<string, number>,
    };

    data?.forEach((row) => {
      if (row.track1) {
        stats.track1Stats[row.track1] = (stats.track1Stats[row.track1] || 0) + 1;
      }
      if (row.track2) {
        stats.track2Stats[row.track2] = (stats.track2Stats[row.track2] || 0) + 1;
      }
      if (row.panel) {
        stats.panelStats[row.panel] = (stats.panelStats[row.panel] || 0) + 1;
      }
    });

    return stats;
  } catch (error) {
    console.error('Error in getAllYSFStats:', error);
    throw error;
  }
}
