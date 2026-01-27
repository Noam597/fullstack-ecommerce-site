import React, { useEffect } from 'react';
import ProductCard from '../../components/productCard/ProductCard';
import { useUser } from '../../contexts/UserContexts';
import type { RootState, AppDispatch } from '../../redux/store';
import { addToCartAsync, decrementQuantityAsync } from '../../redux/cart/cartThunks';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '../../redux/products/productSlice';
import type { Products } from '../../redux/products/types';
import { fetchCartAsync } from '../../redux/cart/cartThunks';
import LoadingSpinner from '../../components/loading-spinner/LoadingSpinner';
import Pagination from '../../components/pagination/Pagination';


const Shop:React.FC = () => {

  const { user, loadingUser } = useUser();
  const  products  = useSelector((state: RootState) => state.products.products);
  const  productsStatus  = useSelector((state: RootState) => state.products.status);
  const cart = useSelector((state: RootState) => state.cart.items);
  const cart_id = useSelector((state: RootState) => state.cart.cart_id);
  const loading = useSelector((state: RootState) => state.cart.loading);
  const dispatch = useDispatch<AppDispatch>();
  


  useEffect(() => {
    
      if(productsStatus === 'idle'){
        dispatch(fetchProducts()); 
      }
      
    
  }, [dispatch, productsStatus]);

  useEffect(() => {
    
    if (user?.id && cart_id == null){
      dispatch(fetchCartAsync({customerId:user.id}));
    }
   
    
  }, [dispatch,user?.id,cart_id]);



  console.log({ products, productsStatus, cart, cart_id, loading });

  const handleAddToCart = (product: Products) => {
    if (!cart_id) {
      console.warn("Cart not loaded yet");
      return;
    }
    const cartItem = {
      cart_id,
      product_id: product.id,          
      quantity: 1,    
    };
    
    dispatch(addToCartAsync(cartItem));
    console.log(cartItem)
  };
 
if( productsStatus === "failed") {
  return <div>Failed to load...</div>
}
  const handleRemoveFromCart = (product:Products)=>{
    if (!cart_id) {
      console.warn("Cart not loaded yet");
      return;
    }
    const cartItem = {
      cart_id,
      product_id: product.id,  
      decrement: 1
    };
    dispatch(decrementQuantityAsync(cartItem))
    console.log(cartItem)

  }


  if( productsStatus === "loading" || !user || products.length === 0 || !cart_id) {
  return <LoadingSpinner/>
  }
  


  return (
    <div>
        <h1 className='text-3xl'>WELCOME TO THE SHOP!</h1>
        <Pagination items={products} itemsPerPage={10}>{(products)=>
        <div className='flex flex-wrap justify-between w-full '>
          
        {products.map((product)=>{
          const {id, name ,description ,price ,quantity ,img ,category} =product;
          const isInCart =cart_id? cart?.some((item) => item.product_id === id) : false;

         return <div key={id}>
          <ProductCard 
          loading={loadingUser}
          id={id} 
          name={name} 
          description={description} 
          price={price} 
          quantity={quantity}  
          img={img} 
          category={category} 
          inCart={isInCart}
          inShop={true}
          onAddToCart={()=>handleAddToCart(product)}
          onRemoveFromCart={()=>handleRemoveFromCart(product)}
          />
         </div>
        })}</div>}</Pagination>
       
    </div>
  )
}

export default Shop