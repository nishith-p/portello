import { LogoutLink } from '@kinde-oss/kinde-auth-nextjs/components';
import { Burger, Button, Flex, Image, ActionIcon, Badge, Group } from '@mantine/core';
import { IconShoppingCart } from '@tabler/icons-react';
import { useCart } from '@/context';

type PortalHeaderProps = {
  opened: boolean;
  toggle: () => void;
};

export const PortalHeader = ({ opened, toggle }: PortalHeaderProps): JSX.Element => {
  const { toggleCart, totalItems, clearCart } = useCart();

  // Handle logout - clear cart when user logs out
  const handleLogout = (): void => {
    clearCart();
  };

  return (
    <Flex justify="space-between" align="center" h="100%" px="md">
      <Flex align="center" gap="md">
        <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
        <Image
          h={24}
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/Bluesky_Logo.svg/600px-Bluesky_Logo.svg.png"
        />
      </Flex>
      <Group>
        <Flex align="center" pos="relative">
          <ActionIcon
            onClick={toggleCart}
            size="lg"
            variant="transparent"
            aria-label="Shopping Cart"
          >
            <IconShoppingCart size={20} />
            {totalItems > 0 && (
              <Badge
                color="blue"
                size="xs"
                radius="xl"
                pos="absolute"
                top={-5}
                right={-5}
              >
                {totalItems}
              </Badge>
            )}
          </ActionIcon>
        </Flex>
        <Button
          variant="outline"
          size="xs"
          component={LogoutLink}
          onClick={handleLogout}
        >
          Logout
        </Button>
      </Group>
    </Flex>
  );
};