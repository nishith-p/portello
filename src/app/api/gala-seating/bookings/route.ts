import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/lib/auth/utils';
import { getAdminGalaData } from '@/lib/gala/db';

export async function GET(request: NextRequest) {
  return withAuth(
    request,
    async () => {
      try {
        const data = await getAdminGalaData();

        if (!data) {
          return NextResponse.json(
            { error: 'Failed to fetch admin data' }, 
            { status: 500 }
          );
        }

        return NextResponse.json(data);
      } catch (error) {
        console.error('Error in gala bookings API:', error);
        return NextResponse.json(
          { error: 'Internal server error' }, 
          { status: 500 }
        );
      }
    },
    {
      requireAuth: true,
      requireAdmin: true,
    }
  );
}
