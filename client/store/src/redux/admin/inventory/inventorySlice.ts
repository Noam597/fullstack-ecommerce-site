import { createSlice } from "@reduxjs/toolkit";
import type { InventoryState } from "./types";
import type { PayloadAction } from "@reduxjs/toolkit";
import { addNewItem, updatePrice,updateQuantity } from "./inventoryThunks";
import type { NewProduct } from "./types";


const initialState: InventoryState = {
    items: [],
    loading: false,
    error: null,
  };
  
  const inventorySlice = createSlice({
    name: "inventory",
    initialState,
    reducers: {},
  
    extraReducers: (builder) => {
      builder
         /* =========================
           ADD NEW ITEM
        ========================= */
  
        .addCase(addNewItem.pending, (state) => {
            state.loading = true;
            state.error = null;
          })
    
          .addCase(addNewItem.fulfilled, (state, action: PayloadAction<NewProduct>) => {
            state.loading = false;
            state.items.push(action.payload)
            
          })
    
          .addCase(addNewItem.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message ?? "Failed to update price";
          })
        /* =========================
           UPDATE PRICE
        ========================= */
  
        .addCase(updatePrice.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
  
        .addCase(updatePrice.fulfilled, (state, action: PayloadAction<{ id: number; price: number }>) => {
          state.loading = false;
  
          const product = state.items.find(p => p.id === action.payload.id);
          if (product) {
            product.price = action.payload.price;
          }
        })
  
        .addCase(updatePrice.rejected, (state, action) => {
          state.loading = false;
          state.error = action.error.message ?? "Failed to update price";
        })
  
        /* =========================
           UPDATE QUANTITY
        ========================= */
  
        .addCase(updateQuantity.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
  
        .addCase(updateQuantity.fulfilled, (state, action: PayloadAction<{ id: number; quantity: number }>) => {
          state.loading = false;
  
          const product = state.items.find(p => p.id === action.payload.id);
          if (product) {
            product.quantity =  action.payload.quantity;
        }
      })

      .addCase(updateQuantity.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? "Failed to update quantity";
      });
  },
});

export default inventorySlice.reducer;

export const inventoryInitialState = initialState;