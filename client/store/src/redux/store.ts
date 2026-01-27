import { configureStore ,combineReducers } from "@reduxjs/toolkit";

import cartReducer from './cart/cartSlice'
import productReducer from './products/productSlice'
import orderReducer from './orders/orderSlice';
import inventoryReducer from './admin/inventory/inventorySlice';
import userReducer from './admin/accounts/accountsSlice'
import profitsReducer from './admin/profits/profitsSlice'
// export const store = configureStore({
//     reducer:{
//         products: productReducer,
//         cart: cartReducer,
//         counter: counterReducer,
//         orders: orderReducer,
//         inventory: inventoryReducer,
//         users: userReducer
//     }
// });

export const rootReducer = combineReducers({
    products: productReducer,
    cart: cartReducer,
    orders: orderReducer,
    inventory: inventoryReducer,
    users: userReducer,
    profits: profitsReducer
  });
  
  export const store = configureStore({
    reducer: rootReducer,
  });

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

