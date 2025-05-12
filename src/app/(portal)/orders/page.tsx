'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { IconAlertCircle, IconShoppingBag } from '@tabler/icons-react';
import { Alert, Button, Center, Container, Loader, Paper, Stack, Text, Title } from '@mantine/core';
import { OrderDetailsModal, OrdersTable  } from '@/app/(portal)/orders/(components)';
import { useOrderHooks } from '@/lib/store/orders/hooks';
import { Order } from '@/lib/store/types';

export default function OrdersPage() {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [modalOpened, setModalOpened] = useState<boolean>(false);
  const router = useRouter();

  const { useUserOrders } = useOrderHooks();
  const { data: orders, isLoading, error } = useUserOrders();

  const handleOrderClick = (order: Order): void => {
    setSelectedOrder(order);
    setModalOpened(true);
  };

  const closeModal = (): void => {
    setModalOpened(false);
  };

  const handleGoToStore = (): void => {
    router.push('/store');
  };

  if (isLoading) {
    return (
      <Container fluid p="md">
        <Center h="50vh">
          <Loader size="lg" />
        </Center>
      </Container>
    );
  }

  if (error) {
    return (
      <Container fluid p="md">
        <Alert icon={<IconAlertCircle size={16} />} title="Error" color="red">
          {error.message}
        </Alert>
      </Container>
    );
  }

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
          Great news! You can now pay for your orders securely online.
        </Text>

        <Paper p="md" radius="md" withBorder>
          <OrdersTable orders={orders} onOrderClickAction={handleOrderClick}/>
        </Paper>
      </Stack>

      <OrderDetailsModal order={selectedOrder} opened={modalOpened} onCloseAction={closeModal} />
    </Container>
  );
}
