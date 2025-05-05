import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { Button } from '@mantine/core';
import PaymentForm from '@/app/orders/(components)/payment-form';
import { createPayhereCheckout } from '@/lib/payhere/paymentService';
import { getOrder } from '@/lib/store/orders/db';

interface PaymentPageProps {
  params: {
    orderId: string;
  };
}

export default async function PaymentPage({ params }: PaymentPageProps) {
  const { orderId } = params;

  try {
    // 1. Fetch order details
    const order = await getOrder(orderId);
    const { getUser } = getKindeServerSession();
    const user = await getUser();

    if (!order) {
      return notFound();
    }

    // 2. Generate payment data
    const paymentData = await createPayhereCheckout({
      orderId: order.id,
      amount: order.total_amount,
    });

    return (
      <div className="container mx-auto p-6 max-w-md">
        <h1 className="text-2xl font-bold mb-2">Complete Your Payment</h1>
        <p className="text-gray-500 mb-6">Order #{order.id}</p>

        <div className="mb-6 p-4 bg-gray-50 rounded-md">
          <div className="flex justify-between mb-2">
            <span className="text-gray-600">Amount: </span>
            <span className="font-semibold">
              {new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'EUR',
              }).format(order.total_amount)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Name: </span>
            <span className="font-semibold capitalize">{user.given_name}</span>
          </div>
        </div>

        <PaymentForm actionUrl={paymentData.actionUrl} fields={paymentData.fields} />

        <div className="mt-4">
          <Link href="/orders">
            <Button variant="outline" className="w-full">
              Back to Orders
            </Button>
          </Link>
        </div>
      </div>
    );
  } catch (error) {
    console.error('Payment page error:', error);

    return (
      <div className="container mx-auto p-6 max-w-md">
        <h1 className="text-2xl font-bold mb-6">Payment Error</h1>
        <div className="p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-700">
            {error instanceof Error ? error.message : 'Failed to load payment information'}
          </p>
        </div>
        <Link href="/orders">
          <Button className="mt-4 w-full">Back to Orders</Button>
        </Link>
      </div>
    );
  }
}
