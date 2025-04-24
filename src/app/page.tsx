// app/page.tsx - Server Component
import { Metadata } from 'next';
import ClientHomePage from './home-client';

export const metadata: Metadata = {
  title: 'Discover | IC 2025',
};

export default function HomePage() {
  return <ClientHomePage />;
}