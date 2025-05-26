"use client"

import { Paper, Text, Group, Tooltip } from "@mantine/core"
import { IconTable } from "@tabler/icons-react"
import Seat from "./seat"

interface SeatType {
  id: string
  number: number
  status: string
}

interface TableProps {
  table: {
    id: number
    name: string
    seats: SeatType[]
  }
  onSeatClick: (tableId: number, seatId: string, seatNumber: number, status: string) => void
}

export default function Table({ table, onSeatClick }: TableProps) {
  // Calculate positions for 10 seats in a circle
  const getPosition = (index: number, total = 10) => {
    const angleStep = (2 * Math.PI) / total
    const angle = index * angleStep
    const radius = 40

    return {
      left: 50 + radius * Math.cos(angle - Math.PI / 2),
      top: 50 + radius * Math.sin(angle - Math.PI / 2),
    }
  }

  return (
    <Tooltip label={table.name} position="top">
      <Paper
        withBorder
        radius="xl"
        p={0}
        style={{
          width: "100%",
          height: 120,
          position: "relative",
          margin: "0",
          minWidth: "120px",
        }}
      >
        <Group justify="center" style={{ height: "100%" }}>
          {/* <IconTable size={24} stroke={1.5} /> */}
          <Text size="xs" fw={500}>
            {table.name}
          </Text>
        </Group>

        {table.seats.map((seat, index) => {
          const position = getPosition(index)

          return (
            <Seat
              key={seat.id}
              seat={seat}
              style={{
                position: "absolute",
                left: `${position.left}%`,
                top: `${position.top}%`,
                transform: "translate(-50%, -50%)",
              }}
              onClick={() => onSeatClick(table.id, seat.id, seat.number, seat.status)}
            />
          )
        })}
      </Paper>
    </Tooltip>
  )
}
