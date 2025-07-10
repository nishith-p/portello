import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/lib/auth/utils';
import { getAllUsersWithYSFSelections, getUniqueEntities } from '@/lib/users/db';

export async function GET(request: NextRequest) {
  return withAuth(
    request,
    async (req) => {
      try {
        const url = new URL(req.url);
        const type = url.searchParams.get('type');
        
        if (type === 'entities') {
          const entities = await getUniqueEntities();
          return NextResponse.json(entities);
        }
        
        const users = await getAllUsersWithYSFSelections();
        return NextResponse.json(users);
      } catch (error) {
        return NextResponse.json(
          { error: { message: (error as Error).message } },
          { status: 500 }
        );
      }
    },
    { requireAdmin: true }
  );
}
