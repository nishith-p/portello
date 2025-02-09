import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@kinde-oss/kinde-auth-nextjs/middleware';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { PUBLIC_ROUTES, ROUTE_PERMISSIONS } from '@/config/auth';
import { getUserProfile } from '@/lib/actions/user';

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

    // // Handle onboarding redirection
    // if (userPermissions.length === 0 && pathname !== '/onboarding') {
    //   return NextResponse.redirect(new URL('/onboarding', req.url));
    // }

    // Handle onboarding completion check
    if (pathname !== '/onboarding') {
      const onboardingComplete = req.cookies.get(ONBOARDING_COOKIE_NAME)?.value === 'true';

      if (!onboardingComplete) {
        const userProfile = await getUserProfile(user?.id);

        if (!userProfile) {
          return NextResponse.redirect(new URL('/onboarding', req.url));
        }

        const response = NextResponse.next();
        response.cookies.set(ONBOARDING_COOKIE_NAME, 'true', {
          maxAge: COOKIE_MAX_AGE,
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
        });

        return response;
      }
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
  matcher: ['/((?!api/auth|_next/static|_next/image|favicon.ico|$).*)'],
};
