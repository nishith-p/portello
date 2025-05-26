'use client';

import { useKindeBrowserClient } from '@kinde-oss/kinde-auth-nextjs';
import { IconCircleCheck, IconCircleDashed, IconCircleX, IconScan } from '@tabler/icons-react';
import {
  Badge,
  Box,
  Container,
  Divider,
  Flex,
  Group,
  Paper,
  ScrollArea,
  Text,
  Title,
} from '@mantine/core';
import { useGalaSeating } from '@/lib/gala/hooks';
import BookingSummary from './(components)/booking-summary';
import Table from './(components)/table';

// Generate initial tables with all seats available
const generateTables = () => {
  const tables = [];
  for (let i = 1; i <= 45; i++) {
    tables.push({
      id: i,
      name: `Table ${i}`,
      seats: Array(10)
        .fill(null)
        .map((_, index) => ({
          id: `${i}-${index + 1}`,
          number: index + 1,
          status: 'available' as const, // Mark as const to ensure type safety
        })),
    });
  }
  return tables;
};

export default function GalaBookingPage() {
  const { isAuthenticated, isLoading } = useKindeBrowserClient()
  const { tables, selectedSeats, loading, handleSeatClick, submitBooking } = 
    useGalaSeating({ initialTables: generateTables() })

  const handleSubmit = async () => {
    if (!isAuthenticated) {
      alert("Please log in to book seats")
      return
    }
    const success = await submitBooking()
    if (success) {
      alert("Booking successful!")
    } else {
      alert("Booking failed. Please try again.")
    }
  }

  if (isLoading) {
    return <Text>Loading user data...</Text>
  }

  return (
    <Container size="xl" py="xl">
      <Title order={1} mb="md">
        Gala Night Seat Booking
      </Title>

      {loading ? (
        <Text>Loading seating chart...</Text>
      ) : (
        <Flex gap="xl" direction={{ base: 'column', md: 'row' }}>
          <Box style={{ flex: 1 }}>
            <Paper withBorder p="md" radius="md" mb="lg">
              <Group justify="center" mb="lg">
                <IconScan size={48} stroke={1.5} />
                <Text size="lg" fw={500}>
                  Stage / Screen
                </Text>
              </Group>

              <Divider mb="xl" label="Seating Area" labelPosition="center" />

              <Box style={{ width: '100%', height: 500, position: 'relative' }}>
                <ScrollArea h={500} w="100%" type="always" offsetScrollbars>
                  <Box
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(5, 1fr)',
                      gap: '16px',
                      padding: '16px',
                      width: 'fit-content',
                      minWidth: '100%',
                    }}
                  >
                    {tables.map((table) => (
                      <Table key={table.id} table={table} onSeatClick={handleSeatClick} />
                    ))}
                  </Box>
                </ScrollArea>
              </Box>
            </Paper>

            <Paper withBorder p="md" radius="md">
              <Title order={4} mb="md">
                Seat Legend
              </Title>
              <Group>
                <Badge leftSection={<IconCircleDashed size={14} />} color="gray">
                  Available
                </Badge>
                <Badge leftSection={<IconCircleCheck size={14} />} color="green">
                  Selected
                </Badge>
                <Badge leftSection={<IconCircleX size={14} />} color="red">
                  Booked
                </Badge>
              </Group>
            </Paper>
          </Box>

          <BookingSummary selectedSeats={selectedSeats} tables={tables} onSubmit={handleSubmit} />
        </Flex>
      )}
    </Container>
  );
}
