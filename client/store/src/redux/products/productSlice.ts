import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Products, ProductState } from "./types.ts";
import axios from 'axios'
import { api } from "../../axios.ts";

axios.defaults.withCredentials = true;



export const fetchProducts = createAsyncThunk('product/fetchProducts',
     async (_, { rejectWithValue })=>{
    try{
      const res = await api.get('/store/products',{
        withCredentials:true
      });
    console.log("API response:", res.data);
    return res.data.products as Products[];  
    }catch (err) {
        console.error("Failed to Fetch Products:", err);
        return rejectWithValue('Our server is down. Please try again later.');
      }
    
})

const initialState:ProductState = {
    products:[],
    product_id: null,
    status:"idle",
    error:null
}

const productSlice = createSlice({
    name: "products",
    initialState,
    reducers:{},
    extraReducers:(builder) => {
        builder
        .addCase(fetchProducts.pending,(state)=> {
            state.status = 'loading';
            state.error = null;
        })
        .addCase(fetchProducts.fulfilled,(state, action:PayloadAction<Products[]>)=> {
            state.status = 'succeeded';
            state.products = action.payload || [];
            state.product_id = action.payload[0]?.id ?? null;
            
        })
        .addCase(fetchProducts.rejected,(state, action)=> {
            state.status = 'failed';
            state.error = action.error.message?? 'Failed to fetch products';
        })
}
})


export default productSlice.reducer;


export const productInitialState = initialState;