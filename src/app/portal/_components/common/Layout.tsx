import React from 'react';
import { LayoutShell } from './LayoutShell';

export const Layout = ({ children }: { children: React.ReactNode }) => {
  return <LayoutShell>{children}</LayoutShell>;
};
