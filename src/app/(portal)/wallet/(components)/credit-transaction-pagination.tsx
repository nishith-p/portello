import { Button, Group, Text } from "@mantine/core";

interface CreditTransactionsPaginationProps {
  currentOffset: number;
  limit: number;
  total: number;
  onPageChangeAction?: (newOffset: number) => void;
}

export default function CreditTransactionsPagination({
  currentOffset,
  limit,
  total,
  onPageChangeAction,
}: CreditTransactionsPaginationProps) {
  if (total === 0 || !onPageChangeAction) {
    return <></>;
  }

  return (
    <Group justify="space-between" mt="md">
      <Text size="sm" c="dimmed">
        Showing {Math.min(currentOffset + 1, total)} - {Math.min(currentOffset + limit, total)} of{' '}
        {total} transactions
      </Text>
      <Group>
        <Button
          variant="outline"
          disabled={currentOffset === 0}
          onClick={() => onPageChangeAction(Math.max(0, currentOffset - limit))}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          disabled={currentOffset + limit >= total}
          onClick={() => onPageChangeAction(currentOffset + limit)}
        >
          Next
        </Button>
      </Group>
    </Group>
  );
}