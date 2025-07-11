'use client';

import React, { useState } from 'react';
import { IconAlertCircle, IconDownload, IconRefresh } from '@tabler/icons-react';
import {
  Alert,
  Button,
  Center,
  Container,
  Group,
  Loader,
  Paper,
  Stack,
  Title,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useOrderHooks } from '@/lib/store/orders/hooks';
import { Order, OrderStatus } from '@/lib/store/types';
import { exportToCsv, formatDate } from '@/lib/utils';
import { OrderDetailModal, OrderPagination, OrderSearch, OrderTable } from './(components)';

interface OrderSearchParams {
  search?: string;
  status?: OrderStatus;
  limit: number;
  offset: number;
}

export default function AdminOrdersPage() {
  const [searchParams, setSearchParams] = useState<OrderSearchParams>({
    limit: 10,
    offset: 0,
  });

  // State for quick search input
  const [searchInput, setSearchInput] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<OrderStatus | undefined>(undefined);

  // State for order details modal
  const [opened, { open, close }] = useDisclosure(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Fetch orders
  const { useAllOrders, useUpdateOrderStatus } = useOrderHooks();
  const { data: allOrders, isLoading, error, refetch } = useAllOrders();
  const updateStatusMutation = useUpdateOrderStatus();

  // Filtered orders based on search params
  const filteredOrders = React.useMemo(() => {
    if (!allOrders) {
      return [];
    }

    let result = [...allOrders];

    // Filter by search input (order ID or user ID)
    if (searchInput.trim()) {
      const term = searchInput.toLowerCase();
      result = result.filter(
        (order) =>
          order.id.toLowerCase().includes(term) || order.user_id.toLowerCase().includes(term)
      );
    }

    // Filter by status
    if (statusFilter) {
      result = result.filter((order) => order.status === statusFilter);
    }

    return result;
  }, [allOrders, searchInput, statusFilter]);

  // Paginated orders
  const paginatedOrders = React.useMemo(() => {
    return filteredOrders.slice(searchParams.offset, searchParams.offset + searchParams.limit);
  }, [filteredOrders, searchParams.offset, searchParams.limit]);

  // Handle search form submission
  const handleSearch = (): void => {
    // Reset pagination when searching
    setSearchParams((prev) => ({
      ...prev,
      offset: 0,
    }));
  };

  // View order details
  const handleViewOrder = (order: Order): void => {
    setSelectedOrder(order);
    open();
  };

  // Update order status
  const handleUpdateStatus = (orderId: string, status: OrderStatus): void => {
    updateStatusMutation.mutate(
      {
        orderId,
        status,
      },
      {
        onSuccess: (updatedOrder) => {
          // Update the selected order if it's currently being viewed
          if (selectedOrder && selectedOrder.id === orderId) {
            setSelectedOrder(updatedOrder);
          }
          refetch();
        },
      }
    );
  };

  // Handle pagination
  const handlePageChange = (newOffset: number): void => {
    setSearchParams((prev) => ({
      ...prev,
      offset: newOffset,
    }));
  };

  // Handle exporting to csv
  const handleExportOrders = () => {
    if (!allOrders) return;

    // Format date and time separately
    const formatDatePart = (dateString?: string): string => {
      if (!dateString) return 'N/A';
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: '2-digit',
      }).replace(',', ''); 
    };

    const formatTimePart = (dateString?: string): string => {
      if (!dateString) return 'N/A';
      return new Date(dateString).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      });
    };

    // Prepare the CSV data with separate date and time columns
    const csvData = allOrders.map((order) => ({
      'Order ID': order.id,
      'Customer ID': order.user_id,
      Status: order.status,
      'Total Amount': order.total_amount,
      Date: formatDatePart(order.created_at),
      Time: formatTimePart(order.created_at),
      'Item Count': order.items?.length || 0,
      Items:
        order.items
          ?.map((item) => `${item.name} (${item.item_code}) - Qty: ${item.quantity} - Size: ${item.size}`)
          .join('; ') || 'N/A',
    }));

    exportToCsv('orders_export.csv', csvData);
  };

  return (
    <Container fluid p="md">
      <Stack gap="lg">
        <Group justify="space-between">
          <Title order={2} c="gray.8">
            Order Management
          </Title>
          <Group justify="space-between">
            <Button
              leftSection={<IconDownload size={16} />}
              variant="outline"
              onClick={handleExportOrders}
              disabled={isLoading || !allOrders}
            >
              Export to CSV
            </Button>
            <Button
              leftSection={<IconRefresh size={16} />}
              variant="primary"
              onClick={() => refetch()}
            >
              Refresh
            </Button>
          </Group>
        </Group>

        <Paper p="md" radius="md" withBorder>
          <OrderSearch
            searchInput={searchInput}
            setSearchInputAction={setSearchInput}
            statusFilterAction={statusFilter}
            setStatusFilterAction={setStatusFilter}
            onSearchAction={handleSearch}
          />

          {isLoading ? (
            <Center my="xl">
              <Loader size="md" />
            </Center>
          ) : error ? (
            <Alert icon={<IconAlertCircle size={16} />} title="Error loading orders" color="red">
              {error.message}
            </Alert>
          ) : (
            <>
              <OrderTable orders={paginatedOrders} onViewOrderAction={handleViewOrder} />

              <OrderPagination
                currentOffset={searchParams.offset}
                limit={searchParams.limit}
                total={filteredOrders.length}
                onPageChange={handlePageChange}
              />
            </>
          )}
        </Paper>
      </Stack>

      <OrderDetailModal
        opened={opened}
        onClose={close}
        order={selectedOrder}
        onUpdateStatus={handleUpdateStatus}
        isUpdating={updateStatusMutation.isPending}
      />
    </Container>
  );
}
