

export interface NewProduct{
    id?:number
    name: string;
    description: string;
    img?: string;
    price: number;
    quantity: number;
    category: string;
}

export interface InventoryState{
    items:NewProduct[];
    loading: boolean;
    error: string | null;
}