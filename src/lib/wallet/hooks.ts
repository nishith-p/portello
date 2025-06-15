"use client"

import { useState, useEffect } from "react"
import type { WalletData } from "./types"

export function useWallet() {
  const [walletData, setWalletData] = useState<WalletData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchWalletData = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch("/api/wallet")

      if (!response.ok) {
        throw new Error("Failed to fetch wallet data")
      }

      const data = await response.json()
      setWalletData(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
      console.error("Error fetching wallet data:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchWalletData()
  }, [])

  const refetch = () => {
    fetchWalletData()
  }

  return {
    walletData,
    loading,
    error,
    refetch,
  }
}

export function useCreditPayment() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const processCreditPayment = async (orderId: string, amount: number) => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch("/api/store/orders/credit-payments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orderId,
          amount,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to process credit payment")
      }

      return { success: true, data }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An error occurred"
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }

  return {
    processCreditPayment,
    loading,
    error,
  }
}
