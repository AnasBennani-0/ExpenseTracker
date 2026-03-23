import { createAsyncThunk,createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL ="http://localhost:8000/budgets";

export const fetchBudgets =createAsyncThunk("budgets/fetch",async () => { 
       const res = await axios.get(API_URL);
       return res.data;
    });
export const addBudgets = createAsyncThunk("budgets/add", async (data) => {
        const res = await axios.post(API_URL, data);
        return res.data;
    });
    
export const updateBudgets = createAsyncThunk("budgets/update", async ({id, data}) => {
        const res = await axios.put(`${API_URL}/${id}`, data);
        return res.data;
    });
    
export const deleteBudgets = createAsyncThunk("budgets/delete", async (id) => {
        await axios.delete(`${API_URL}/${id}`);
        return id; 
    });

const budgetSlice = createSlice({
    name: "budgets",
    initialState: { dbbudg: [], loading: false, error: null },
    reducers: {},
    extraReducers: (builder) => {
        builder
      
            .addCase(fetchBudgets.fulfilled, (state, action) => {
                state.dbbudg = action.payload;
                state.loading = false;
            })
        
            .addCase(addBudgets.fulfilled, (state, action) => {
                state.dbbudg.unshift(action.payload); 
            })
    
            .addCase(updateBudgets.fulfilled, (state, action) => {
                const index = state.dbbudg.findIndex(t => t.id === action.payload.id);
                if (index !== -1) state.dbbudg[index] = action.payload;
            })
           
            .addCase(deleteBudgets.fulfilled, (state, action) => {
                state.dbbudg = state.dbbudg.filter(t => t.id !== action.payload);
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

export default budgetSlice.reducer;
    