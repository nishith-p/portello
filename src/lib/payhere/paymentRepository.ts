import { supabaseServer } from '@/lib/core/supabase';
import { NotFoundError } from '@/lib/core/errors';
import { OrderStatus } from '@/lib/store/types';
import { PaymentRecordInput } from './paymentService';

export async function getOrderById(orderId: string) {
  const { data, error } = await supabaseServer
    .from('orders')
    .select(`
      id,
      user_id,
      total_amount,
      users:user_id (
        first_name,
        last_name,
        aiesec_email
      )
    `)
    .eq('id', orderId)
    .single();
  if (error) {
    if (error.code === 'PGRST116') {
      throw new NotFoundError(`Order with ID ${orderId} not found`);
    }
    throw error;
  }
  return data;
}

export async function getUserInfoFromOderID(orderId: string) {
  const { data, error } = await supabaseServer
    .from('orders')
    .select('user_id')
    .eq('id', orderId)
    .single();
  if (error) {
    if (error.code === 'PGRST116') {
      throw new NotFoundError(`Order with ID ${orderId} not found`);
    }
    throw error;
  }
  return data;
}

export async function updateOrderStatus(
  orderId: string,
  newStatus: OrderStatus,
  updatedBy: string
) {
  const { error } = await supabaseServer
    .from('orders')
    .update({ status: newStatus, updated_by: updatedBy })
    .eq('id', orderId);
  if (error) throw error;
}

export async function insertPaymentRecord(
  orderId: string,
  input: PaymentRecordInput
) {
  const record = {
    order_id: orderId,
    payment_id: input.payment_id,
    amount: input.payhere_amount,
    currency: input.payhere_currency,
    status: input.status_code,
    method: input.method || null,
    status_message: input.status_message || null,
    custom_1: input.custom_1 || null,
    custom_2: input.custom_2 || null,
    created_at: input.created_at || new Date().toISOString(),
  };
  const { error } = await supabaseServer.from('payments').insert(record);
  if (error) throw error;
}