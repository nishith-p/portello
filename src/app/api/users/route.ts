import { NextRequest, NextResponse } from 'next/server';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { supabaseServer } from '@/lib/supabase';
import { isOwnUserOrAdmin } from '@/utils/authorization';

export async function GET(req: NextRequest) {
  try {
    const { getUser } = getKindeServerSession();
    const user = await getUser();

    if (!user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const kindeUserId = searchParams.get('userId') || user.id;

    // Only allow admins or the user themselves to access the profile
    try {
      await isOwnUserOrAdmin(kindeUserId);
    } catch (error) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { data, error } = await supabaseServer
      .from('users')
      .select('*')
      .eq('kinde_id', kindeUserId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(null);
      }
      throw error;
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { getUser } = getKindeServerSession();
    const user = await getUser();

    if (!user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userData = await req.json();

    // Validate required fields
    if (!userData.kinde_id || !userData.first_name || !userData.last_name) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Check if user already exists
    const { data: existingUser } = await supabaseServer
      .from('users')
      .select('*')
      .eq('kinde_id', userData.kinde_id)
      .single();

    if (existingUser) {
      return NextResponse.json({ error: 'User profile already exists' }, { status: 409 });
    }

    const { data, error } = await supabaseServer
      .from('users')
      .insert([
        {
          kinde_id: userData.kinde_id,
          kinde_email: userData.kinde_email,
          first_name: userData.first_name,
          last_name: userData.last_name,
          entity: userData.entity,
          position: userData.position,
          status: 'pending',
        },
      ])
      .select()
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { getUser } = getKindeServerSession();
    const user = await getUser();

    if (!user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const kindeUserId = searchParams.get('userId');

    if (!kindeUserId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    // Only allow admins or the user themselves to update the profile
    try {
      await isOwnUserOrAdmin(kindeUserId);
    } catch (error) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const userData = await req.json();

    const { data, error } = await supabaseServer
      .from('users')
      .update(userData)
      .eq('kinde_id', kindeUserId)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
