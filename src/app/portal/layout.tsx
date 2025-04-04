import React from 'react';
import { LayoutShell } from '@/components/layouts';

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  return <LayoutShell>{children}</LayoutShell>;
}