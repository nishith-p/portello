// app/(portal)/admin/gala/(components)/seating-chart.tsx
'use client';

import { useMemo } from 'react';
import { IconArmchair } from '@tabler/icons-react';
import { Badge, Box, Paper, Text } from '@mantine/core';
import { generateTables } from '@/app/(portal)/gala/page';
import { Booking, TableStatus } from '@/lib/gala/types';

interface AdminSeatingChartProps {
  bookings: Booking[];
}

export function AdminSeatingChart({ bookings }: AdminSeatingChartProps) {
  const tables = useMemo(() => {
    const initialTables = generateTables();

    return initialTables.map(
      (table): TableStatus => ({
        ...table,
        seats: table.seats.map((seat) => {
          const booking = bookings.find((b) => b.table === table.id && b.seat === seat.number);

          if (booking && booking.users) {
            const entityCode = booking.users.entity;
            return {
              ...seat,
              status: 'booked',
              entityCode,
              delegateName: booking.users.first_name,
            };
          }

          return {
            ...seat,
            status: 'available',
          };
        }),
      })
    );
  }, [bookings]);

  return (
    <Paper withBorder p="md" radius="md" mb="xl">
      <Box
        mb="md"
        style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
      >
        <Text size="lg" fw={500}>
          Seating Chart Overview
        </Text>
        <Box style={{ display: 'flex', gap: '16px' }}>
          <Box style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <IconArmchair size={16} color="gray" />
            <Text size="sm">Available</Text>
          </Box>
          <Box style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <IconArmchair size={16} color="red" fill="red" />
            <Text size="sm">Booked</Text>
          </Box>
        </Box>
      </Box>

      <Box style={{ position: 'relative', height: '600px', overflow: 'auto' }}>
        <Box
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            width: 'fit-content',
            minWidth: '100%',
            gap: '48px',
            padding: '16px',
          }}
        >
          {tables.map((table) => {
            const bookedSeatsCount = table.seats.filter((seat) => seat.status === 'booked').length;

            return (
              <Box
                key={table.id}
                style={{
                  gridColumn: `${table.positionInRow + 1} / span 1`,
                  gridRow: `${table.row + 1}`,
                }}
              >
                <Paper
                  withBorder
                  p="sm"
                  radius="md"
                  style={{
                    border: bookedSeatsCount > 0 ? '2px solid #228be6' : '1px solid #e9ecef',
                  }}
                >
                  <Text size="xs" fw={500} ta="center" mb="xs">
                    {table.name}
                  </Text>
                  <Box
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(4, 1fr)',
                      gap: '4px',
                      justifyItems: 'center',
                    }}
                  >
                    {table.seats.map((seat) => (
                      <Box
                        key={seat.number}
                        style={{
                          position: 'relative',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          gap: '2px',
                        }}
                        title={
                          seat.status === 'booked'
                            ? `${seat.delegateName} (${seat.entityCode})`
                            : `Seat ${seat.number} - Available`
                        }
                      >
                        <IconArmchair
                          size={20}
                          color={seat.status === 'booked' ? '#fa5252' : '#868e96'}
                          fill={seat.status === 'booked' ? '#fa5252' : 'none'}
                          style={{ cursor: 'pointer' }}
                        />
                        {seat.status === 'booked' && seat.entityCode && (
                          <Text
                            size="8px"
                            fw={700}
                            c="red"
                            ta="center"
                            style={{
                              lineHeight: 1,
                              marginTop: '-2px',
                            }}
                          >
                            {seat.entityCode}
                          </Text>
                        )}
                      </Box>
                    ))}
                  </Box>
                  {bookedSeatsCount > 0 && (
                    <Text size="8px" ta="center" mt="xs" c="dimmed">
                      {bookedSeatsCount}/12 booked
                    </Text>
                  )}
                </Paper>
              </Box>
            );
          })}
        </Box>
      </Box>
    </Paper>
  );
}
