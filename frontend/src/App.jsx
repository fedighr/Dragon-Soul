import React from "react";
import Home from "./pages/home/Home";
import Store from "./pages/Store/StorePage.jsx";
import Login from "./pages/Auth/Login.jsx";
import SignUp from "./pages/Auth/SignUp.jsx";
import ResetPassword from "./pages/Auth/ResetPassword.jsx";
import Verification from "./pages/Auth/Verification.jsx";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    <div>

        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/Store" element={<Store />} />
                <Route path="/SignUp" element={<SignUp />} />
                <Route path="/login" element={<Login />} />
                <Route path="/verification" element={<Verification />} />
                <Route path="/reset-password" element={<ResetPassword />} />
            </Routes>
        </Router>

    </div>
  );
}

export default App;
