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
  LoadingOverlay,
  Paper,
  ScrollArea,
  Text,
  Title,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { useGalaSeating } from '@/lib/gala/hooks';
import BookingSummary from './(components)/booking-summary';
import Table from './(components)/table';

// Generate initial tables with all seats available
const generateTables = () => {
  const tables = [];
  let tableNumber = 1;
  const totalRows = 6; // Adjust based on how many rows you want

  for (let row = 0; row < totalRows; row++) {
    const isOddRow = row % 2 === 0;
    const tablesInRow = isOddRow ? 7 : 6;

    for (let i = 0; i < tablesInRow; i++) {
      tables.push({
        id: tableNumber,
        name: `Table ${tableNumber}`,
        seats: Array(10)
          .fill(null)
          .map((_, j) => ({
            number: j + 1,
            status: 'available' as const,
          })),
        row: row, // Add row information to each table
        positionInRow: i, // Add position in row information
      });
      tableNumber++;
    }
  }

  return tables;
};

export default function GalaBookingPage() {
  const { user, isLoading } = useKindeBrowserClient();
  const {
    tables,
    selectedSeats,
    loading,
    maxSeatsAllowed,
    currentlyBooked,
    handleSeatClick,
    handleTableClick,
    submitBooking,
    userBookings,
  } = useGalaSeating({
    initialTables: generateTables(),
    userId: user?.id,
  });

  const handleSubmit = async () => {
    const success = await submitBooking();
    if (success) {
      notifications.show({
        title: 'Gala Night Seat Booking',
        message: 'Booking Successful!',
        color: 'green',
      });
    } else {
      notifications.show({
        title: 'Error',
        message: 'Booking failed. Please try again.',
        color: 'red',
      });
    }
  };

  if (isLoading) {
    return <Text>Loading user data...</Text>;
  }

  return (
    <Container size="xl" py="xl">
      <Title order={1} mb="md">
        Gala Night Seat Booking
      </Title>

      <Box style={{ position: 'relative' }}>
        <LoadingOverlay visible={loading} zIndex={500} overlayProps={{ radius: 'md', blur: 2 }} />

        <Flex gap="xl" direction={{ base: 'column', md: 'row' }}>
          <Box style={{ flex: 1, width: '70%' }}>
            <Paper withBorder p="md" radius="md" mb="lg">
              <Group justify="center" mb="lg">
                <IconScan size={48} stroke={1.5} />
                <Text size="lg" fw={500}>
                  Stage
                </Text>
              </Group>

              <Divider mb="xl" label="Seating Area" labelPosition="center" />

              <Box style={{ width: '100%', height: 500, position: 'relative' }}>
                <ScrollArea h={500} w="100%" type="always" offsetScrollbars>
                  <Box
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(13, 1fr)',
                      width: 'fit-content',
                      minWidth: '100%',
                    }}
                  >
                    {tables.map((table) => {
                      const isOddRow = table.row % 2 === 0;
                      
                      return (
                        <Box
                          key={table.id}
                          style={{
                            // For odd rows (7 tables): normal position (columns 1-7)
                            // For even rows (6 tables): offset by 1 column (columns 2-7)
                            gridColumn: isOddRow
                              ? `${table.positionInRow * 2 + 1} / span 1`
                              : `${table.positionInRow * 2 + 2} / span 1`,
                            gridRow: `${table.row + 1}`,
                          }}
                        >
                          <Table
                            table={table}
                            onSeatClick={handleSeatClick}
                            onTableClick={handleTableClick}
                          />
                        </Box>
                      );
                    })}
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
                <Badge leftSection={<IconCircleX size={14} />} color="blue">
                  Booked by You
                </Badge>
              </Group>
            </Paper>
          </Box>

          <BookingSummary
            selectedSeats={selectedSeats}
            tables={tables}
            onSubmit={handleSubmit}
            userBookings={userBookings}
            maxSeatsAllowed={maxSeatsAllowed}
            currentlyBooked={currentlyBooked}
          />
        </Flex>
      </Box>
    </Container>
  );
}
