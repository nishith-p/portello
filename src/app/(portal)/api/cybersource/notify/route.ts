import { NextResponse } from 'next/server';
import { processCybersourceNotification } from '@/lib/cybersource/cybersourceService';

export async function POST(req: Request) {
    const form = await req.formData();
    const payload: Record<string,string> = {};
    form.forEach((value, key) => { payload[key] = value.toString(); });

    // verify signature and update
    try {
        await processCybersourceNotification(payload);
        return NextResponse.json({ status: 'ok' });
    } catch(err: any) {
        console.error('CS Notify Error', err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}