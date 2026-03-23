import { BrowserRouter,Routes,Route } from "react-router-dom";
import Header from "./Header/Header";
import Login from './Auth/Login';
import Register from './Auth/Register';
import Transaction from "./Transaction/Transaction";
import Home from "./Home";
import Dash from "./Dashboard/Dashboard";
import Footer from "./Footer/Footer";
import Profile from "./Profile";
import Budget from "./budget/budget"


export default function App(){

    return(
        <BrowserRouter>
        <Header />
          <Routes>
              <Route path="/" element={<Home />}/>
              <Route path="/Dashboard" element={<Dash />}/>
              <Route path="/Login" element={<Login />}/>
              <Route path="/Register" element={<Register />}/>
              <Route path="/Transaction" element={<Transaction />}/>
              <Route path="/Profile" element={<Profile />} />
              <Route path="/Budget" element={<Budget />} />
          </Routes>
        <Footer />
        </BrowserRouter>
    )
}