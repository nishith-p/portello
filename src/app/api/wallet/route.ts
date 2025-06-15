import { NextResponse, type NextRequest } from 'next/server';
import { withAuth } from '@/lib/auth/utils';
import { getWalletData } from '@/lib/wallet/db';

/**
 * GET /api/wallet
 * Get wallet data for authenticated user
 */
export async function GET(request: NextRequest) {
  return withAuth(
    request,
    async (req, user) => {
      try {
        if (!user || !user.id) {
          return NextResponse.json([], { status: 200 });
        }
        
        const walletData = await getWalletData(user.id);
        return NextResponse.json(walletData);
      } catch (error) {
        console.error('Error in wallet API:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
      }
    },
    {
      requireAuth: true,
    }
  );
}
