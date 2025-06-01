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
  return Array(45)
    .fill(null)
    .map((_, i) => ({
      id: i + 1,
      name: `Table ${i + 1}`,
      seats: Array(10)
        .fill(null)
        .map((_, j) => ({
          number: j + 1,
          status: 'available' as const,
        })),
    }));
};

export default function GalaBookingPage() {
  const { user, isAuthenticated, isLoading } = useKindeBrowserClient();
  const {
    tables,
    selectedSeats,
    loading,
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
        <Box style={{ flex: 1 }}>
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
                    gridTemplateColumns: 'repeat(5, 1fr)',
                    gap: '16px',
                    padding: '16px',
                    width: 'fit-content',
                    minWidth: '100%',
                  }}
                >
                  {tables.map((table) => (
                    <Table
                      key={table.id}
                      table={table}
                      onSeatClick={handleSeatClick}
                      onTableClick={handleTableClick}
                    />
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
        />
      </Flex>
    </Box>
  </Container>
)

}
