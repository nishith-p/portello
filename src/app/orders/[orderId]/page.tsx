import { PaymentForm } from "../(components)/payment-form"
import { getOrderById } from '@/lib/payhere/paymentRepository';
type Params = Promise<{ orderId: string }>;

type OrderDetails = Awaited<ReturnType<typeof getOrderById>>;

export default async function OrderPage({params,}: {params: Params; }) {
  const { orderId } = await params
  const orderDetails:OrderDetails = await getOrderById(orderId)
    console.log(orderDetails)
  return (
    <div className="container mx-auto py-10">
      <div className="max-w-2xl mx-auto">
        <PaymentForm
          orderId={orderId}
          amount={orderDetails.total_amount}
          currency="EUR"
          customer={orderDetails.users?.[0]}
        />
      </div>
    </div>
  )
}
