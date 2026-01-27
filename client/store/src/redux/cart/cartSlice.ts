import { createSlice } from "@reduxjs/toolkit";
import type { CartState } from "./types";
import {
  fetchCartAsync,
  addToCartAsync,
  // incrementQuantityAsync,
  decrementQuantityAsync
} from "./cartThunks";

const initialState: CartState = {
  cart_id: null,
  items: [],
  total: 0,
  loading: false,
  error: null,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    clearCart: (state) => {
      state.items = [];
      state.total = 0;
      state.cart_id = null;
      state.error = null;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    // Fetch full cart
    builder.addCase(fetchCartAsync.fulfilled, (state, action) => {
      const cart = action.payload;
    
      if (cart) {
        state.cart_id = cart.cart_id;
        state.items = cart.items;
        state.total = cart.total;
      } else {
        // Empty cart
        state.cart_id = null;
        state.items = [];
        state.total = 0;
      }
    
      state.loading = false;
      state.error = null;
    });
    

    builder.addCase(fetchCartAsync.pending, (state) => {
      state.loading = true;
      state.error = null;
    });

    builder.addCase(fetchCartAsync.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message ?? "Failed to fetch cart";
    });

    // Add item
    builder.addCase(addToCartAsync.fulfilled, (state, action) => {
      const newItem = action.payload;
      const existing = state.items.find(i => i.product_id === newItem.product_id);

      if (existing) {
        existing.quantity = newItem.quantity;
        existing.subtotal = existing.quantity * existing.price;
      } else {
        state.items.push(newItem);
      }

      state.total = state.items.reduce((sum, i) => sum + i.subtotal, 0);
    });

   
    builder.addCase(decrementQuantityAsync.fulfilled, (state, action) => {
      const data = action.payload;
    
      // If backend says it was removed
      if (data.removed) {
        state.items = state.items.filter(
          (item) => item.product_id !== data.product_id
        );
        return;
      }
    
      // Otherwise update quantity
      const updatedItem = data.item;
      const index = state.items.findIndex(
        (item) => item.product_id === updatedItem.product_id
      );
    
      if (index !== -1) {
        state.items[index].quantity = updatedItem.quantity;
      }
    });
  },
});

export const { clearCart } = cartSlice.actions;
export default cartSlice.reducer;


// for test purpouses
export const cartInitialState = initialState;