import React from 'react';
import { Center } from '@mantine/core';

type LayoutProps = {
  children: React.ReactNode;
};

export const Layout = ({ children }: LayoutProps) => {
  return (
    <>
      <Center h="100vh" bg="var(--mantine-color-gray-0)">
        {children}
      </Center>
    </>
  );
};
