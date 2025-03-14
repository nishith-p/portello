'use client';

import { IconHeart, IconPlus, IconSearch, IconShoppingCart, IconUser } from '@tabler/icons-react';
import {
  ActionIcon,
  Badge,
  Box,
  Burger,
  Button,
  Divider,
  Flex,
  Group,
  Popover,
  rem,
  Text,
  TextInput,
  useMantineTheme,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useCart } from '../hooks/useCart';
import { useRouter } from 'next/navigation';

interface HeaderProps {
  opened: boolean;
  toggle: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  isAdmin: boolean;
}

export default function Header({
  opened,
  toggle,
  searchQuery,
  setSearchQuery,
  isAdmin,
}: HeaderProps) {
  const theme = useMantineTheme();
  const [cartOpened, { toggle: toggleCart, close: closeCart }] = useDisclosure(false);
  const { cart, totalPrice } = useCart();
  const router = useRouter();

  return (
    <Flex h="100%" px="md" align="center" justify="right">
      <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />

      <TextInput
        placeholder="Search products..."
        leftSection={<IconSearch size={16} />}
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.currentTarget.value)}
        style={{ flex: 1, maxWidth: 400 }}
        mx="md"
      />

      <Group>
        <ActionIcon variant="subtle" color="gray" size="lg">
          <IconHeart style={{ width: rem(22), height: rem(22) }} />
        </ActionIcon>

        {isAdmin ? (
          <Button
          leftSection={<IconPlus size={18} />}
          variant="filled"
          color="blue"
          onClick={() => router.push("/store/addProduct")}
        >
          Add Product
        </Button>
        ) : (
          <Popover
            width={300}
            position="bottom-end"
            shadow="md"
            opened={cartOpened}
            onChange={toggleCart}
          >
            <Popover.Target>
              <ActionIcon
                variant="subtle"
                color="gray"
                size="lg"
                onClick={toggleCart}
                pos="relative"
              >
                <IconShoppingCart style={{ width: rem(22), height: rem(22) }} />
                {cart.length > 0 && (
                  <Badge
                    color="red"
                    size="xs"
                    variant="filled"
                    style={{
                      position: 'absolute',
                      top: -5,
                      right: -5,
                    }}
                  >
                    {cart.length}
                  </Badge>
                )}
              </ActionIcon>
            </Popover.Target>

            <Popover.Dropdown>
              <Text fw={500} mb="xs">
                Your Cart
              </Text>
              <Divider mb="sm" />

              {cart.length === 0 ? (
                <Text c="dimmed" ta="center" py="md">
                  Your cart is empty
                </Text>
              ) : (
                <>
                  <Box mah={250} style={{ overflowY: 'auto' }}>
                    {cart.map((item) => (
                      <Flex key={item.id} mb="xs" align="center" justify="space-between">
                        <Text size="sm" lineClamp={1} style={{ flex: 1 }}>
                          {item.name}
                        </Text>
                        <Text size="sm" fw={500} ml="md">
                          ${item.price} × {item.quantity}
                        </Text>
                      </Flex>
                    ))}
                  </Box>

                  <Divider my="sm" />

                  <Flex justify="space-between" align="center" mb="md">
                    <Text fw={500}>Total:</Text>
                    <Text fw={700}>${totalPrice.toFixed(2)}</Text>
                  </Flex>

                  <Button fullWidth>Checkout</Button>
                </>
              )}
            </Popover.Dropdown>
          </Popover>
        )}
      </Group>
    </Flex>
  );
}
