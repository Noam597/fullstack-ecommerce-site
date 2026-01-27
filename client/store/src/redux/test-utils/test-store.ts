import { configureStore } from "@reduxjs/toolkit";
// import type { PreloadedState } from '@reduxjs/toolkit';
import { cartInitialState} from "../cart/cartSlice";
import { productInitialState } from "../products/productSlice";
import { orderInitialState } from "../orders/orderSlice";
import { inventoryInitialState } from "../admin/inventory/inventorySlice";
import { userInitialState } from "../admin/accounts/accountsSlice"
import { rootReducer, type RootState } from "../store";
import { profitsInitialState } from "../admin/profits/profitsSlice";

export const createTestStore = (preloadedState?: Partial<RootState>) =>
  configureStore({
    reducer: rootReducer,
    preloadedState: {
      products: productInitialState,  
      cart: cartInitialState,
      orders: orderInitialState,
      inventory: inventoryInitialState,
      users: userInitialState,
      profits: profitsInitialState,
      ...preloadedState,
    },
  });


  