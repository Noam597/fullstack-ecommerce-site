import { createSlice } from "@reduxjs/toolkit";
import type { UsersState } from "./types";
import { fetchUsers } from "./accountsThunks";

const initialState: UsersState ={
    userId:null,
    users:[],
    status:"idle",
    error:null
}


const usersSlice = createSlice({
    name:"users",
    initialState,
    reducers:{},
    extraReducers:(builder)=>{
        builder
        .addCase(fetchUsers.fulfilled, (state, action)=>{
            const users = action.payload;
            if(users){
                state.userId = action.payload[0]?.id
                state.users = users
            }else{
                state.users = []
            }
            state.status = "succeeded"
            state.error = null;
        })
        .addCase(fetchUsers.pending, (state)=>{
            state.status = "loading"
            state.error = null;
        })
        
        .addCase(fetchUsers.rejected, (state, action)=>{
            state.status = "failed"
            state.error = action.error.message ?? "Failed to fetch users"
        })
    }
})

export default usersSlice.reducer;

//For test porpuses
export const userInitialState = initialState;