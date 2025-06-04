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
    <Container
      size="xl"
      py={{ base: 'md', md: 'xl' }}
      px={{ base: 'xs', sm: 'md' }}
      style={{
        '@media (max-width: 768px)': {
          padding: '1rem 0.5rem',
        },
      }}
    >
      <Title
        order={1}
        mb="md"
        ta={{ base: 'center', md: 'left' }}
        style={{
          '@media (max-width: 768px)': {
            fontSize: '1.5rem',
            textAlign: 'center',
          },
          '@media (min-width: 769px)': {
            fontSize: '2rem',
            textAlign: 'left',
          },
        }}
      >
        Gala Night Seat Booking
      </Title>

      <Box style={{ position: 'relative' }}>
        <LoadingOverlay visible={loading} zIndex={500} overlayProps={{ radius: 'md', blur: 2 }} />

        <Flex gap={{ base: 'md', md: 'xl' }} direction={{ base: 'column', lg: 'row' }}>
          <Box
            style={{
              flex: 1,
              '@media (max-width: 991px)': {
                width: '100%',
              },
              '@media (min-width: 992px)': {
                width: '70%',
              },
            }}
            w={{ base: '100%', lg: '70%' }}
          >
            <Paper withBorder p={{ base: 'sm', md: 'md' }} radius="md" mb="lg">
              <Group justify="center" mb={{ base: 'md', md: 'lg' }}>
                <Box
                  style={{
                    '@media (max-width: 768px)': { transform: 'scale(0.8)' },
                    '@media (min-width: 769px)': { transform: 'scale(1)' },
                  }}
                >
                  <IconScan size={48} stroke={1.5} />
                </Box>
                <Text
                  fw={500}
                  style={{
                    '@media (max-width: 768px)': { fontSize: '1rem' },
                    '@media (min-width: 769px)': { fontSize: '1.125rem' },
                  }}
                >
                  Stage
                </Text>
              </Group>

              <Divider mb={{ base: 'md', md: 'xl' }} label="Seating Area" labelPosition="center" />

              <Box
                style={{
                  width: '100%',
                  position: 'relative',
                  '@media (max-width: 575px)': { height: '350px' },
                  '@media (min-width: 576px) and (max-width: 767px)': { height: '400px' },
                  '@media (min-width: 768px)': { height: '500px' },
                }}
                h={{ base: 400, sm: 450, md: 500 }}
              >
                <ScrollArea
                  h={{ base: 400, sm: 450, md: 500 }}
                  w="100%"
                  type="always"
                  offsetScrollbars
                  style={{
                    '@media (max-width: 575px)': { height: '350px' },
                    '@media (min-width: 576px) and (max-width: 767px)': { height: '400px' },
                    '@media (min-width: 768px)': { height: '500px' },
                  }}
                >
                  <Box
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(13, 1fr)',
                      width: 'fit-content',
                      minWidth: '100%',
                      gap: '2px',
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

            <Paper withBorder p={{ base: 'sm', md: 'md' }} radius="md">
              <Title
                order={4}
                mb="md"
                style={{
                  '@media (max-width: 768px)': { fontSize: '1rem' },
                  '@media (min-width: 769px)': { fontSize: '1.25rem' },
                }}
              >
                Seat Legend
              </Title>
              <Group>
                <Badge leftSection={<IconCircleDashed size={14} />} color="gray" size="sm">
                  Available
                </Badge>
                <Badge leftSection={<IconCircleCheck size={14} />} color="green" size="sm">
                  Selected
                </Badge>
                <Badge leftSection={<IconCircleX size={14} />} color="red" size="sm">
                  Booked
                </Badge>
                <Badge leftSection={<IconCircleX size={14} />} color="blue" size="sm">
                  Booked by You
                </Badge>
              </Group>
            </Paper>
          </Box>

          <Box w={{ base: '100%', lg: '30%' }}>
            <BookingSummary
              selectedSeats={selectedSeats}
              tables={tables}
              onSubmit={handleSubmit}
              userBookings={userBookings}
              maxSeatsAllowed={maxSeatsAllowed}
              currentlyBooked={currentlyBooked}
            />
          </Box>
        </Flex>
      </Box>
    </Container>
  );
}
