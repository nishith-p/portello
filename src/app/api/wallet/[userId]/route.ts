import { NextResponse, type NextRequest } from 'next/server';
import { withAuth } from '@/lib/auth/utils';
import { getAnyUserWalletData } from '@/lib/wallet/db';

export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  return withAuth(
    request,
    async (req, user) => {
      try {
        if (!user || !user.id) {
          return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { userId } = await params;
        if (!userId) {
          return NextResponse.json({ error: 'User ID required' }, { status: 400 });
        }

        const walletData = await getAnyUserWalletData(userId);
        return NextResponse.json(walletData);
      } catch (error: any) {
        console.error('Error in admin wallet API:', error);
        const status = error.message.includes('Unauthorized') ? 403 : 500;
        return NextResponse.json(
          { error: error.message || 'Internal server error' },
          { status }
        );
      }
    },
    {
      requireAuth: true,
      requireAdmin: true
    }
  );
}
