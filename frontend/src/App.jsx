import React from "react";
import Home from "./pages/home/Home";
import Store from "./pages/Store/StorePage.jsx";
import Login from "./pages/Auth/Login.jsx";
import SignUp from "./pages/Auth/SignUp.jsx";
import ResetPassword from "./pages/Auth/ResetPassword.jsx";
import Verification from "./pages/Auth/Verification.jsx";
import Product from "./pages/Product/Product.jsx";
import PublicRoute from "./utils/PublicRoute.jsx";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    <div>

        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/Store" element={<Store />} />
                <Route path="/SignUp" element={<PublicRoute> <SignUp /> </PublicRoute>} />
                <Route path="/login" element={<PublicRoute> <Login /> </PublicRoute>} />
                <Route path="/Product" element={<Product/>}/>
                <Route path="/verification" element={<PublicRoute> <Verification /> </PublicRoute>} />
                <Route path="/reset-password" element={<ResetPassword />} />
            </Routes>
        </Router>

    </div>
  );
}

export default App;
