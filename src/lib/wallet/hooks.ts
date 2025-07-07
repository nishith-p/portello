"use client"

import { useState, useEffect } from "react"
import type { WalletData } from "./types"

/**
 * View wallet
 */
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

/**
 * Update credit payments
 */
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

/**
 * Update wallet credit amount (admin only)
 */
export function useUpdateUserCredit() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateCredit = async (userId: string, amount: number, reason?: string) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch("/api/wallet/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, amount, reason }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update credit");
      }

      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      console.error("Error updating credit:", err);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return { updateCredit, isLoading, error };
}

export function useAdminWallet(userId?: string) {
  const [walletData, setWalletData] = useState<WalletData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWalletData = async (id?: string) => {
    try {
      setLoading(true);
      setError(null);

      if (!id) {
        setWalletData(null);
        return;
      }

      const response = await fetch(`/api/wallet/${id}`);

      if (!response.ok) {
        throw new Error(await response.text());
      }

      const data = await response.json();
      setWalletData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      console.error("Error fetching admin wallet data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWalletData(userId);
  }, [userId]);

  const refetch = () => {
    fetchWalletData(userId);
  };

  return {
    walletData,
    loading,
    error,
    refetch,
  };
}
