// app/api/orders/pending-delegate/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/lib/auth/utils';
import { supabaseServer } from '@/lib/core/supabase';

export async function GET(request: NextRequest) {
  return withAuth(
    request,
    async (req, user) => {
      try {
        const { searchParams } = new URL(request.url);
        const user_id = searchParams.get('user_id');

        if (!user_id) {
          return NextResponse.json(
            { error: 'User ID is required' },
            { status: 400 }
          );
        }

        const { data: order, error } = await supabaseServer
          .from('orders')
          .select(`
            id,
            status,
            order_items!inner(item_code)
          `)
          .eq('user_id', user_id)
          .eq('order_items.item_code', 'DELEGATE_FEE')
          .neq('status', 'paid')
          .maybeSingle();

        if (error) {
          throw error;
        }

        return NextResponse.json(order);
      } catch (error: any) {
        console.error('Pending order check error:', error);
        return NextResponse.json(
          { error: error.message || 'Failed to check for pending orders' },
          { status: 500 }
        );
      }
    },
    { requireAuth: true }
  );
}
