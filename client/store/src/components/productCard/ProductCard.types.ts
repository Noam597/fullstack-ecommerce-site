export interface ProductCardProps {
    id: number;
    name: string;
    description?: string;
    img?: string
    price: number;
    quantity: number;
    cartQuantity?: number;
    category?:string;
    inCart?:boolean;
    inShop?:boolean;

    onAddToCart?:()=> void;
    onRemoveFromCart?:()=> void;
    onIncreaseQty?:()=> void;
    onDecreaseQty?:()=> void;

    loading?:boolean

}