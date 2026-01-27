export interface OrderItem {
    product_id: number;
    product_name: string;
    price: number;
    quantity: number;
    subtotal: number;
  }
  
  export interface Order {
    order_id: number;
    order_code: string;
    email: string;
    customer_name: string;
    order_total: string;      // keep string if server returns string
    created_at: string;
    subtotal_sum: string;
    items: OrderItem[];
  }
  
  // 3️⃣ Slice state
  export interface OrdersState {
    orders: Order[];
    loading: boolean;
    error: string | null;
    lastOrder?: {
      order_id: number;
      order_code: string;
      order_total: string;
    };
    paymentSuccess?: boolean;
  }
  