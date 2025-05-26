"use client"

import { Paper, Text, Group, Tooltip } from "@mantine/core"
import Seat from "./seat"
import { SeatStatus } from "@/lib/gala/types"

interface TableProps {
  table: {
    id: number
    name: string
    seats: {
      number: number
      status: SeatStatus
    }[]
  }
  onSeatClick: (tableId: number, seatNumber: number, status: SeatStatus) => void
  onTableClick: (tableId: number) => void
}

export default function Table({ table, onSeatClick, onTableClick }: TableProps) {
  const getPosition = (index: number, total = 10) => {
    const angleStep = (2 * Math.PI) / total
    const angle = index * angleStep
    const radius = 40

    return {
      left: 50 + radius * Math.cos(angle - Math.PI / 2),
      top: 50 + radius * Math.sin(angle - Math.PI / 2),
    }
  }

  // Check if all selectable seats are selected
  const allSelectableSelected = table.seats.every(
    seat => seat.status === 'selected' || seat.status === 'booked'
  );

  return (
    <Tooltip 
      label={
        allSelectableSelected
          ? `Click to deselect all seats at ${table.name}`
          : `Click to select all available seats at ${table.name}`
      } 
      position="top"
    >
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
          cursor: "pointer",
        }}
      >
        <Group 
          justify="center" 
          style={{ height: "100%" }}
          onClick={(e) => {
            e.stopPropagation();
            onTableClick(table.id);
          }}
        >
          <Text size="xs" fw={500}>
            {table.name}
          </Text>
        </Group>

        {table.seats.map((seat, index) => {
          const position = getPosition(index)
          return (
            <Seat
              key={`${table.id}-${seat.number}`}
              seat={seat}
              style={{
                position: "absolute",
                left: `${position.left}%`,
                top: `${position.top}%`,
                transform: "translate(-50%, -50%)",
              }}
              onClick={() => onSeatClick(table.id, seat.number, seat.status)}
            />
          )
        })}
      </Paper>
    </Tooltip>
  )
}
