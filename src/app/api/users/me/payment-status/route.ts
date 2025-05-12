import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/lib/auth/utils';
import { supabaseServer } from '@/lib/core/supabase';

export async function GET(request: NextRequest) {
  return withAuth(request, async (req, user) => {
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    try {
      const { data, error } = await supabaseServer
        .from('users')
        .select('payment')
        .eq('kinde_id', user.id)
        .single();

      if (error) {
        throw error;
      }

      return NextResponse.json({ payment: data?.payment || null });
    } catch (error: any) {
      return NextResponse.json(
        { error: error.message || 'Failed to fetch payment status' },
        { status: 500 }
      );
    }
  });
}
