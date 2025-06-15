'use client';

import { useState } from 'react';
import { IconPlus, IconArrowUp, IconArrowDown } from '@tabler/icons-react';
import { Badge, Button, Card, Group, Paper, Stack, Table, Text, ThemeIcon } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import type { CreditTransaction } from '@/lib/wallet/types';
import {
  formatCreditAmount,
  formatTransactionDate,
  getTransactionStatusColor,
  getTransactionDescription,
} from '../(utils)/wallet-utils';
import { CreditTransactionDetailsModal } from './credit-transaction-modal';
import CreditTransactionsPagination from './credit-transaction-pagination';

interface CreditTransactionsTableProps {
  transactions: CreditTransaction[];
  userId?: string;
  onTransactionClick?: (transaction: CreditTransaction) => void;
  currentOffset?: number;
  limit?: number;
  total?: number;
  onPageChangeAction?: (newOffset: number) => void;
}

export const CreditTransactionsTable = ({
  transactions,
  userId,
  onTransactionClick,
  currentOffset = 0,
  limit = 10,
  total = 0,
  onPageChangeAction,
}: CreditTransactionsTableProps) => {
  const isMobile = useMediaQuery('(max-width: 768px)');

  const [selectedTransaction, setSelectedTransaction] = useState<CreditTransaction | null>(null);
  const [modalOpened, setModalOpened] = useState(false);

  const handleTransactionClick = (transaction: CreditTransaction) => {
    setSelectedTransaction(transaction);
    setModalOpened(true);
    onTransactionClick?.(transaction);
  };

  const handleCloseModal = () => {
    setModalOpened(false);
    setSelectedTransaction(null);
  };

  const renderShortName = (id: string | null, name: string | null | undefined) => {
    if (!id) return 'IC Admin';
    if (name) return name;
    return `${id.substring(0, 8)}...`;
  };

  const getTransactionIcon = (transaction: CreditTransaction) => {
    if (!userId) return <IconPlus size={14} />;
    
    if (transaction.to_id === userId) {
      return <IconArrowUp size={14} />;
    }
    return <IconArrowDown size={14} />;
  };

  const getTransactionColor = (transaction: CreditTransaction) => {
    if (!userId) return "green";
    return transaction.to_id === userId ? "green" : "red";
  };

  if (isMobile) {
    return (
      <Stack>
        {transactions.length === 0 ? (
          <Paper p="md" withBorder radius="md">
            <Text ta="center" c="dimmed">
              No credit transactions found
            </Text>
          </Paper>
        ) : (
          transactions.map((transaction) => {
            const amountColor = getTransactionColor(transaction);
            const transactionIcon = getTransactionIcon(transaction);
            const description = getTransactionDescription(transaction, userId);

            return (
              <Card key={transaction.payment_id} shadow="sm" padding="md" radius="md" withBorder>
                <Stack gap="xs">
                  <Group justify="space-between">
                    <Group gap="xs">
                      <ThemeIcon color={amountColor} variant="light" size="sm">
                        {transactionIcon}
                      </ThemeIcon>
                      <Text fw={500} size="sm">
                        {description}
                      </Text>
                    </Group>
                    <Text size="sm" fw={600} c={amountColor}>
                      {userId ? formatCreditAmount(transaction.amount, userId, transaction.from_id, transaction.to_id) : `+${transaction.amount.toFixed(2)}`}
                    </Text>
                  </Group>

                  <Group justify="space-between">
                    <Text fw={500} size="sm">
                      Transaction ID
                    </Text>
                    <Text size="sm" c="dimmed">
                      {renderShortName(transaction.payment_id, null)}
                    </Text>
                  </Group>

                  <Group justify="space-between">
                    <Text fw={500} size="sm">
                      Date
                    </Text>
                    <Text size="sm" c="dimmed">
                      {formatTransactionDate(transaction.created_at)}
                    </Text>
                  </Group>

                  <Group justify="space-between">
                    <Text fw={500} size="sm">
                      Status
                    </Text>
                    <Badge color={getTransactionStatusColor(transaction.status)} variant="light">
                      {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                    </Badge>
                  </Group>

                  {onTransactionClick && (
                    <Button
                      fullWidth
                      mt="sm"
                      variant="light"
                      onClick={() => handleTransactionClick(transaction)}
                    >
                      View Details
                    </Button>
                  )}
                </Stack>
              </Card>
            );
          })
        )}
        {total > 0 && (
          <CreditTransactionsPagination
            currentOffset={currentOffset}
            limit={limit}
            total={total}
            onPageChangeAction={onPageChangeAction}
          />
        )}
      </Stack>
    );
  }

  // Desktop Table View
  return (
    <>
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
            <Table.Th>Type</Table.Th>
            <Table.Th>Transaction ID</Table.Th>
            <Table.Th>Date</Table.Th>
            <Table.Th>Amount</Table.Th>
            <Table.Th>Status</Table.Th>
            <Table.Th>From - To</Table.Th>
            {onTransactionClick && <Table.Th>Action</Table.Th>}
          </Table.Tr>
        </Table.Thead>

        <Table.Tbody>
          {transactions.length === 0 ? (
            <Table.Tr>
              <Table.Td colSpan={onTransactionClick ? 7 : 6}>
                <Text ta="center" c="dimmed" py="md">
                  No credit transactions found
                </Text>
              </Table.Td>
            </Table.Tr>
          ) : (
            transactions.map((transaction) => {
              const amountColor = getTransactionColor(transaction);
              const description = getTransactionDescription(transaction, userId);

              return (
                <Table.Tr
                  key={transaction.payment_id}
                  onClick={() => handleTransactionClick(transaction)}
                  style={{ cursor: onTransactionClick ? 'pointer' : 'default' }}
                >
                  <Table.Td>
                    <Text size="sm" fw={500}>
                      {description}
                    </Text>
                  </Table.Td>
                  <Table.Td>
                    <Text size="sm" fw={500}>
                      {renderShortName(transaction.payment_id, null)}
                    </Text>
                  </Table.Td>
                  <Table.Td>
                    <Text size="sm">{formatTransactionDate(transaction.created_at)}</Text>
                  </Table.Td>
                  <Table.Td>
                    <Text size="sm" fw={600} c={amountColor}>
                      {userId ? formatCreditAmount(transaction.amount, userId, transaction.from_id, transaction.to_id) : `+${transaction.amount.toFixed(2)}`}
                    </Text>
                  </Table.Td>
                  <Table.Td>
                    <Badge color={getTransactionStatusColor(transaction.status)} variant="light">
                      {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                    </Badge>
                  </Table.Td>
                  <Table.Td>
                    <Text size="sm" c="dimmed">
                      {renderShortName(transaction.from_id, transaction.from_name)} -{' '}
                      {renderShortName(transaction.to_id, transaction.to_name)}
                    </Text>
                  </Table.Td>
                  {onTransactionClick && (
                    <Table.Td>
                      <Button size="xs">
                        View
                      </Button>
                    </Table.Td>
                  )}
                </Table.Tr>
              );
            })
          )}
        </Table.Tbody>
      </Table>
      {total > 0 && (
        <CreditTransactionsPagination
          currentOffset={currentOffset}
          limit={limit}
          total={total}
          onPageChangeAction={onPageChangeAction}
        />
      )}
      <CreditTransactionDetailsModal
        opened={modalOpened}
        onCloseAction={handleCloseModal}
        transaction={selectedTransaction}
        userId={userId}
      />
    </>
  );
};
