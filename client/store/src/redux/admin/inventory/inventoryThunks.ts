import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { api } from "../../../axios";

axios.defaults.withCredentials = true; 


export const addNewItem = createAsyncThunk(
    "admin/addNewItem",
    async ({name, description, img, price, quantity, category}:{name:string;description:string;img:string;price:number;quantity:number;category:string})=>{
        const res = await api.post("admin/addNewItem",
            {
                name,
                description, 
                img, 
                price, 
                quantity, 
                category
            },
            {
                withCredentials: true
            }
        )
        return res.data.product
    }
)



export const updatePrice = createAsyncThunk(
    "admin/updatePrice",
    async ({productId,price}:{productId:number,price:number})=>{
        const res = await api.post(`admin/updatePrice`,{
            productId,        
            price
        },
            {
             withCredentials: true,
            }
        )
        return {
            id: productId,
            price: res.data.price,
          };
    }
    
)

export const updateQuantity = createAsyncThunk(
    "admin/updateQuantity",
    async ({productId,quantity}:{productId:number,quantity:number})=>{
        const res = await api.post(`admin/updateQuantity`,{
            productId,        
            quantity
        },
            {
             withCredentials: true,
            }
        )
        return {
            id: productId,
            quantity: res.data.quantity,
          };
    }
    
)