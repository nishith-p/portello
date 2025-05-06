import crypto from 'crypto';
import { getOrderById, updateOrderStatus, insertCsPayment } from './cybersourceRepository';
import { OrderStatus } from '@/lib/store/types';

export interface CsPaymentRecord {
    request_id: string;
    decision: string;
    reason_code: string;
    amount: string;
    currency: string;
    raw: Record<string,string>;
    created_at: string;
}

export async function processCybersourceNotification(
    payload: Record<string,string>
): Promise<void> {
    const secretKey = process.env.CYBS_SECRET_KEY!;
    const signedNames = payload.signed_field_names.split(',');
    const dataToVerify = signedNames.map(name => `${name}=${payload[name]}`).join(',');
    const expectedSig = crypto
        .createHmac('sha256', Buffer.from(secretKey, 'utf8'))
        .update(dataToVerify)
        .digest('base64');

    if (payload.signature !== expectedSig) {
        throw new Error('Invalid signature');
    }

    const orderId = payload.reference_number;
    await getOrderById(orderId);

    // map decision to status
    let newStatus: OrderStatus;
    switch (payload.decision) {
        case 'ACCEPT': newStatus = 'paid'; break;
        case 'REJECT': newStatus = 'payment failed'; break;
        default:       newStatus = 'payment pending';
    }

    await updateOrderStatus(orderId, newStatus, 'cybersource-webhook');

    const record: CsPaymentRecord = {
        request_id:  payload.request_id,
        decision:    payload.decision,
        reason_code: payload.reason_code,
        amount:      payload.amount,
        currency:    payload.currency,
        raw:         payload,
        created_at:  new Date().toISOString(),
    };
    await insertCsPayment(orderId, record);
}
