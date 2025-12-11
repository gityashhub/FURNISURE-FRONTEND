export interface Product {
  id: string;
  name: string;
  price: number;
  set_price?: number;
  image: string;
  images?: string[];
  brand: string;
  assembly: string;
  dimensions_cm: string;
  dimensions_inches: string;
  primary_material: string;
  product_rating: number;
  recommended_mattress_size?: string;
  room_type: string;
  seating_height?: number;
  storage: string;
  warranty: string;
  weight: string;
  category: string;
  description: string;
  has_set_option?:   boolean;
  created_at?: string;
  updated_at?: string;
}

export interface DatabaseOrder {
  id: string;
  customer_name: string;
  email: string;
  phone: string;
  address: string;
  pincode: string;
  total_amount: number;
  status: 'new' | 'dispatched' | 'completed';
  created_at: string;
  updated_at: string;
  payment_method: 'cod' | 'gateway';
  payment_status: 'pending' | 'paid';
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  price: number;
  selected_set: boolean;
  created_at: string;
  product?: Product;
}
