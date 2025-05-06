'use client';

import React, { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { LayoutShell } from './(portal)/(components)';
import { LAYOUT_EXEMPT_ROUTES } from '@/config/auth';

export default function LayoutWrapper({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  const isExemptRoute = LAYOUT_EXEMPT_ROUTES.some(route =>
    pathname?.startsWith(route)
  );

  if (isExemptRoute) {
    return <>{children}</>;
  }

  return <LayoutShell>{children}</LayoutShell>;
}