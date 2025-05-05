import { supabaseServer } from '@/lib/core/supabase';
import { NotFoundError } from '@/lib/core/errors';
import { OrderStatus } from '@/lib/store/types';
import { CsPaymentRecord } from './cybersourceService';

export async function getOrderById(orderId: string) {
    const { data, error } = await supabaseServer
        .from('orders')
        .select('id')
        .eq('id', orderId)
        .single();
    if (error) {
        if (error.code === 'PGRST116') throw new NotFoundError(`Order ${orderId} not found`);
        throw error;
    }
    return data;
}

export async function updateOrderStatus(
    orderId: string,
    status: OrderStatus,
    updatedBy: string
) {
    const { error } = await supabaseServer
        .from('orders')
        .update({ status, updated_by: updatedBy })
        .eq('id', orderId);
    if (error) throw error;
}

export async function insertCsPayment(
    orderId: string,
    record: CsPaymentRecord
) {
    const { error } = await supabaseServer
        .from('cs_payments')
        .insert({
            order_id:      orderId,
            request_id:    record.request_id,
            decision:      record.decision,
            reason_code:   record.reason_code,
            amount:        record.amount,
            currency:      record.currency,
            raw_response:  JSON.stringify(record.raw),
            created_at:    record.created_at
        });
    if (error) throw error;
}