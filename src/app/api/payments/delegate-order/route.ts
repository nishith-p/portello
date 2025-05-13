// app/api/payments/delegate-order/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/lib/auth/utils';
import { supabaseServer } from '@/lib/core/supabase';
import { getUserByKindeId } from '@/lib/users/db';

export async function POST(request: NextRequest) {
  return withAuth(
    request,
    async (req, user) => {
      try {
        const { user_id } = await req.json();
        
        if (!user_id) {
          return NextResponse.json(
            { error: 'User ID is required' },
            { status: 400 }
          );
        }

        // Check for existing pending delegate fee order
        const { data: existingOrder, error: existingOrderError } = await supabaseServer
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

        if (existingOrderError) {
          throw existingOrderError;
        }

        if (existingOrder) {
          return NextResponse.json(
            { 
              error: 'You already have a pending delegate fee payment',
              existingOrderId: existingOrder.id 
            },
            { status: 400 }
          );
        }

        // Get user details to determine fee amount
        const userProfile = await getUserByKindeId(user_id);
        if (!userProfile) {
          return NextResponse.json(
            { error: 'User not found' },
            { status: 404 }
          );
        }

        const amount = ['MCPc', 'MCPe'].includes(userProfile.position) ? 100 : 1;

        // Create delegate fee order
        const { data: order, error } = await supabaseServer
          .from('orders')
          .insert({
            user_id: user_id,
            status: 'pending',
            total_amount: amount,
            updated_by: user_id,
          })
          .select()
          .single();

        if (error) {
          throw error;
        }

        // Create order item for delegate fee
        const { error: itemError } = await supabaseServer
          .from('order_items')
          .insert({
            order_id: order.id,
            item_code: 'DELEGATE_FEE',
            quantity: 1,
            price: amount,
            name: 'Delegate Fee',
            description: `Delegate fee for ${userProfile.position} position`,
            is_pack: false,
          });

        if (itemError) {
          // Clean up the order if item creation fails
          await supabaseServer.from('orders').delete().eq('id', order.id);
          throw itemError;
        }

        return NextResponse.json(order);
      } catch (error: any) {
        console.error('Delegate order creation error:', error);
        return NextResponse.json(
          { error: error.message || 'Failed to create delegate order' },
          { status: 500 }
        );
      }
    },
    { requireAuth: true }
  );
}
