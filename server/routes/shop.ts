import { Router } from 'express';
import { addToCart, getAllItems, 
    getFullCart, 
    testCartContents, 
    addQuantity, 
    subtractQuantity, 
    getCartById,
    decrementOrRemoveCartItem,
    removeCartItem,
    clearCart} from "../controller/shop.ts"
import { authToken } from '../middleware/jwtAuth.ts';
const shopRouter = Router();


shopRouter.get('/products', getAllItems);
shopRouter.get('/cartId', testCartContents);
shopRouter.get('/cartId/:id', getCartById);
shopRouter.post('/cartItem',authToken, addToCart);
shopRouter.post('/cartItem/remove',authToken, decrementOrRemoveCartItem);
shopRouter.post('/cartItem/removeItem',authToken, removeCartItem)
shopRouter.post('/cartItem/clearCart', authToken, clearCart)
shopRouter.post('/cartItem/add', authToken,addQuantity);
shopRouter.post('/cartItem/subtract', subtractQuantity);

shopRouter.get('/getCartItem/:id', authToken, getFullCart)



export {shopRouter};