// Cart.tsx
import React,{useEffect} from "react";
import { useUser } from "../../contexts/UserContexts";
import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "../../redux/store";
import ProductCard from "../../components/productCard/ProductCard";
import type { CartItem } from "../../redux/cart/types";
import Button from "../../components/button/Button";
import { useNavigate } from "react-router-dom";
import { fetchCartAsync,
   addToCartAsync, 
   decrementQuantityAsync,
   removeCartItemAsync} from "../../redux/cart/cartThunks";
const Cart: React.FC = () => {

  const { user } = useUser()
  const navigate = useNavigate()
  const dispatch = useDispatch<AppDispatch>();
  
  const cart = useSelector((state: RootState) => state.cart.items) 
  const cart_id = useSelector((state: RootState) => state.cart.cart_id);  
  
  useEffect(() => {
    if(user){
      dispatch(fetchCartAsync({customerId:user!.id}))
    }
    console.log(cart)
   
  }, [user,dispatch])
  

  const handleIncrement = async (item:CartItem) => {
    if (!cart_id) {
      console.warn("Cart not loaded yet");
      return;
    }
    const cartItem = {
      cart_id,
      product_id:item.product_id,          // map name → product
      quantity: 1, 
      // token:token!   // map in_stock → inStock
                     // initial quantity
    };
    
    await dispatch(addToCartAsync(cartItem));
    dispatch(fetchCartAsync({customerId:user!.id}))
    console.log(cartItem)
    console.log(cart)
  };

  const handleDecrement = async  (item:CartItem)=>{
    if (!cart_id) {
      console.warn("Cart not loaded yet");
      return;
    }
    const cartItem = {
      cart_id,
      product_id: item.product_id,  
      decrement: 1,
      
    };
    await dispatch(decrementQuantityAsync(cartItem))
    dispatch(fetchCartAsync({customerId:user!.id}))
    console.log(cartItem)

  }

  const handleRemoveItem = async (item:CartItem) => {
    if (!cart_id) {
      console.warn("Cart not loaded yet");
      return;
    }
    const cartItem = {
      cart_id,
      product_id: item.product_id,
      // token:token!
   
  };
  await dispatch(removeCartItemAsync(cartItem))
  dispatch(fetchCartAsync({customerId:user!.id}))
  console.log(cartItem)
  }

  return (
    <div className="w-full">
      <h1 className="text-4xl">🛒 Shopping Cart</h1>
      
      <div className="flex flex-wrap justify-between mt-12 mb-12 w-full">
      {cart.length > 0 ? cart.map((item)=>(
        <ProductCard
        id={item.id}
        name={item.name}
        description={item.description}
        img={item.img}
        price={item.subtotal}
        quantity={item.quantity}
        cartQuantity={item.quantity}
        inShop={false}
        inCart={true}
        onIncreaseQty={()=>handleIncrement(item)}
        onDecreaseQty={()=>handleDecrement(item)}
        onRemoveFromCart={()=>handleRemoveItem(item)}
        />
       
      )):<p>Cart is Empty</p>}
      </div> 
      <Button type="button" onClick={()=>navigate('/checkout')}>CheckOut</Button>
    </div>
  );
};

export default Cart;
