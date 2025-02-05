'use client';

import { useEffect } from 'react';
import NextError from 'next/error';
import * as Sentry from '@sentry/nextjs';

export default function GlobalError({ error }: { error: Error & { digest?: string } }) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    // eslint-disable-next-line jsx-a11y/html-has-lang
    <html>
      <body>
        <NextError statusCode={0} />
      </body>
    </html>
  );
}
