export interface OrderItem {
  id: string;
  item_code: string;
  order_id: string;
  quantity: number;
  price: number;
  size?: string;
  color?: string;
  color_hex?: string;
  name?: string;
  image?: string;
}

export interface Order {
  id: string;
  user_id: string;
  status: 'pending' | 'confirmed' | 'paid' | 'delivered' | 'cancelled';
  total_amount: number;
  shipping_address: {
    name: string;
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  created_at: string;
  updated_at: string;
  order_items: OrderItem[];
}

export type StatusColorMap = Record<Order['status'], string>;