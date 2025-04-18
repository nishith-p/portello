import { Button, Group, Text } from '@mantine/core';

interface OrderPaginationProps {
  currentOffset: number;
  limit: number;
  total: number;
  onPageChange: (newOffset: number) => void;
}

export function OrderPagination({
  currentOffset,
  limit,
  total,
  onPageChange,
}: OrderPaginationProps) {
  // Don't render if there are no items
  if (total === 0) {
    return <></>;
  }

  return (
    <Group justify="space-between" mt="md">
      <Text size="sm" c="dimmed">
        Showing {Math.min(currentOffset + 1, total)} - {Math.min(currentOffset + limit, total)} of{' '}
        {total} orders
      </Text>
      <Group>
        <Button
          variant="outline"
          disabled={currentOffset === 0}
          onClick={() => onPageChange(Math.max(0, currentOffset - limit))}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          disabled={currentOffset + limit >= total}
          onClick={() => onPageChange(currentOffset + limit)}
        >
          Next
        </Button>
      </Group>
    </Group>
  );
}
