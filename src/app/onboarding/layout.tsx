import React from 'react';
import { Layout } from './components/Layout';

export default function OnboardingLayout({ children }: { children: React.ReactNode }) {
  return <Layout>{children}</Layout>;
}
