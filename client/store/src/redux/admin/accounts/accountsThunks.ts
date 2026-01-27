import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { api } from "../../../axios";

axios.defaults.withCredentials = true; 


export const fetchUsers = createAsyncThunk(
    "admin/fetchUsers",
    async ()=>{
        const res = await api.get("admin/fetchUsers",
            {
                withCredentials:true
            }
        )

        return res.data.users
    }
)

export const addUserAsync = createAsyncThunk(
    "admin/addUser",
    async ({name, surname, role, email, password}:
        {name:string; surname:string; role:string; email:string; password:string})=>{
        const res = await api.post("admin/addNewUser",{
            name, 
            surname, 
            role, 
            email, 
            password
        },
        {
            withCredentials: true
        }
    )
        return res.data.success
    }
)
export const toggleBanUser = createAsyncThunk(
    "admin/addUser",
    async ({id, reason = "Violation of terms"}:
        {id:number, reason:string;})=>{
        const res = await api.post("admin/toggleBannedUser",{
            userId:id,
            reason
        },
        {
            withCredentials: true
        }
    )
        return res.data.success
    }
)