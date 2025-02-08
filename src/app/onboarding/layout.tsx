import React from 'react';
import { Center } from '@mantine/core';

export default function OnboardingLayout({ children }: { children: React.ReactNode }) {
  return (
    <Center h="100vh" bg="var(--mantine-color-gray-0)">
      {children}
    </Center>
  );
}
