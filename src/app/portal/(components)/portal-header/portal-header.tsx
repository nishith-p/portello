import { LogoutLink } from '@kinde-oss/kinde-auth-nextjs/components';
import { IconShoppingCart } from '@tabler/icons-react';
import { ActionIcon, Badge, Box, Burger, Button, Flex, Group, Image } from '@mantine/core';
import { useCart } from '@/context/cart';

type PortalHeaderProps = {
  opened: boolean;
  toggle: () => void;
};

export const PortalHeader = ({ opened, toggle }: PortalHeaderProps) => {
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
          h={32}
          src="https://ugfvgfyujpvclouvgfow.supabase.co/storage/v1/object/public/ic-portal/brand/IC_PORTAL_LOGO.png"
        />
      </Flex>
      <Group>
        <Box pos="relative" style={{ overflow: 'visible' }}>
          <ActionIcon
            onClick={toggleCart}
            size="lg"
            variant="transparent"
            aria-label="Shopping Cart"
          >
            <IconShoppingCart size={20} />
          </ActionIcon>
          {totalItems > 0 && (
            <Badge color="blue" size="xs" radius="xl" pos="absolute" top={-5} right={-5}>
              {totalItems}
            </Badge>
          )}
        </Box>
        <Button variant="outline" size="xs" component={LogoutLink} onClick={handleLogout}>
          Logout
        </Button>
      </Group>
    </Flex>
  );
};
