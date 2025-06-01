'use client';

import { IconArmchair, IconCheck } from '@tabler/icons-react';
import { Box, Button, Divider, List, Paper, Stack, Text, ThemeIcon, Title } from '@mantine/core';
import { UserBooking } from '@/lib/gala/types';

interface BookingSummaryProps {
  selectedSeats: {
    tableId: number
    seatNumber: number
  }[]
  tables: {
    id: number
    name: string
  }[]
  onSubmit: () => Promise<void>
  userBookings: UserBooking[]
}

export default function BookingSummary({ 
  selectedSeats, 
  tables, 
  onSubmit, 
  userBookings 
}: BookingSummaryProps) {
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await onSubmit()
  }

  const getTableName = (tableId: number) => {
    const table = tables.find((t) => t.id === tableId)
    return table ? table.name : `Table ${tableId}`
  }

  return (
    <Paper withBorder p="md" radius="md" style={{ width: "100%", maxWidth: 400 }}>
      <Title order={3} mb="md">
        {userBookings.length > 0 ? 'Your Bookings' : 'Complete Your Booking'}
      </Title>

      {selectedSeats.length > 0 ? (
        <Stack>
          <Text fw={500}>Selected Seats ({selectedSeats.length})</Text>
          <List spacing="xs" size="sm" center>
            {selectedSeats.map((seat, index) => (
              <List.Item
                key={`${seat.tableId}-${seat.seatNumber}-${index}`}
                icon={
                  <ThemeIcon color="green" size={24} radius="xl">
                    <IconArmchair size={16} />
                  </ThemeIcon>
                }
              >
                {getTableName(seat.tableId)}, Seat {seat.seatNumber}
              </List.Item>
            ))}
          </List>
          <form onSubmit={handleSubmit}>
            <Stack>
              <Button type="submit" leftSection={<IconCheck size={16} />}>
                Confirm Booking
              </Button>
            </Stack>
          </form>
        </Stack>
      ) : (
        <Box py="md">
          <Text c="dimmed">
            {userBookings.length > 0 
              ? "Select more seats to add to your booking"
              : "Please select seats to continue with your booking"}
          </Text>
        </Box>
      )}
    </Paper>
  )
}
