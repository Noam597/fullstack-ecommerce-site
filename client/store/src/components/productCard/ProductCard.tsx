
import type { ProductCardProps } from './ProductCard.types'
import Button from '../button/Button'
import { useUser } from '../../contexts/UserContexts';
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from '../loading-spinner/LoadingSpinner';

const ProductCard  = ({id, 
  name, 
  description,
  img, 
  price, 
  quantity, 
  cartQuantity, 
  inCart=true, 
  inShop=true,
  loading,
  onAddToCart,
  onRemoveFromCart,
  onIncreaseQty,
  onDecreaseQty}:ProductCardProps) => {

    const { user } = useUser();
    const navigate = useNavigate();


  return (
<>
{loading && <LoadingSpinner/>}
    
    {!loading && <div key={id} className='w-[200px] h-[300px] m-4 p-2 flex-col bg-black rounded-lg'>
        {/* <p>{category}</p> */}
        <img className='w-[95%] h-[48%] m-[2%]' src={img} alt={description}/>
        <h2 className='text-xl'>{name}</h2> 
        {/* <p className='text-sm'>{description}</p> */}
        
        <p  className='text-lg m-2'>{price}$</p>

        {!inCart && (
          <>

          {!user && (
          <Button onClick={()=>navigate('/login')}>Login to Add to Cart</Button>
        )}
          {user && quantity > 0 && (
            !inCart?( 
            <Button onClick={onAddToCart}>ADD TO CART</Button>
          ):(
            <Button onClick={onRemoveFromCart}>REMOVE FROM CART</Button>)
            )}

          
          {user && quantity === 0 && (
            <p>Out of stock</p>
          )}

          
          </>

          
        )}

{inCart && (
  <>
    {inShop ? (
      <Button onClick={onRemoveFromCart}>REMOVE FROM CART</Button>
    ) : (
      <>
      <div className='flex justify-center'>
        <Button onClick={onDecreaseQty}>-</Button>
        <p data-testid="quantity">{cartQuantity}</p>
         <Button onClick={onIncreaseQty}>+</Button>
       </div> 
        <Button onClick={onRemoveFromCart}>REMOVE FROM CART</Button>
      </>
    )}
  </>
)}
     



        
        
        
        
    </div>}
    </>
  )
}

export default ProductCard

