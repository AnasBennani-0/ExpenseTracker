import {configureStore} from '@reduxjs/toolkit';
import CatSlice from './CatSlice';
import TransSlice from './TransSlice';
import BudgSlice from './BudgSlice';

const store=configureStore({
        reducer:{
            categories:CatSlice,
            transaction:TransSlice,
            budgets:BudgSlice
        }
    
})

export default store;