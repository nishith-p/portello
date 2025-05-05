"use client"
import { Button } from "@mantine/core"

interface PaymentFormProps {
  actionUrl: string
  fields: Record<string, string>
}

export default function PaymentForm({ actionUrl, fields }: PaymentFormProps) {
  return (
    <form method="post" action={actionUrl} className="w-full">
      {/* Dynamically generate all hidden fields from the fields object */}
      {Object.entries(fields).map(([name, value]) => (
        <input key={name} type="hidden" name={name} value={value} />
      ))}

      <Button type="submit" className="w-full">
        Pay Now
      </Button>
    </form>
  )
}
