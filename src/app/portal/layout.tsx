import React from 'react';
import { Layout } from './components/common/Layout';

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  return <Layout>{children}</Layout>;
}
