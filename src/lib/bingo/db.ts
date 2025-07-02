import { supabaseServer } from '@/lib/core/supabase';
import { KindeUser } from '@kinde-oss/kinde-auth-nextjs/types';

export class BingoService {
  static async getActivities(user: KindeUser) {
    const { data, error } = await supabaseServer
      .from('bingo')
      .select('activity_id, completed')
      .eq('user_id', user.id);

    if (error) {
      throw error;
    }
    return data;
  }

  static async saveActivity(
    user: KindeUser,
    activityId: number,
    completed: boolean
  ) {
    const { data, error } = await supabaseServer
      .from('bingo')
      .upsert(
        {
          user_id: user.id,
          activity_id: activityId,
          completed,
          completed_at: completed ? new Date().toISOString() : null
        },
        { onConflict: 'user_id,activity_id' }
      )
      .select();

    if (error) {
      throw error;
    }
    return data;
  }
}
