import { createAsyncThunk , createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const intitState={
    dbCat:[],
    isloading:false,
    error:null
}

const API_URL = "http://localhost:8000/categorie";

export const getCat=createAsyncThunk("/categorie/getCat",async()=>{
    const response= await axios.get(API_URL);
    return response.data
})
export const addCat=createAsyncThunk("/categorie/addCat",async(newcat)=>{
    const response= await axios.post(API_URL,newcat);
    return response.data
})
export const deleteCat=createAsyncThunk("/categorie/deleteCat",async(id)=>{
    await axios.delete(`${API_URL}/${id}`);
    return id
})
export const editCat=createAsyncThunk("/categorie/editCat",async(newcat)=>{
    const response= await axios.put(`${API_URL}/${newcat.id}`,newcat);
    return response.data
})

const catSlice=createSlice({
    name:"categorie",
    initialState:intitState,
    extraReducers:(builder)=>{
       builder.addCase(getCat.fulfilled,(state,action)=>{state.isloading=false;state.dbCat=action.payload})
              .addCase(addCat.fulfilled,(state,action)=>{state.dbCat.push(action.payload)})
              .addCase(deleteCat.fulfilled,(state,action)=>{state.dbCat=state.dbCat.filter(cat=>cat.id!==action.payload)})
              .addCase(editCat.fulfilled,(state,action)=>{const i=state.dbCat.findIndex(cat=>cat.id==action.payload.id);state.dbCat[i]=action.payload})
              .addCase(getCat.pending,(state)=>{state.isloading=true})
        .addCase(getCat.rejected,(state,action)=>{state.error=action.error.message})
    }
}
)

export default catSlice.reducer;