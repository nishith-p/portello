"use client"

import { Paper, Title, Text, Stack, Button, Divider, List, ThemeIcon, Box } from "@mantine/core"
import { IconArmchair, IconCheck } from "@tabler/icons-react"

interface BookingSummaryProps {
  selectedSeats: {
    tableId: number
    seatId: string
    seatNumber: number
  }[]
  tables: any[]
  onSubmit: () => Promise<void>
}

export default function BookingSummary({ selectedSeats, tables, onSubmit }: BookingSummaryProps) {
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await onSubmit()
  }

  const getTableName = (tableId: number) => {
    const table = tables.find((t) => t.id === tableId)
    return table ? table.name : ""
  }

  return (
    <Paper withBorder p="md" radius="md" style={{ width: "100%", maxWidth: 400 }}>
      <Title order={3} mb="md">
        Complete Your Booking
      </Title>

      {selectedSeats.length > 0 ? (
        <Stack>
          <Text fw={500}>Selected Seats ({selectedSeats.length})</Text>

          <List spacing="xs" size="sm" center>
            {selectedSeats.map((seat) => (
              <List.Item
                key={seat.seatId}
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

          <Divider my="sm" />

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
          <Text c="dimmed">Please select seats to continue with your booking</Text>
        </Box>
      )}
    </Paper>
  )
}
