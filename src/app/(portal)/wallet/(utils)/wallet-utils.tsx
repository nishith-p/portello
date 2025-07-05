import type { CreditTransaction, CreditTransactionStatus } from "@/lib/wallet/types"

/**
 * Format credit amount for display
 */
export function formatCredit(amount: number): string {
  return `${amount.toFixed(2)} Credits`
}

/**
 * Format a date string to a more user-friendly format
 */
export function formatTransactionDate(dateString?: string): string {
  if (!dateString) {
    return "N/A"
  }

  const date = new Date(dateString)
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

/**
 * Get the appropriate color for a transaction status
 */
export function getTransactionStatusColor(status: CreditTransactionStatus): string {
  switch (status) {
    case "pending":
      return "orange"
    case "completed":
      return "green"
    case "failed":
      return "red"
    case "cancelled":
      return "gray"
    default:
      return "gray"
  }
}

/**
 * Get a description of a transaction status
 */
export function getTransactionStatusDescription(status: CreditTransactionStatus): string {
  switch (status) {
    case "pending":
      return "Credit addition is being processed."
    case "completed":
      return "Credits added successfully."
    case "failed":
      return "Credit addition failed to process."
    case "cancelled":
      return "Credit addition was cancelled."
    default:
      return ""
  }
}

/**
 * Format credit amount with appropriate sign based on transaction type
 */
export function formatCreditAmount(amount: number, userId: string, from: string | null, to: string | null): string {
  // If user is the recipient, it's a credit addition (positive)
  if (to === userId) {
    return `+${amount.toFixed(2)}`
  }
  // If user is the sender, it's a credit deduction (negative)
  if (from === userId) {
    return `-${amount.toFixed(2)}`
  }
  // Default case (shouldn't happen with proper data)
  return amount.toFixed(2)
}

/**
 * Get transaction type description
 */
export function getTransactionDescription(transaction: CreditTransaction, userId?: string): string {
  if (!userId) return "Credit Transaction"
  
  if (transaction.to_id === userId && !transaction.from_id) {
    return "Admin Credit Addition"
  }
  if (transaction.to_id === userId && transaction.from_id) {
    return "Credit Received"
  }
  if (transaction.from_id === userId) {
    return transaction.to_id ? "Credit Sent" : "Purchase Deduction"
  }
  return "Credit Transaction"
}
