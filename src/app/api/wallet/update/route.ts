import { NextResponse, type NextRequest } from 'next/server';
import { withAuth } from '@/lib/auth/utils';
import { updateUserCredit } from '@/lib/wallet/db';

export async function POST(request: NextRequest) {
  return withAuth(
    request,
    async (req, user) => {
      try {
        if (!user || !user.id) {
          return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { userId, amount, reason } = await req.json();
        
        if (!userId || typeof amount !== 'number') {
          return NextResponse.json({ error: 'Invalid request data' }, { status: 400 });
        }

        const result = await updateUserCredit(userId, amount, reason, user.id);

        if (!result.success) {
          return NextResponse.json({ error: result.error || 'Failed to update credit' }, { status: 500 });
        }

        return NextResponse.json({ success: true });
      } catch (error) {
        console.error('Error in wallet update API:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
      }
    },
    {
      requireAuth: true,
      requireAdmin: true
    }
  );
}
