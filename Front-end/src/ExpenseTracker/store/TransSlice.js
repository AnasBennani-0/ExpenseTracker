import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from 'axios';

const API_URL = "http://localhost:8000/transactions";

export const fetchTransactions = createAsyncThunk(
    "transaction/fetchTransactions",
    async (filters = {}) => {
        const response = await axios.get("http://localhost:8000/transactions", { 
            params: filters 
        });
        return response.data;
    }
);

export const addTransaction = createAsyncThunk("transactions/add", async (data) => {
    const res = await axios.post(API_URL, data);
    return res.data;
});

export const updateTransaction = createAsyncThunk("transactions/update", async ({id, data}) => {
    const res = await axios.put(`${API_URL}/${id}`, data);
    return res.data;
});

export const deleteTransaction = createAsyncThunk("transactions/delete", async (id) => {
    await axios.delete(`${API_URL}/${id}`);
    return id; 
});

export const fetchDashboardStats = createAsyncThunk(
    "transaction/fetchStats",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get("http://localhost:8000/dashboard/stats");
            return response.data;
        } catch (error) {
            // 🔥 C'est CETTE ligne qui va nous donner la vraie erreur de Laravel !
            console.error("🚨 LE MESSAGE SECRET DE LARAVEL :", error.response?.data);
            return rejectWithValue(error.response?.data);
        }
    }
);


const transactionSlice = createSlice({
    name: "transactions",
    initialState: { dbtrans: [], meta: { current_page: 1, last_page: 1, total: 0 },stats: { totalIncome: 0, totalExpense: 0, balance: 0, chartData: [] }, loading: false, error: null },
    reducers: {},
    extraReducers: (builder) => {
        builder
      
        .addCase(fetchTransactions.fulfilled, (state, action) => {
           
            if (action.payload.data) {
                state.dbtrans = action.payload.data;
                state.meta = {
                    current_page: action.payload.current_page,
                    last_page: action.payload.last_page,
                    total: action.payload.total
                }; 
            } else {
                
                state.dbtrans = action.payload;
            }
            state.loading = false;
        })
        
            .addCase(addTransaction.fulfilled, (state, action) => {
                state.dbtrans.unshift(action.payload); 
            })
    
            .addCase(updateTransaction.fulfilled, (state, action) => {
                const index = state.dbtrans.findIndex(t => t.id === action.payload.id);
                if (index !== -1) state.dbtrans[index] = action.payload;
            })
            .addCase(fetchDashboardStats.fulfilled, (state, action) => {
                state.stats = action.payload;
            })
           
            .addCase(deleteTransaction.fulfilled, (state, action) => {
                state.dbtrans = state.dbtrans.filter(t => t.id !== action.payload);
            })
       
            .addMatcher(action => action.type.endsWith('/pending'), (state) => {
                state.loading = true;
            })
            .addMatcher(action => action.type.endsWith('/rejected'), (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
            
    }
});

export default transactionSlice.reducer;