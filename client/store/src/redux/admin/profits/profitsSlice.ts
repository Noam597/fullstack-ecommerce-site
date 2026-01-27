import { createSlice} from "@reduxjs/toolkit";
import type { ProfitState } from "./types";
import { fetchProfitsData } from "./ProfitsThunk";



const initialState :ProfitState = {
    weekly: [] ,
    monthly: [],
    yearly: [],
    loading: false,
    error: null 
  }

 export const profitsSlice = createSlice({
    name: "profits",
    initialState,
    reducers: {},
    extraReducers: builder => {
      builder
        .addCase(fetchProfitsData.pending, state => {
          state.loading = true;
          state.error = null;
        })
        .addCase(fetchProfitsData.fulfilled, (state, action) => {
          state.weekly = action.payload.weekly;
          state.monthly = action.payload.monthly;
          state.yearly = action.payload.yearly;
          state.loading = false;
        })
        .addCase(fetchProfitsData.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload as string;
        });
    }
  });

export default profitsSlice.reducer;

export const profitsInitialState = initialState;