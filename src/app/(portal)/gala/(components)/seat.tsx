"use client"

import type { CSSProperties, MouseEvent } from "react"
import { IconArmchair } from "@tabler/icons-react"
import { ActionIcon, Tooltip } from "@mantine/core"
import type { SeatStatus } from "@/lib/gala/types"

interface SeatProps {
  seat: {
    number: number
    status: SeatStatus
    bookedByUser?: boolean
  }
  style?: CSSProperties
  onClick: () => void
}

export default function Seat({ seat, style, onClick }: SeatProps) {
  const getColor = () => {
    if (seat.status === "selected") return "green"
    if (seat.status === "booked") {
      return seat.bookedByUser ? "blue" : "red"
    }
    return "gray"
  }

  const getVariant = () => {
    switch (seat.status) {
      case "selected":
      case "booked":
        return "filled"
      default:
        return "light"
    }
  }

  const handleClick = (e: MouseEvent) => {
    e.stopPropagation()
    if (seat.status !== "booked") {
      onClick()
    }
  }

  return (
    <Tooltip label={`Seat ${seat.number} (${seat.status})`}>
      <ActionIcon
        color={getColor()}
        variant={getVariant()}
        size="sm"
        style={{
          ...style,
          cursor: seat.status === "booked" ? "not-allowed" : "pointer",
          opacity: seat.status === "booked" ? 0.8 : 1,
        }}
        onClick={handleClick}
      >
        <IconArmchair size={16} />
      </ActionIcon>
    </Tooltip>
  )
}
