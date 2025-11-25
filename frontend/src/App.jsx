import React from "react";
import Home from "./pages/home/Home";
import Store from "./pages/Store/StorePage.jsx";
import Login from "./pages/Auth/Login.jsx";
import SignUp from "./pages/Auth/SignUp.jsx";
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
            </Routes>
        </Router>

    </div>
  );
}

export default App;
