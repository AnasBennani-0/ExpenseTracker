import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL?.endsWith("/")
  ? process.env.REACT_APP_API_URL
  : process.env.REACT_APP_API_URL + "/";

export const fetchTransactions = createAsyncThunk(
  "transaction/fetchTransactions",
  async (filters = {}, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}transactions`, {
        params: filters,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const addTransaction = createAsyncThunk(
  "transactions/add",
  async (data, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${API_URL}transactions`, data);
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const updateTransaction = createAsyncThunk(
  "transactions/update",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const res = await axios.put(`${API_URL}transactions/${id}`, data);
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const deleteTransaction = createAsyncThunk(
  "transactions/delete",
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_URL}transactions/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchDashboardStats = createAsyncThunk(
  "transaction/fetchStats",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}dashboard/stats`);
      return response.data;
    } catch (error) {
      console.error("🚨 LE MESSAGE SECRET DE LARAVEL :", error.response?.data);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const transactionSlice = createSlice({
  name: "transactions",
  initialState: {
    dbtrans: [],
    meta: { current_page: 1, last_page: 1, total: 0 },
    stats: { totalIncome: 0, totalExpense: 0, balance: 0, chartData: [] },
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTransactions.fulfilled, (state, action) => {
        if (action.payload.data) {
          state.dbtrans = action.payload.data;
          state.meta = {
            current_page: action.payload.current_page,
            last_page: action.payload.last_page,
            total: action.payload.total,
          };
        } else {
          state.dbtrans = action.payload;
        }
        state.loading = false;
        state.error = null;
      })
      .addCase(addTransaction.fulfilled, (state, action) => {
        state.dbtrans.unshift(action.payload);
        state.error = null;
      })
      .addCase(updateTransaction.fulfilled, (state, action) => {
        const index = state.dbtrans.findIndex((t) => t.id === action.payload.id);
        if (index !== -1) state.dbtrans[index] = action.payload;
        state.error = null;
      })
      .addCase(fetchDashboardStats.fulfilled, (state, action) => {
        state.stats = action.payload;
        state.error = null;
      })
      .addCase(deleteTransaction.fulfilled, (state, action) => {
        state.dbtrans = state.dbtrans.filter((t) => t.id !== action.payload);
        state.error = null;
      })
      .addMatcher(
        (action) => action.type.endsWith("/pending"),
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )
      .addMatcher(
        (action) => action.type.endsWith("/rejected"),
        (state, action) => {
          state.loading = false;
          state.error = action.payload || action.error.message;
        }
      );
  },
});

export default transactionSlice.reducer;
