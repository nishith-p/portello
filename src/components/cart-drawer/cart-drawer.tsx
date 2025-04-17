import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { IconMinus, IconPlus, IconShoppingCart, IconTrash } from '@tabler/icons-react';
import {
  ActionIcon,
  Badge,
  Box,
  Button,
  Center,
  Divider,
  Drawer,
  Flex,
  Group,
  Image,
  Stack,
  Text,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { useCart } from '@/context';
import { hooks } from '@/lib/store/orders/hooks';

export const CartDrawer = (): JSX.Element => {
  const {
    cartItems,
    isCartOpen,
    closeCart,
    removeFromCart,
    updateQuantity,
    subtotal,
    getItemKey,
    clearCart,
  } = useCart();

  const router = useRouter();
  const { placeOrder, placeOrderMutation } = hooks();
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  const handleGoToStore = () => {
    closeCart();
    router.push('/portal/store');
  };

  const handlePlaceOrder = async () => {
    if (cartItems.length === 0) {
      notifications.show({
        title: 'Error',
        message: 'Your cart is empty',
        color: 'red',
      });
      return;
    }

    setIsPlacingOrder(true);

    try {
      // Place the order
      placeOrder(cartItems, subtotal);

      // Clear the cart after successful order placement

      // Navigate to orders page and close drawer
      setTimeout(() => {
        clearCart();
        closeCart();
        router.push('/portal/orders');
        setIsPlacingOrder(false);
      }, 3000);
    } catch (error) {
      setIsPlacingOrder(false);
      notifications.show({
        title: 'Error',
        message: 'Failed to place order. Please try again.',
        color: 'red',
      });
    }
  };

  return (
    <Drawer
      opened={isCartOpen}
      onClose={closeCart}
      title="Your Cart"
      position="right"
      padding="md"
      size="md"
    >
      {cartItems.length === 0 ? (
        <Stack align="center" justify="center" gap="lg" py="xl">
          <Center
            style={{
              width: 90,
              height: 90,
              borderRadius: '50%',
              backgroundColor: 'var(--mantine-color-gray-1)',
            }}
          >
            <IconShoppingCart size={42} color="var(--mantine-color-gray-5)" />
          </Center>

          <Stack gap="xs" align="center">
            <Text fw={600} size="lg" ta="center">
              Your cart is empty
            </Text>
            <Text c="dimmed" ta="center" size="sm" maw={300} mx="auto">
              Looks like you haven't added any items to your cart yet. Explore our collection and
              find something you'll love!
            </Text>
          </Stack>

          <Button onClick={handleGoToStore} mt="md" size="md">
            Browse Store
          </Button>
        </Stack>
      ) : (
        <Stack gap="lg" align="stretch">
          {cartItems.map((item, index) => {
            // Determine if this is the last item
            const isLastItem = index === cartItems.length - 1;

            return (
              <Box
                key={getItemKey(item.id, item.size, item.color)}
                p="sm"
                style={{
                  // Only apply the bottom border if it's not the last item
                  borderBottom: isLastItem ? 'none' : '1px solid var(--mantine-color-gray-2)',
                }}
              >
                <Flex justify="space-between" align="flex-start" gap="md">
                  {item.image && (
                    <Box
                      w={70}
                      h={70}
                      style={{
                        overflow: 'hidden',
                        borderRadius: 'var(--mantine-radius-sm)',
                        border: '1px solid var(--mantine-color-gray-3)',
                      }}
                    >
                      <Image src={item.image} alt={item.name} fit="cover" h={70} w={70} />
                    </Box>
                  )}

                  <Box style={{ flex: 1 }}>
                    <Flex justify="space-between" align="center" mb="xs">
                      <Text fw={500}>{item.name}</Text>
                      <ActionIcon
                        variant="subtle"
                        color="red"
                        onClick={() => removeFromCart(item.id, item.size, item.color)}
                      >
                        <IconTrash size={16} />
                      </ActionIcon>
                    </Flex>

                    {/* Display item variations */}
                    <Group gap="xs" mb="xs">
                      {item.size && (
                        <Badge size="sm" variant="outline">
                          Size: {item.size}
                        </Badge>
                      )}

                      {item.color && (
                        <Badge
                          size="sm"
                          variant="outline"
                          leftSection={
                            item.colorHex ? (
                              <div
                                style={{
                                  width: 10,
                                  height: 10,
                                  borderRadius: '50%',
                                  backgroundColor: item.colorHex,
                                  border: '1px solid rgba(0, 0, 0, 0.1)',
                                }}
                              />
                            ) : null
                          }
                        >
                          {item.color}
                        </Badge>
                      )}
                    </Group>

                    <Flex justify="space-between" align="center">
                      <Flex gap="xs" align="center">
                        <ActionIcon
                          size="sm"
                          variant="subtle"
                          onClick={() =>
                            updateQuantity(item.id, item.quantity - 1, item.size, item.color)
                          }
                          disabled={item.quantity <= 1}
                        >
                          <IconMinus size={14} />
                        </ActionIcon>

                        <Text size="sm">{item.quantity}</Text>

                        <ActionIcon
                          size="sm"
                          variant="subtle"
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1, item.size, item.color)
                          }
                        >
                          <IconPlus size={14} />
                        </ActionIcon>
                      </Flex>

                      <Text fw={500}>${(item.price * item.quantity).toFixed(2)}</Text>
                    </Flex>
                  </Box>
                </Flex>
              </Box>
            );
          })}

          <Divider my="sm" />

          <Box p="sm">
            <Flex justify="space-between" align="center" mb="md">
              <Text fw={600} size="lg">
                Subtotal
              </Text>
              <Text fw={600} size="lg">
                ${subtotal.toFixed(2)}
              </Text>
            </Flex>

            <Button
              fullWidth
              color="green"
              size="md"
              onClick={handlePlaceOrder}
              disabled={isPlacingOrder || placeOrderMutation.isPending || cartItems.length === 0}
              loading={isPlacingOrder || placeOrderMutation.isPending}
            >
              {isPlacingOrder || placeOrderMutation.isPending ? 'Processing...' : 'Place Order'}
            </Button>
          </Box>
        </Stack>
      )}
    </Drawer>
  );
};
