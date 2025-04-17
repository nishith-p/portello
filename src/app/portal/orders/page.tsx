'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { IconAlertCircle, IconShoppingBag } from '@tabler/icons-react';
import { Alert, Button, Center, Container, Loader, Stack, Text, Title } from '@mantine/core';
import { useOrderHooks } from '@/lib/store/orders/hooks';
import { Order } from '@/lib/store/types';
import { OrderDetailsModal } from './(components)/order-details-modal';
import { OrdersTable } from './(components)/orders-table';

export default function OrdersPage() {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [modalOpened, setModalOpened] = useState<boolean>(false);
  const router = useRouter();

  const { useUserOrders } = useOrderHooks();
  const { data: orders, isLoading, error } = useUserOrders();

  // Handle row click
  const handleOrderClick = (order: Order): void => {
    setSelectedOrder(order);
    setModalOpened(true);
  };

  // Close modal
  const closeModal = (): void => {
    setModalOpened(false);
  };

  // Navigate to store
  const handleGoToStore = (): void => {
    router.push('/portal/store');
  };

  // Render loading state
  if (isLoading) {
    return (
      <Container fluid p="md">
        <Center h="50vh">
          <Loader size="lg" />
        </Center>
      </Container>
    );
  }

  // Render error state
  if (error) {
    return (
      <Container fluid p="md">
        <Alert icon={<IconAlertCircle size={16} />} title="Error" color="red">
          {error instanceof Error
            ? error.message
            : 'Failed to load orders. Please try again later.'}
        </Alert>
      </Container>
    );
  }

  // Render empty state
  if (!orders || orders.length === 0) {
    return (
      <Container fluid p="md">
        <Stack gap="lg">
          <Title order={2} c="gray.8" fz={{ base: 'h3', sm: 'h2' }}>
            Orders
          </Title>

          <Center py="xl">
            <Stack align="center" gap="md" style={{ maxWidth: 400 }}>
              <IconShoppingBag size={48} color="var(--mantine-color-gray-5)" />
              <Text fw={600} fz="lg" ta="center">
                No orders found
              </Text>
              <Text c="dimmed" ta="center">
                You haven't placed any orders yet. Visit our store to find something you'll love.
              </Text>
              <Button onClick={handleGoToStore} mt="md">
                Browse Store
              </Button>
            </Stack>
          </Center>
        </Stack>
      </Container>
    );
  }

  return (
    <Container fluid p="md">
      <Stack gap="lg">
        <Title order={2} c="gray.8" fz={{ base: 'h3', sm: 'h2' }}>
          Orders
        </Title>

        <Text c="dimmed" fz={{ base: 'sm', sm: 'md' }}>
          Show the Order ID to the DX Team to pay and collect your order.
        </Text>

        <OrdersTable orders={orders} onOrderClick={handleOrderClick} />
      </Stack>

      <OrderDetailsModal order={selectedOrder} opened={modalOpened} onClose={closeModal} />
    </Container>
  );
}
