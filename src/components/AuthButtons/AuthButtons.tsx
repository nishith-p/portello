'use client';

import { LoginLink, RegisterLink } from '@kinde-oss/kinde-auth-nextjs/components';
import { Button, Flex } from '@mantine/core';

export function AuthButtons() {
  return (
    <Flex
      direction={{ base: 'column', sm: 'row' }}
      gap={{ base: 'sm', sm: 'lg' }}
      justify={{ sm: 'center' }}
    >
      <LoginLink>
        <Button component="span">Login</Button>
      </LoginLink>
      <RegisterLink>
        <Button component="span">Register</Button>
      </RegisterLink>
    </Flex>
  );
}
