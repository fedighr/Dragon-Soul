import React from "react";
import Home from "./pages/home/Home";
import Store from "./pages/Store/StorePage.jsx";
import Product from "./pages/product/Product.jsx";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    <div>

        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/Store" element={<Store />} />
                <Route path="/product" element={<Product />} />
            </Routes>
        </Router>

    </div>
  );
}

export default App;
