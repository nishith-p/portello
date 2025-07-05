import { useState } from 'react';
import {
  Alert,
  Button,
  Container,
  Divider,
  Group,
  Modal,
  NumberInput,
  Paper,
  Stack,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import { CreditTransactionsTable } from '@/app/(portal)/wallet/(components)/credit-table';
import { formatCredit } from '@/app/(portal)/wallet/(utils)/wallet-utils';
import { useUpdateUserCredit } from '@/lib/wallet/hooks';
import { CreditTransaction, WalletData } from '@/lib/wallet/types';

interface UpdateCreditModalProps {
  opened: boolean;
  onClose: () => void;
  userId: string;
  walletData: WalletData | null;
  onSuccess?: () => void;
}

export function UpdateCreditModal({
  opened,
  onClose,
  userId,
  walletData,
  onSuccess,
}: UpdateCreditModalProps) {
  const [amount, setAmount] = useState<number>(0);
  const [reason, setReason] = useState('');
  const { updateCredit, isLoading, error } = useUpdateUserCredit();

  const handleAmountChange = (value: number | string) => {
    // Convert string to number or use the number directly
    setAmount(typeof value === 'string' ? parseFloat(value) || 0 : value);
  };

  const handleSubmit = async () => {
    const success = await updateCredit(userId, amount, reason);
    if (success) {
      onClose();
      setAmount(0);
      setReason('');
      onSuccess?.();
    }
  };

  const [pagination, setPagination] = useState({
    offset: 0,
    limit: 3,
  });

  const handleTransactionClick = (transaction: CreditTransaction) => {
    console.log('Transaction clicked:', transaction);
  };

  const handlePageChange = (newOffset: number) => {
    setPagination((prev) => ({ ...prev, offset: newOffset }));
  };

  const paginatedTransactions =
    walletData?.transactions?.slice(pagination.offset, pagination.offset + pagination.limit) || [];

  return (
    <Modal opened={opened} onClose={onClose} size="xl">
      <Container>
        <Title order={2}>Update User Credit</Title>
        <Stack>
          <NumberInput
            label="Amount to add/subtract"
            description="Use positive number to add, negative to subtract"
            value={amount}
            onChange={handleAmountChange}
            decimalScale={2}
            required
          />

          <TextInput
            label="Reason (optional)"
            value={reason}
            onChange={(e) => setReason(e.currentTarget.value)}
            placeholder="E.g. Conference fee reimbursement"
          />

          {walletData && (
            <>
              <Paper withBorder p="md">
                <Group justify="space-between">
                  <Text fw={500}>Current Balance:</Text>
                  <Text fw={700} size="lg">
                    {formatCredit(walletData.wallet.credit)}
                  </Text>
                </Group>
              </Paper>

              <Group justify="flex-end" mt="md">
                <Button variant="outline" onClick={onClose}>
                  Cancel
                </Button>
                <Button onClick={handleSubmit} loading={isLoading} disabled={amount === 0}>
                  Update Balance
                </Button>
              </Group>

              <Divider />

              <Stack gap="md">
                <Group justify="space-between">
                  <Title order={3}>Transaction History</Title>
                  <Text size="sm" c="dimmed">
                    {walletData.transactions.length} transactions
                  </Text>
                </Group>

                <CreditTransactionsTable
                  transactions={paginatedTransactions}
                  userId={walletData?.userId}
                  onTransactionClick={handleTransactionClick}
                  currentOffset={pagination.offset}
                  limit={pagination.limit}
                  total={walletData?.transactions.length || 0}
                  onPageChangeAction={handlePageChange}
                />
              </Stack>
            </>
          )}

          {error && (
            <Alert color="red" title="Error">
              {error}
            </Alert>
          )}
        </Stack>
      </Container>
    </Modal>
  );
}
