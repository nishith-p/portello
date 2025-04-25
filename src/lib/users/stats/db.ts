import { PostgrestSingleResponse } from '@supabase/supabase-js';
import { supabaseServer } from '@/lib/core/supabase';
import { MealPreferenceType, RegionType } from '@/lib/users/types';

interface RegionCountResult {
  region: RegionType;
  count: number;
}

interface MealTypeCountResult {
  meal_type: MealPreferenceType;
  count: number;
}

interface EntityCountResult {
  entity: string;
  count: number;
}

interface SubEntityCountResult {
  sub_entity: string;
  count: number;
}

interface RoundCountResult {
  round: number;
  count: number;
}

export interface UserStats {
  totalUsers: number;
  regionCounts: Record<RegionType, number>;
  mealTypeCounts: Record<MealPreferenceType, number>;
  positionCounts: {
    MCP: number;
    MCVP: number;
    LCP: number;
    Other: number;
  };
  topEntities: Array<{ entity: string; count: number }>;
  topSubEntities: Array<{ sub_entity: string; count: number }>;
  tripCount: number;
  roundCounts: Record<string, number>;
}

/**
 * Get comprehensive user statistics
 */
export async function getUserStats(): Promise<UserStats> {
  // Get total number of users
  const { count: totalUsers, error: countError } = await supabaseServer
    .from('users')
    .select('*', { count: 'exact', head: true });

  if (countError) {
    throw countError;
  }

  // Get region counts
  const regionResponse: PostgrestSingleResponse<RegionCountResult[]> =
    await supabaseServer.rpc('get_region_counts');

  if (regionResponse.error) {
    throw regionResponse.error;
  }

  // Initialize regionCounts with all enum values
  const regionCounts = Object.values(RegionType).reduce<Record<RegionType, number>>(
    (acc, region) => {
      acc[region] = 0;
      return acc;
    },
    {} as Record<RegionType, number>
  );

  // Populate with actual counts
  if (regionResponse.data) {
    regionResponse.data.forEach((item) => {
      if (item.region) {
        regionCounts[item.region] = item.count;
      }
    });
  }

  // Get meal type counts
  const mealTypeResponse: PostgrestSingleResponse<MealTypeCountResult[]> =
    await supabaseServer.rpc('get_meal_type_counts');

  if (mealTypeResponse.error) {
    throw mealTypeResponse.error;
  }

  // Initialize mealTypeCounts with all enum values
  const mealTypeCounts = Object.values(MealPreferenceType).reduce<
    Record<MealPreferenceType, number>
  >(
    (acc, type) => {
      acc[type] = 0;
      return acc;
    },
    {} as Record<MealPreferenceType, number>
  );

  // Populate with actual counts
  if (mealTypeResponse.data) {
    mealTypeResponse.data.forEach((item) => {
      if (item.meal_type) {
        mealTypeCounts[item.meal_type] = item.count;
      }
    });
  }

  // Get position counts for specific positions
  const { count: mcpCount, error: mcpError } = await supabaseServer
    .from('users')
    .select('*', { count: 'exact', head: true })
    .ilike('position', '%MCP%');

  if (mcpError) {
    throw mcpError;
  }

  const { count: mcvpCount, error: mcvpError } = await supabaseServer
    .from('users')
    .select('*', { count: 'exact', head: true })
    .ilike('position', '%MCVP%');

  if (mcvpError) {
    throw mcvpError;
  }

  const { count: lcpCount, error: lcpError } = await supabaseServer
    .from('users')
    .select('*', { count: 'exact', head: true })
    .eq('position', 'LCP');

  if (lcpError) {
    throw lcpError;
  }

  // Calculate "Other" positions with safe number handling
  const safeTotal = totalUsers ?? 0;
  const safeMcpCount = mcpCount ?? 0;
  const safeMcvpCount = mcvpCount ?? 0;
  const safeLcpCount = lcpCount ?? 0;

  const otherCount = Math.max(0, safeTotal - (safeMcpCount + safeMcvpCount + safeLcpCount));

  const positionCounts = {
    MCP: safeMcpCount,
    MCVP: safeMcvpCount,
    LCP: safeLcpCount,
    Other: otherCount,
  };

  // Get top 10 entities
  const entityResponse: PostgrestSingleResponse<EntityCountResult[]> = await supabaseServer.rpc(
    'get_top_entities',
    { limit_count: 10 }
  );

  if (entityResponse.error) {
    throw entityResponse.error;
  }

  const topEntities = (entityResponse.data ?? []).map((item) => ({
    entity: item.entity,
    count: item.count,
  }));

  // Get top 10 sub entities
  const subEntityResponse: PostgrestSingleResponse<SubEntityCountResult[]> =
    await supabaseServer.rpc('get_top_sub_entities', { limit_count: 10 });

  if (subEntityResponse.error) {
    throw subEntityResponse.error;
  }

  const topSubEntities = (subEntityResponse.data ?? []).map((item) => ({
    sub_entity: item.sub_entity,
    count: item.count,
  }));

  // Get count of records where is_trip is TRUE
  const { count: tripCount, error: tripError } = await supabaseServer
    .from('users')
    .select('*', { count: 'exact', head: true })
    .eq('is_trip', true);

  if (tripError) {
    throw tripError;
  }

  // Get count of records per round
  const roundResponse: PostgrestSingleResponse<RoundCountResult[]> =
    await supabaseServer.rpc('get_round_counts');

  if (roundResponse.error) {
    throw roundResponse.error;
  }

  const roundCounts: Record<string, number> = {};
  if (roundResponse.data) {
    roundResponse.data.forEach((item) => {
      roundCounts[item.round.toString()] = item.count;
    });
  }

  return {
    totalUsers: safeTotal,
    regionCounts,
    mealTypeCounts,
    positionCounts,
    topEntities,
    topSubEntities,
    tripCount: tripCount ?? 0,
    roundCounts,
  };
}
