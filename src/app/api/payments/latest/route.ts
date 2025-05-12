import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/core/supabase';
import { withAuth } from '@/lib/auth/utils';

export async function GET(request: NextRequest){
  return withAuth(
    request, 
    async (req) => {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('user_id');
    const type = searchParams.get('type');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    let query = supabaseServer
      .from('payments')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(1);

    if (type === 'delegate') {
      query = query.ilike('custom_1', `delegate|%`);
    }

    const { data, error } = await query;

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(data?.[0] || null);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Server Error' },
      { status: 500 }
    );
  }
});
}
