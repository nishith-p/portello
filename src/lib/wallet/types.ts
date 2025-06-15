// lib/wallet/types.ts - Updated with transaction types
export type CreditTransactionStatus = "pending" | "completed" | "failed" | "cancelled"

export type TransactionType = "topup" | "purchase" | "transfer_sent" | "transfer_received"

export interface CreditTransaction {
  to_name: string | null | undefined
  from_name: string | null | undefined
  payment_id: string
  amount: number
  status: CreditTransactionStatus
  from_id: string | null
  to_id: string | null
  created_at: string
  transaction_type?: TransactionType
}

export interface UserWallet {
  credit: number
}

export interface WalletData {
  wallet: UserWallet
  transactions: CreditTransaction[]
  userId: string
}

export interface UpdateCreditResponse {
  success: boolean;
  error?: string;
}
