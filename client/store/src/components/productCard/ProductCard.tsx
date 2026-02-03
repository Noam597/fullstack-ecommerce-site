
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
    
    {!loading && <div key={id} className='w-[200px] h-[300px] m-4 p-2 flex flex-col items-center bg-black rounded-lg'>
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
              <div className="mt-auto flex flex-col items-center gap-2 w-full">
            <Button onClick={onAddToCart}>ADD TO CART</Button>
            </div>

          ):(
            <div className="mt-auto flex flex-col items-center gap-2 w-full">
            <Button onClick={onRemoveFromCart}>REMOVE FROM CART</Button></div>)
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
      <div className="flex items-center justify-center gap-3">
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

