'use client';

import { useEffect } from 'react';
import * as Sentry from '@sentry/nextjs';
import { Center } from '@mantine/core';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <div>
      <Center h="100vh">
        <h2>Something went wrong!</h2>
      </Center>
    </div>
  );
}
