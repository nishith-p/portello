'use client';

import { useState } from 'react';
import { IconCreditCard, IconRefresh } from '@tabler/icons-react';
import {
  Alert,
  Button,
  Card,
  Container,
  Divider,
  Grid,
  Group,
  Loader,
  Paper,
  Stack,
  Table,
  Text,
  ThemeIcon,
  Title,
} from '@mantine/core';
import { useWallet } from '@/lib/wallet/hooks';
import type { CreditTransaction } from '@/lib/wallet/types';
import { CreditTransactionsTable } from './(components)/credit-table';
import { formatCredit } from './(utils)/wallet-utils';

export default function WalletPage() {
  const { walletData, loading, error, refetch } = useWallet();
  const [pagination, setPagination] = useState({
    offset: 0,
    limit: 10,
  });

  const handleTransactionClick = (transaction: CreditTransaction) => {
    console.log('Transaction clicked:', transaction);
  };

  const handleRefresh = () => {
    refetch();
  };

  const handlePageChange = (newOffset: number) => {
    setPagination(prev => ({ ...prev, offset: newOffset }));
  };

  if (loading) {
    return (
      <Container size="lg" py="xl">
        <Group justify="center">
          <Loader size="lg" />
          <Text>Loading wallet data...</Text>
        </Group>
      </Container>
    );
  }

  if (error) {
    return (
      <Container size="lg" py="xl">
        <Alert color="red" title="Error loading wallet data">
          {error}
          <Button mt="sm" onClick={handleRefresh}>
            Try Again
          </Button>
        </Alert>
      </Container>
    );
  }

  // For client-side pagination (if all transactions are loaded at once)
  const paginatedTransactions = walletData?.transactions?.slice(
    pagination.offset,
    pagination.offset + pagination.limit
  ) || [];

  return (
    <Container size="lg" py="xl">
      <Stack gap="xl">
        {/* Header */}
        <Group justify="space-between">
          <Group gap="sm">
            <Title order={1}>My Wallet</Title>
          </Group>
          <Button leftSection={<IconRefresh size={16} />} variant="light" onClick={handleRefresh}>
            Refresh
          </Button>
        </Group>

        {/* Wallet Overview Cards */}
        <Grid>
          <Grid.Col span={{ base: 12, md: 6 }}>
            <Card shadow="sm" padding="lg" radius="md" withBorder>
              <Group justify="space-between" mb="xs">
                <Text size="sm" c="dimmed" fw={500}>
                  Current Balance
                </Text>
                <ThemeIcon color="blue" variant="light">
                  <IconCreditCard size={16} />
                </ThemeIcon>
              </Group>
              <Text size="xl" fw={700} c="blue">
                {formatCredit(walletData?.wallet.credit || 0)}
              </Text>
            </Card>
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 6 }}>
            <Card shadow="sm" padding="lg" radius="md" withBorder>
              <Table
                striped
                highlightOnHover
                withTableBorder
                bg="white"
                horizontalSpacing="md"
                verticalSpacing="sm"
                fz="sm"
              >
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>Currency</Table.Th>
                    <Table.Th>Base Unit</Table.Th>
                    <Table.Th>Equivalent Credit Amount</Table.Th>
                  </Table.Tr>
                </Table.Thead>

                <Table.Tbody>
                  <Table.Tr>
                    <Table.Td>EUR</Table.Td>
                    <Table.Td>1</Table.Td>
                    <Table.Td>1000</Table.Td>
                  </Table.Tr>
                  <Table.Tr>
                    <Table.Td>USD</Table.Td>
                    <Table.Td>1</Table.Td>
                    <Table.Td>850</Table.Td>
                  </Table.Tr>
                  <Table.Tr>
                    <Table.Td>CAD</Table.Td>
                    <Table.Td>1</Table.Td>
                    <Table.Td>630</Table.Td>
                  </Table.Tr>
                  <Table.Tr>
                    <Table.Td>LKR</Table.Td>
                    <Table.Td>100</Table.Td>
                    <Table.Td>300</Table.Td>
                  </Table.Tr>
                </Table.Tbody>
              </Table>
            </Card>
          </Grid.Col>
        </Grid>

        <Divider />

        {/* Transaction History */}
        <Stack gap="md">
          <Group justify="space-between">
            <Title order={2}>Credit Transaction History</Title>
            <Text size="sm" c="dimmed">
              {walletData?.transactions.length || 0} total transactions
            </Text>
          </Group>

          <Paper shadow="xs" radius="md" p="md">
            <CreditTransactionsTable
              transactions={paginatedTransactions}
              userId={walletData?.userId}
              onTransactionClick={handleTransactionClick}
              currentOffset={pagination.offset}
              limit={pagination.limit}
              total={walletData?.transactions.length || 0}
              onPageChangeAction={handlePageChange}
            />
          </Paper>
        </Stack>
      </Stack>
    </Container>
  );
}
