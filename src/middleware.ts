import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@kinde-oss/kinde-auth-nextjs/middleware';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { PERMISSIONS, PUBLIC_ROUTES, ROUTE_PERMISSIONS } from '@/config/auth';
import { supabaseServer } from '@/lib/supabase';

const ONBOARDING_COOKIE_NAME = 'onboarding_complete';
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

export default withAuth(
  async (req: NextRequest) => {
    const { pathname } = req.nextUrl;

    // Skip all checks for public routes
    if (PUBLIC_ROUTES.includes(pathname as any)) {
      return NextResponse.next();
    }

    const { getUser, getPermissions } = getKindeServerSession();
    const [user, permissions] = await Promise.all([getUser(), getPermissions()]);

    if (!user) {
      return NextResponse.redirect(new URL('/api/auth/login', req.url));
    }

    const userPermissions = permissions?.permissions || [];
    const isAdminOrApproved = userPermissions.some(
      (permission) => permission === PERMISSIONS.ADMIN || permission === PERMISSIONS.APPROVED
    );

    // Handle onboarding completion check
    if (pathname !== '/onboarding') {
      // Skip onboarding check for admin or approved users
      if (!isAdminOrApproved) {
        const { data: userProfile, error } = await supabaseServer
          .from('users')
          .select('*')
          .eq('kinde_id', user.id)
          .single();

        if (error && error.code !== 'PGRST116') {
          console.error('Error checking user profile:', error);
          return NextResponse.redirect(new URL('/onboarding', req.url));
        }

        // If no profile exists, redirect to onboarding
        if (!userProfile) {
          return NextResponse.redirect(new URL('/onboarding', req.url));
        }
      }

      // Set the cookie and proceed with navigation
      const nextResponse = NextResponse.next();
      nextResponse.cookies.set(ONBOARDING_COOKIE_NAME, 'true', {
        maxAge: COOKIE_MAX_AGE,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
      });

      return nextResponse;
    }

    // Check route-specific permissions
    const requiredPermissions = ROUTE_PERMISSIONS[pathname as keyof typeof ROUTE_PERMISSIONS];
    if (
      requiredPermissions?.length &&
      !requiredPermissions.some((p) => userPermissions.includes(p))
    ) {
      return NextResponse.redirect(new URL('/', req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: () => true,
    },
  }
);

export const config = {
  matcher: ['/((?!api/|_next/static|_next/image|favicon.ico|$).*)'],
};
