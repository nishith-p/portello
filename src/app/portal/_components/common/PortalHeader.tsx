import { LogoutLink } from '@kinde-oss/kinde-auth-nextjs/components';
import { Burger, Button, Flex, Image } from '@mantine/core';

type PortalHeaderProps = {
  opened: boolean;
  toggle: () => void;
};

export const PortalHeader = ({ opened, toggle }: PortalHeaderProps) => {
  return (
    <Flex justify="space-between" align="center" h="100%" px="md">
      <Flex align="center" gap="md">
        <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
        <Image
          h={24}
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/Bluesky_Logo.svg/600px-Bluesky_Logo.svg.png"
        />
      </Flex>
      <div>
        <Button variant="outline" size="xs" component={LogoutLink}>
          Logout
        </Button>
      </div>
    </Flex>
  );
};
