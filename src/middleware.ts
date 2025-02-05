import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@kinde-oss/kinde-auth-nextjs/middleware';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { supabaseServer } from '@/lib/supabase';

export default withAuth(
  async (req: NextRequest) => {
    const { pathname } = req.nextUrl;

    if (pathname === '/') {
      return NextResponse.next();
    }

    const { getUser } = getKindeServerSession();
    const user = await getUser();

    if (!user) {
      return NextResponse.redirect(new URL('/api/auth/login', req.url));
    }

    try {
      const { data: userProfile } = await supabaseServer
        .from('users')
        .select()
        .eq('kinde_id', user.id)
        .single();

      const isOnboarding = pathname === '/onboarding';
      const hasCompletedOnboarding = !!userProfile;

      if (hasCompletedOnboarding && isOnboarding) {
        return NextResponse.redirect(new URL('/portal', req.url));
      }

      if (!hasCompletedOnboarding && !isOnboarding) {
        return NextResponse.redirect(new URL('/onboarding', req.url));
      }

      return NextResponse.next();
    } catch (error) {
      return NextResponse.redirect(new URL('/onboarding', req.url));
    }
  },
  {
    callbacks: {
      authorized: () => true,
    },
  }
);

export const config = {
  matcher: ['/((?!api/auth|_next/static|_next/image|favicon.ico|$).*)'],
};
