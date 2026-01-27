import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { api } from "../../axios";

axios.defaults.withCredentials = true; 

export const payForOrderAsync = createAsyncThunk(
  "orders/payForOrderAsync",
  async () =>{
    const res = await api.post(`/payment/order`,{},
      {
        withCredentials: true,
      }
    )
    return res.data
  }  
);

export const fetchOrdersAsync = createAsyncThunk(
    "orders/fetchOrdersAsync",
    async ({customerId}:{customerId:number}) => {
      const res = await api.get(`/payment/receipt/${customerId}`,
      {
        withCredentials: true,
      }
    );
      console.log("Orders API:",res.data)
      console.log("res.data.orders:", res.data.orders);
      return res.data.orders|| [];;
    }
  );
  