export interface Products {
    id: number;
    name: string;
    description: string;
    img?: string;
    price: number;
    quantity: number;
    category: string;

}

export interface ProductState{
    products:Products[];
    product_id: number | null;
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error?: string | null;
}