import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CustomerInfo, PricingPlan } from './types';

export function useCheckout() {
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Function to check if a plan is a bulk plan
  const isBulkPlan = (plan: PricingPlan): boolean => {
    return plan.packageId.includes('-b-');
  };

  // Process the selected plan and navigate accordingly
  const handlePlanSelection = (plan: PricingPlan, quantity?: number) => {
    if (isBulkPlan(plan) && (!quantity || quantity < 10)) {
      // For bulk plans, we need quantity of at least 10
      return { requiresQuantity: true, plan };
    } else {
      // For individual plans or bulk plans with valid quantity
      const queryParams = new URLSearchParams({
        packageId: plan.packageId
      });
      
      if (quantity && quantity >= 10) {
        queryParams.append('quantity', quantity.toString());
      }
      
      router.push(`/ysf/checkout?${queryParams.toString()}`);
      return { requiresQuantity: false };
    }
  };

  // Submit customer information and process payment
  const processPayment = async (checkoutData: {
    orderId: string;
    packageId: string;
    customer: CustomerInfo;
    quantity: number;
    total_amount: number;
  }) => {
    setIsProcessing(true);
    setError(null);
    
    try {
      // Create the PayHere checkout directly without needing to first create an order
      const response = await fetch('/api/payhere/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: checkoutData.orderId,
          customer: checkoutData.customer,
          total_amount: checkoutData.total_amount
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create checkout session');
      }

      const { actionUrl, fields } = await response.json();
      
      // Create and submit the form
      const formEl = document.createElement('form');
      formEl.method = 'POST';
      formEl.action = actionUrl;

      Object.entries(fields).forEach(([key, val]) => {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = key;
        input.value = String(val);
        formEl.appendChild(input);
      });

      document.body.appendChild(formEl);
      formEl.submit();
      
      return true;
    } catch (err) {
      console.error('Payment processing error:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      return false;
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    isBulkPlan,
    handlePlanSelection,
    processPayment,
    isProcessing,
    error
  };
}