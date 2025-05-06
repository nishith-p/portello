export interface PricingFeature {
    text: string;
  }
  
  export interface PricingPlan {
    packageId: string;
    title: string;
    price: number;
    originalPrice?: number;
    currency?: string;
    features: PricingFeature[];
    badge?: string;
    badgeColor?: string;
    buttonText?: string;
    highlighted?: boolean;
  }
  
  export interface PricingGridProps {
    title?: string;
    description?: string;
    plans: PricingPlan[];
    onSelect?: (plan: PricingPlan) => void;
  }
  
  export interface CustomerInfo {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    country: string;
  }
  
  export interface CheckoutData {
    orderId: string;
    orderTitle: string;
    amount: number;
    quantity: number;
    customer: CustomerInfo;
  }
  
  export interface PayhereResponse {
    actionUrl: string;
    fields: Record<string, string>;
  }