import { supabaseServer } from '@/lib/core/supabase';

/**
 * Get user's current credit balance
 */
export async function getUserCredit(userId: string): Promise<{ credit: number } | null> {
  try {
    const { data, error } = await supabaseServer
      .from('users')
      .select('credit')
      .eq('kinde_id', userId)
      .single();

    if (error) {
      console.error('Error fetching user credit:', error);
      return null;
    }

    return { credit: data?.credit || 0 };
  } catch (error) {
    console.error('Error in getUserCredit:', error);
    return null;
  }
}

/**
 * Get user's credit transaction history
 */
export async function getUserCreditTransactions(userId: string): Promise<any[]> {
  try {
    // First, fetch the credit transactions
    const { data: transactions, error: transactionsError } = await supabaseServer
      .from('credit_payments')
      .select('payment_id, amount, status, from_id, to_id, created_at')
      .or(`to_id.eq.${userId},from_id.eq.${userId}`)
      .order('created_at', { ascending: false });

    if (transactionsError) {
      console.error('Error fetching credit transactions:', transactionsError);
      return [];
    }

    if (!transactions || transactions.length === 0) {
      return [];
    }

    // Collect all unique user IDs from 'from' and 'to' fields
    const userIds = new Set<string>();
    transactions.forEach((transaction) => {
      if (transaction.from_id) userIds.add(transaction.from_id);
      if (transaction.to_id) userIds.add(transaction.to_id);
    });

    // Fetch user names in a single query
    const { data: users, error: usersError } = await supabaseServer
      .from('users')
      .select('kinde_id, first_name')
      .in('kinde_id', Array.from(userIds));

    if (usersError) {
      console.error('Error fetching user names:', usersError);
      return transactions; // Return transactions without names if user fetch fails
    }

    // Create a map of kinde_id to first_name for quick lookup
    const userMap = new Map<string, string>();
    users?.forEach((user) => {
      userMap.set(user.kinde_id, user.first_name);
    });

    // Enhance transactions with user names
    const enhancedTransactions = transactions.map((transaction) => ({
      ...transaction,
      from_name: userMap.get(transaction.from_id) || null,
      to_name: userMap.get(transaction.to_id) || null,
    }));

    return enhancedTransactions;
  } catch (error) {
    console.error('Error in getUserCreditTransactions:', error);
    return [];
  }
}

/**
 * Get complete wallet data (credit + transactions)
 */
export async function getWalletData(userId: string) {
  try {
    const [wallet, transactions] = await Promise.all([
      getUserCredit(userId),
      getUserCreditTransactions(userId),
    ]);

    return {
      wallet: wallet || { credit: 0 },
      transactions: transactions || [],
      userId, // Include userId in response for client-side transaction type determination
    };
  } catch (error) {
    console.error('Error in getWalletData:', error);
    return {
      wallet: { credit: 0 },
      transactions: [],
      userId,
    };
  }
}

/**
 * Process credit payment for an order
 */
export async function processCreditPayment(
  userId: string,
  orderId: string,
  amount: number
): Promise<{ success: boolean; error?: string }> {
  try {
    // Start a transaction
    const { data: user, error: userError } = await supabaseServer
      .from('users')
      .select('credit')
      .eq('kinde_id', userId)
      .single();

    if (userError) {
      console.error('Error fetching user credit:', userError);
      return { success: false, error: 'Failed to fetch user credit' };
    }

    if (!user || user.credit < amount) {
      return { success: false, error: 'Insufficient credit balance' };
    }

    // Deduct credit from user
    const newCreditBalance = user.credit - amount;
    const { error: updateError } = await supabaseServer
      .from('users')
      .update({ credit: newCreditBalance })
      .eq('kinde_id', userId);

    if (updateError) {
      console.error('Error updating user credit:', updateError);
      return { success: false, error: 'Failed to update credit balance' };
    }

    // Create credit transaction record
    const { error: transactionError } = await supabaseServer.from('credit_payments').insert({
        order_id: orderId,
      amount: amount,
      status: 'completed',
      type: 'purchase',
      from_id: userId,
      to_id: null, // null indicates payment to system/store
      created_at: new Date().toISOString(),
    });

    if (transactionError) {
      console.error('Error creating credit transaction:', transactionError);
      // Rollback credit update
      await supabaseServer.from('users').update({ credit: user.credit }).eq('kinde_id', userId);
      return { success: false, error: 'Failed to record transaction' };
    }

    // Update order status to paid
    const { error: orderError } = await supabaseServer
      .from('orders')
      .update({
        status: 'paid with credit',
        updated_at: new Date().toISOString(),
        updated_by: userId,
      })
      .eq('id', orderId);

    if (orderError) {
      console.error('Error updating order status:', orderError);
      return { success: false, error: 'Failed to update order status' };
    }

    return { success: true };
  } catch (error) {
    console.error('Error in processCreditPayment:', error);
    return { success: false, error: 'Internal server error' };
  }
}
