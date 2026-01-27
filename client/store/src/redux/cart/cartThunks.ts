// cartThunks.ts
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { api } from "../../axios";

axios.defaults.withCredentials = true; 




export const fetchCartAsync = createAsyncThunk(
  "cart/fetchCartAsync",
  async ({customerId}:{customerId:number}) => {
    const res = await api.get(`/store/getCartItem/${customerId}`,
    //   {
    //   headers: {Authorization: `Bearer ${token}`}
    // },
    {
      withCredentials: true,
    }
  );
    console.log("Cart API:",res.data)
    return res.data.cart?? { cart_id: null, items: [], total: 0 };;
  }
);


export const addToCartAsync = createAsyncThunk(
  "cart/addToCartAsync",
  async ({ cart_id, product_id, quantity}: { cart_id: number; product_id: number; quantity: number}) => {
    const res = await api.post("/store/cartItem", { 
      cart_id, product_id, quantity 
    },
    {
      withCredentials: true, // ⬅️ cookie automatically included
    });
    return res.data.item; 
  }
);

export const decrementQuantityAsync = createAsyncThunk(
  "cart/decrementQuantityAsync",
  async ({ cart_id, product_id, decrement}: { cart_id: number; product_id: number; decrement: number }) => {
    const res = await api.post("/store/cartItem/remove", {
      cart_id,
      product_id,
      decrement,
    },
    {
      withCredentials: true, 
    });
    return res.data; 
  }
);

export const removeCartItemAsync = createAsyncThunk(
  "cart/removeCartItemAsync",
  async ({ cart_id, product_id}: { cart_id: number; product_id: number;}) => {
    const res = await api.post("/store/cartItem/removeItem", { cart_id, product_id}
      ,
      {
        withCredentials: true, 
      }
    );
    return res.data;
  }
)

export const clearCartAsync = createAsyncThunk(
  "cart/removeCartItemAsync",
  async ({ cart_id}: { cart_id: number;}) => {
    const res = await api.post("/store/cartItem/clearCart", { cart_id }
      ,
      {
        withCredentials: true, 
      }
    );
    return res.data;
  }
)
