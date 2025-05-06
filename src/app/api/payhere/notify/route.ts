// app/api/payhere/notify/route.ts
import { NextResponse } from 'next/server';
import { processPayHereNotification } from '@/lib/payhere/paymentService';

export async function POST(req: Request) {
    // PayHere posts x-www-form-urlencoded, so we need to parse it
    const formData = await req.formData();
    const payload: Record<string, string> = {};
    formData.forEach((value, key) => {
        payload[key] = Array.isArray(value) ? value[0] : value.toString();
    });

    try {
        await processPayHereNotification(payload);
        // Always respond 200 OK to PayHere on successful handling
        return NextResponse.json({ status: 'ok' });
    } catch (err: any) {
        console.error('PayHere notify error:', err);
        // Return a non-2xx if you want PayHere to retry
        return NextResponse.json(
            { error: err.message || 'Processing error' },
            { status: 500 }
        );
    }
}
