'use client';

import { useState } from 'react';
import { IconAlertCircle } from '@tabler/icons-react';
import { useQuery } from '@tanstack/react-query';
import {
  Alert,
  Container,
  Flex,
  Loader,
  Stack,
  Text,
  Title,
} from '@mantine/core';

import { OrdersTable } from './components/OrdersTable';
import { OrderDetailsModal } from './components/OrderDetailsModal';
import { Order } from './types';

const OrdersPage = () => {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [modalOpened, setModalOpened] = useState<boolean>(false);

  // Fetch orders data
  const {
    data: orders,
    isLoading,
    error,
  } = useQuery<Order[], Error>({
    queryKey: ['orders'],
    queryFn: async () => {
      const response = await fetch('/api/store/orders/my');
      if (!response.ok) {
        throw new Error('Failed to fetch orders');
      }
      return response.json();
    },
  });

  // Handle row click
  const handleOrderClick = (order: Order): void => {
    setSelectedOrder(order);
    setModalOpened(true);
  };

  // Close modal
  const closeModal = (): void => {
    setModalOpened(false);
  };

  // Render loading state
  if (isLoading) {
    return (
      <Container fluid p="md" style={{ minHeight: '100vh' }}>
        <Flex justify="center" align="center" h="50vh">
          <Loader size="lg" />
        </Flex>
      </Container>
    );
  }

  // Render error state
  if (error) {
    return (
      <Container fluid p="md" style={{ minHeight: '100vh' }}>
        <Alert icon={<IconAlertCircle size={16} />} title="Error" color="red">
          Failed to load orders. Please try again later.
        </Alert>
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

        {orders && orders.length > 0 ? (
          <OrdersTable orders={orders} onOrderClick={handleOrderClick} />
        ) : (
          <Alert title="No orders found" color="gray">
            You haven't placed any orders yet. Visit our store to shop.
          </Alert>
        )}
      </Stack>

      <OrderDetailsModal
        order={selectedOrder}
        opened={modalOpened}
        onClose={closeModal}
      />
    </Container>
  );
};

export default OrdersPage;