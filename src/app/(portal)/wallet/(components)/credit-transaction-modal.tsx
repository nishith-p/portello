"use client"
import { Badge, Box, Button, Card, Divider, Grid, Group, Modal, Stack, Text, Tooltip, ThemeIcon } from "@mantine/core"
import { useMediaQuery } from "@mantine/hooks"
import { IconPlus, IconCalendar, IconUser, IconReceipt, IconArrowUp, IconArrowDown } from "@tabler/icons-react"
import type { CreditTransaction } from "@/lib/wallet/types"
import {
  formatTransactionDate,
  getTransactionStatusColor,
  formatCreditAmount,
  getTransactionStatusDescription,
  getTransactionDescription,
} from "../(utils)/wallet-utils"

interface CreditTransactionDetailsModalProps {
  opened: boolean
  onCloseAction: () => void
  transaction: CreditTransaction | null
  userId?: string
}

export function CreditTransactionDetailsModal({
  opened,
  onCloseAction,
  transaction,
  userId,
}: CreditTransactionDetailsModalProps) {
  const isMobile = useMediaQuery("(max-width: 768px)")

  if (!transaction) {
    return <></>
  }

  const renderUserName = (id: string | null, name: string | null | undefined) => {
    if (!id) return 'IC Admin';
    return name || `${id.substring(0, 8)}...`;
  };

  const getTransactionIcon = () => {
    if (!userId) return <IconPlus size={18} />;
    
    if (transaction.to_id === userId) {
      return <IconArrowUp size={18} />;
    }
    return <IconArrowDown size={18} />;
  };

  const getAmountColor = () => {
    if (!userId) return "green";
    return transaction.to_id === userId ? "green" : "red";
  };

  const amountColor = getAmountColor();
  const transactionIcon = getTransactionIcon();
  const description = userId ? getTransactionDescription(transaction, userId) : "Credit Transaction";

  return (
    <Modal
      opened={opened}
      onClose={onCloseAction}
      title={
        <Group gap="sm">
          <ThemeIcon color={amountColor} variant="light">
            {transactionIcon}
          </ThemeIcon>
          <Text fw={700} size="lg">
            {description}
          </Text>
        </Group>
      }
      size={isMobile ? "95%" : "lg"}
      centered
    >
      <Stack gap="md">
        {/* Transaction Information Card */}
        <Card withBorder padding="md">
          <Group gap="sm" mb="md">
            <IconReceipt size={20} />
            <Text fw={600}>Transaction Information</Text>
          </Group>

          <Stack gap="xs">
            {/* Transaction ID */}
            <Box py={5} px="sm" bg="gray.0" style={{ borderRadius: 4 }}>
              <Tooltip label="Click to copy" position="right">
                <Text
                  size="sm"
                  style={{ cursor: "pointer" }}
                  onClick={async () => {
                    await navigator.clipboard.writeText(transaction.payment_id)
                  }}
                >
                  <Text span fw={500}>
                    Transaction ID:{" "}
                  </Text>
                  {transaction.payment_id}
                </Text>
              </Tooltip>
            </Box>

            {/* Date and Status Grid */}
            <Grid gutter="xs">
              <Grid.Col span={isMobile ? 12 : 6}>
                <Box py={5} px="sm">
                  <Group gap="xs">
                    <IconCalendar size={16} />
                    <Text size="sm">
                      <Text span fw={500}>
                        Date:{" "}
                      </Text>
                      {formatTransactionDate(transaction.created_at)}
                    </Text>
                  </Group>
                </Box>
              </Grid.Col>

              <Grid.Col span={isMobile ? 12 : 6}>
                <Box py={5} px="sm">
                  <Group gap="xs">
                    <Text size="sm" fw={500}>
                      Status:
                    </Text>
                    <Badge color={getTransactionStatusColor(transaction.status)} variant="light">
                      {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                    </Badge>
                  </Group>
                </Box>
              </Grid.Col>
            </Grid>

            {/* Amount */}
            <Box py={5} px="sm" bg={`${amountColor}.0`} style={{ borderRadius: 4 }}>
              <Group justify="space-between">
                <Group gap="xs">
                  <ThemeIcon color={amountColor} variant="light" size="sm">
                    {transactionIcon}
                  </ThemeIcon>
                  <Text size="sm" fw={500}>
                    Amount:
                  </Text>
                </Group>
                <Text fw={700} size="lg" c={amountColor}>
                  {userId ? formatCreditAmount(transaction.amount, userId, transaction.from_id, transaction.to_id) : `+${transaction.amount.toFixed(2)}`}
                </Text>
              </Group>
            </Box>

            {/* Added By */}
            <Box py={5} px="sm">
              <Group gap="xs">
                <IconUser size={16} />
                <Text size="sm">
                  <Text span fw={500}>
                    {transaction.from_id === userId ? "Sent From:" : "Added By:"}{" "}
                  </Text>
                  {renderUserName(transaction.from_id, transaction.from_name)}
                </Text>
              </Group>
            </Box>

            {/* Sent To */}
            <Box py={5} px="sm">
              <Group gap="xs">
                <IconUser size={16} />
                <Text size="sm">
                  <Text span fw={500}>
                    {transaction.to_id === userId ? "Received By:" : "Sent To:"}{" "}
                  </Text>
                  {renderUserName(transaction.to_id, transaction.to_name)}
                </Text>
              </Group>
            </Box>
          </Stack>
        </Card>

        {/* Transaction Summary */}
        <Card withBorder padding="md" bg="gray.0">
          <Divider mb="md" label="Transaction Summary" labelPosition="center" />

          <Stack gap="sm">
            <Group justify="space-between">
              <Text fw={500}>Transaction Type:</Text>
              <Text>{description}</Text>
            </Group>

            <Group justify="space-between">
              <Text fw={500}>Amount:</Text>
              <Text fw={700} size="lg" c={amountColor}>
                {userId ? formatCreditAmount(transaction.amount, userId, transaction.from_id, transaction.to_id) : `+${transaction.amount.toFixed(2)}`} Credits
              </Text>
            </Group>

            <Group justify="space-between">
              <Text fw={500}>Status:</Text>
              <Badge color={getTransactionStatusColor(transaction.status)} variant="light">
                {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
              </Badge>
            </Group>

            <Group justify="space-between">
              <Text fw={500}>Processed On:</Text>
              <Text>{formatTransactionDate(transaction.created_at)}</Text>
            </Group>
          </Stack>
        </Card>
      </Stack>
    </Modal>
  )
}
