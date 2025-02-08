import React from 'react';
import { LayoutShell } from '@/app/portal/components/common/LayoutShell';

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  return <LayoutShell>{children}</LayoutShell>;
}
