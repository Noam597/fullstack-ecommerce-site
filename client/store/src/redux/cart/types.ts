export interface Product {
    id: number;
    name: string;
    price: number;
    img: string;
    description: string;
    quantity: number;
  }
  
  export interface CartItem {
    id: number;
    cart_id: number;
    product_id: number;
    quantity: number; // quantity inside cart
    name: string;     // product name
    price: number;
    img: string;
    description: string;
    subtotal: number; // backend calculates
  }
  
  export interface CartState {
    cart_id: number | null;
    items: CartItem[];
    total: number;
    loading: boolean;
    error: string | null;
  }
  