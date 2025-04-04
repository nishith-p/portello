'use client';

import NextError from 'next/error';

export default function GlobalError() {
  return (
    // eslint-disable-next-line jsx-a11y/html-has-lang
    <html>
      <body>
        <NextError statusCode={0} />
      </body>
    </html>
  );
}
