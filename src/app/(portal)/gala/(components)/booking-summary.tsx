'use client';

import { IconArmchair, IconCheck, IconInfoCircle } from '@tabler/icons-react';
import {
  Box,
  Button,
  Divider,
  Group,
  List,
  Paper,
  Stack,
  Text,
  ThemeIcon,
  Title,
  Tooltip,
} from '@mantine/core';
import { UserBooking } from '@/lib/gala/types';

interface BookingSummaryProps {
  selectedSeats: {
    tableId: number;
    seatNumber: number;
  }[];
  tables: {
    id: number;
    name: string;
  }[];
  onSubmit: () => Promise<void>;
  userBookings: UserBooking[];
  maxSeatsAllowed?: number;
  currentlyBooked?: number;
}

export default function BookingSummary({
  selectedSeats,
  tables,
  onSubmit,
  userBookings,
  maxSeatsAllowed,
  currentlyBooked = 0,
}: BookingSummaryProps) {
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit();
  };

  const getTableName = (tableId: number) => {
    const table = tables.find((t) => t.id === tableId);
    return table ? table.name : `Table ${tableId}`;
  };

  const totalSelected = selectedSeats.length;
  const totalSeats = currentlyBooked + totalSelected;
  const seatsRemaining = maxSeatsAllowed ? maxSeatsAllowed - totalSeats : 0;
  const isDisabled = maxSeatsAllowed !== undefined && totalSeats > maxSeatsAllowed;

  return (
    <Paper withBorder p="md" radius="md" style={{ width: '100%', maxWidth: 400 }}>
      <Title order={3} mb="md">
        Booking Summary
      </Title>

      {maxSeatsAllowed !== undefined && (
        <Box mb="md">
          <Group gap="xs" justify="space-between">
            <Text size="sm" mb="xs" span>
              Currently booked:
            </Text>
            <Text size="sm" mb="xs" span fw={700} c="blue">
              {currentlyBooked}
            </Text>
          </Group>
          <Group gap="xs" justify="space-between">
            <Text size="sm" mb="xs" span>
              Selected for booking:
            </Text>
            <Text size="sm" mb="xs" span fw={700} c="green">
              {totalSelected}
            </Text>
          </Group>
          <Divider my="xs" />
          <Group gap="xs" justify="space-between">
            <Text size="sm" mb="xs" span>
              Total after booking:
            </Text>
            <Text size="sm" mb="xs" span fw={700} c={totalSeats > maxSeatsAllowed ? 'red' : 'dark'}>
              {totalSeats}
            </Text>
          </Group>
          <Group gap="xs" justify="space-between">
            <Text size="sm" mb="sm" span>
              Seats remaining:
            </Text>
            <Text size="sm" mb="sm" span fw={700} c={seatsRemaining <= 0 ? 'red' : 'green'}>
              {seatsRemaining}
            </Text>
          </Group>
          <Group gap="xs" mb="md">
            <Text size="xs" c="dimmed" span>
              Maximum allowed: {maxSeatsAllowed}
            </Text>
            <Tooltip label="You can book up to the number of delegates from your entity">
              <IconInfoCircle size={14} />
            </Tooltip>
          </Group>
        </Box>
      )}

      {selectedSeats.length > 0 ? (
        <Stack>
          <Text fw={500}>New Selections ({selectedSeats.length})</Text>
          <List spacing="xs" size="sm" center>
            {selectedSeats.map((seat, index) => (
              <List.Item
                key={`${seat.tableId}-${seat.seatNumber}-${index}`}
                icon={
                  <ThemeIcon color="green" size={20} radius="xl">
                    <IconArmchair size={12} />
                  </ThemeIcon>
                }
              >
                <Text size="sm">
                  {getTableName(seat.tableId)}, Seat {seat.seatNumber}
                </Text>
              </List.Item>
            ))}
          </List>
          <form onSubmit={handleSubmit}>
            <Stack>
              <Button
                type="submit"
                leftSection={<IconCheck size={16} style={{ opacity: isDisabled ? 0.5 : 1 }} />}
                disabled={isDisabled}
                fullWidth
              >
                Confirm Booking ({selectedSeats.length} seat{selectedSeats.length !== 1 ? 's' : ''})
              </Button>
              {isDisabled && (
                <Text c="red" size="sm" ta="center">
                  You've exceeded your allowed number of seats ({maxSeatsAllowed})
                </Text>
              )}
            </Stack>
          </form>
        </Stack>
      ) : (
        <Box py="md">
          <Text c="dimmed" ta="center">
            {maxSeatsAllowed
              ? userBookings.length > 0 && userBookings.length < maxSeatsAllowed
                ? 'Select more seats to add to your booking'
                : 'You have booked the maximum allowed seat limit'
              : userBookings.length > 0
                ? 'Select more seats to add to your booking'
                : 'Please select seats to continue with your booking'}
          </Text>
        </Box>
      )}
    </Paper>
  );
}
