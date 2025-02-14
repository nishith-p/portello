import { NextRequest, NextResponse } from 'next/server';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { supabaseServer } from '@/lib/supabase';

export async function PATCH(req: NextRequest) {
  try {
    const { getPermissions, getUser } = getKindeServerSession();
    const [permissions, currentUser] = await Promise.all([getPermissions(), getUser()]);

    if (!currentUser?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Only admins can change status
    const isAdmin = permissions?.permissions?.includes('dx:admin') ?? false;
    if (!isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const kindeUserId = searchParams.get('userId');

    if (!kindeUserId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    const { status } = await req.json();

    if (!['pending', 'approved', 'rejected'].includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }

    const { data, error } = await supabaseServer
      .from('users')
      .update({ status })
      .eq('kinde_id', kindeUserId)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error updating user status:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
