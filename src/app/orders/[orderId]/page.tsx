import { PaymentForm } from "../(components)/payment-form"

// This would typically come from your database or API
async function getOrderDetails(orderId: string) {
  // Mock data for demonstration
  return {
    id: orderId,
    amount: "1000.00",
    currency: "LKR",
    customer: {
      firstName: "Saman",
      lastName: "Perera",
      email: "samanp@gmail.com",
      phone: "0771234567",
      address: "No.1, Galle Road",
      city: "Colombo",
      country: "Sri Lanka",
    },
  }
}

export default async function OrderPage({ params }: { params: { orderId: string } }) {
  const { orderId } = params
  const orderDetails = await getOrderDetails(orderId)

  // These would typically come from your environment variables or configuration
  const merchantId = process.env.PAYHERE_MERCHANT_ID || "123"
  const actionUrl = process.env.PAYHERE_ACTION_URL || "https://sandbox.payhere.lk/pay/checkout"
  const hash = "your_calculated_hash_here" // This should be calculated server-side

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-8 text-center">Complete Your Payment</h1>
      <div className="max-w-2xl mx-auto">
        <PaymentForm
          actionUrl={actionUrl}
          merchantId={merchantId}
          orderId={orderId}
          amount={orderDetails.amount}
          currency={orderDetails.currency}
          customer={orderDetails.customer}
          hash={hash}
        />
      </div>
    </div>
  )
}
