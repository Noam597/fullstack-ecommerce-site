import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { api } from "../../../axios";

axios.defaults.withCredentials = true; 

export const fetchProfitsData = createAsyncThunk(
  "profits/fetchProfitsData",
  async (_, { rejectWithValue }) => {
    try {
      const [weekly, monthly, yearly] = await Promise.all([
        api.get("/admin/orders/profits/daily", {
            withCredentials: true,
          params: { range: "days", value: 7 }
        }),
        api.get("/admin/orders/profits/daily", {
            withCredentials: true,
          params: { range: "month", value: "2025-12" }
        }),
        
        api.get("/admin/orders/profits/daily", {
            withCredentials: true,
          params: { range: "year", value: 2025 }
        })
      ]);

      return {
        weekly: weekly.data.data,
        monthly: monthly.data.data,
        yearly: yearly.data.data
      };
    } catch (err) {
      return rejectWithValue("Failed to fetch dashboard data");
    }
  }
);