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
  ScrollArea,
  Stack,
  Text,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { isPackItem, useCart } from '@/context/cart';
import { useOrderHooks } from '@/lib/store/orders/hooks';
import { formatCurrency } from '@/lib/utils';
import { CartPackItemComponent } from './cart-items';

export const CartDrawer = () => {
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
  const { usePlaceOrder } = useOrderHooks();
  const placeOrderMutation = usePlaceOrder();
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
      await placeOrderMutation.mutateAsync({
        items: cartItems,
        total_amount: subtotal,
      });

      setTimeout(() => {
        clearCart();
        closeCart();
        router.push('/portal/orders');
        setIsPlacingOrder(false);
      }, 1000);
    } catch (error) {
      setIsPlacingOrder(false);
      notifications.show({
        title: 'Error',
        message:
          error instanceof Error ? error.message : 'Failed to place order. Please try again.',
        color: 'red',
      });
    }
  };

  // Render cart item based on type (regular or pack)
  const renderCartItem = (item: any, index: number) => {
    const isLastItem = index === cartItems.length - 1;

    // If it's a pack item, use the special component and pass the index
    if (isPackItem(item)) {
      return <CartPackItemComponent key={`pack_item_${index}`} item={item} index={index} />;
    }

    // Otherwise, render regular item
    return (
      <Box
        key={getItemKey(item.id, item.size, item.color)}
        p="sm"
        style={{
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
                  onClick={() => updateQuantity(item.id, item.quantity - 1, item.size, item.color)}
                  disabled={item.quantity <= 1}
                >
                  <IconMinus size={14} />
                </ActionIcon>

                <Text size="sm">{item.quantity}</Text>

                <ActionIcon
                  size="sm"
                  variant="subtle"
                  onClick={() => updateQuantity(item.id, item.quantity + 1, item.size, item.color)}
                >
                  <IconPlus size={14} />
                </ActionIcon>
              </Flex>

              <Text fw={500}>{formatCurrency(item.price * item.quantity)}</Text>
            </Flex>
          </Box>
        </Flex>
      </Box>
    );
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
        <Stack gap="lg" align="stretch" h="calc(100vh - 140px)">
          <ScrollArea h="calc(100% - 100px)" offsetScrollbars>
            <Stack gap={0}>{cartItems.map((item, index) => renderCartItem(item, index))}</Stack>
          </ScrollArea>

          <Box>
            <Divider my="sm" />
            <Box p="sm">
              <Flex justify="space-between" align="center" mb="md">
                <Text fw={600} size="lg">
                  Subtotal
                </Text>
                <Text fw={600} size="lg">
                  {formatCurrency(subtotal)}
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
          </Box>
        </Stack>
      )}
    </Drawer>
  );
};
