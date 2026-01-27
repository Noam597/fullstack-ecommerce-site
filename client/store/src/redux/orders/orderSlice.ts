import type { OrdersState, Order } from "./types";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { fetchOrdersAsync, payForOrderAsync } from "./ordersThunks";


const initialState: OrdersState = {
    orders: [],
    loading: false,
    error: null,
    
  };
  
  // 4️⃣ Create the slice
  const ordersSlice = createSlice({
    name: 'orders',
    initialState,
    reducers: {
      clearOrders: (state) => {
        state.orders = [];
        state.error = null;
        state.loading = false;
      },
    },
    extraReducers: (builder) => {
      builder
        .addCase(fetchOrdersAsync.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(fetchOrdersAsync.fulfilled, (state, action: PayloadAction<Order[]>) => {
          state.loading = false;
          state.orders = action.payload;
        })
        .addCase(fetchOrdersAsync.rejected, (state, action: PayloadAction<any>) => {
          state.loading = false;
          state.error = action.payload;
        })

        // payForOrderAsync
    .addCase(payForOrderAsync.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(payForOrderAsync.fulfilled, (state, action: PayloadAction<Order>) => {
      state.loading = false;
      state.error = null;
      state.lastOrder = {
        order_id: action.payload.order_id,
        order_code: action.payload.order_code,
        order_total: action.payload.order_total,
      };
      state.paymentSuccess = true;
    })
    .addCase(payForOrderAsync.rejected, (state, action: PayloadAction<any>) => {
      state.loading = false;
      state.error = action.payload;
    });
    },
  });
  
  export const { clearOrders } = ordersSlice.actions;
  
  export default ordersSlice.reducer;

  export const orderInitialState = initialState;