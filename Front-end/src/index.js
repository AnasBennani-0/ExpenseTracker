import React from 'react';
import ReactDOM from 'react-dom/client';
// Ensure this points to the file containing your OKLCH variables
import './dist.css'; 
import App from './ExpenseTracker/App'
import reportWebVitals from './reportWebVitals';
import { ThemeProvider } from "./components/theme-provider";
import axios from 'axios';
import { Provider } from 'react-redux';
import store from './ExpenseTracker/store/store';
axios.defaults.baseURL = 'http://localhost:8000';
axios.defaults.withCredentials = true;

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
<ThemeProvider defaultTheme="light">
  <Provider store={store}>
  <App />
  </Provider>
</ThemeProvider>
  </React.StrictMode>
);

reportWebVitals();