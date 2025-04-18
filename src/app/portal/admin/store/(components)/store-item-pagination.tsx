import { Button, Group, Text } from '@mantine/core';

interface StoreItemPaginationProps {
  currentOffset: number;
  limit: number;
  total: number;
  onPageChange: (newOffset: number) => void;
}

export function StoreItemPagination({
  currentOffset,
  limit,
  total,
  onPageChange,
}: StoreItemPaginationProps) {
  if (total === 0) {
    return <></>;
  }

  return (
    <Group justify="space-between" mt="md">
      <Text size="sm" c="dimmed">
        Showing {Math.min(currentOffset + 1, total)} - {Math.min(currentOffset + limit, total)} of{' '}
        {total} items
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
