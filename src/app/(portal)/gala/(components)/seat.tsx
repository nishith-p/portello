"use client"

import { ActionIcon, Tooltip } from "@mantine/core"
import { IconArmchair } from "@tabler/icons-react"
import type { CSSProperties } from "react"

interface SeatProps {
  seat: {
    id: string
    number: number
    status: string
  }
  style?: CSSProperties
  onClick: () => void
}

export default function Seat({ seat, style, onClick }: SeatProps) {
  const getColor = () => {
    switch (seat.status) {
      case "selected":
        return "green"
      case "booked":
        return "red"
      default:
        return "gray"
    }
  }

  return (
    <Tooltip label={`Seat ${seat.number} (${seat.status})`}>
      <ActionIcon
        color={getColor()}
        variant={seat.status === "selected" ? "filled" : "light"}
        size="sm"
        style={style}
        onClick={onClick}
        disabled={seat.status === "booked"}
      >
        <IconArmchair size={16} />
      </ActionIcon>
    </Tooltip>
  )
}
