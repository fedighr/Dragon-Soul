import React from "react";
import Home from "./pages/home/Home";
import Store from "./pages/Store/StorePage.jsx";
import Login from "./pages/Auth/Login.jsx";
import SignUp from "./pages/Auth/SignUp.jsx";
import ResetPassword from "./pages/Auth/ResetPassword.jsx";
import Verification from "./pages/Auth/Verification.jsx";
import Product from "./pages/Product/Product.jsx";
import PublicRoute from "./utils/PublicRoute.jsx";
import PrivateRoute from "./utils/PrivateRoute.jsx";
import Header from "./components/layout/Header/Header.jsx";
import CartPage from "./pages/Cart/Cart.jsx";
import Cart from "./components/layout/Cart/CartSlideIn.jsx";
import CartTest from "./CartTest.jsx";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { CartProvider } from "./components/layout/Context/CartContext.jsx";

function AppWrapper() {
  const location = useLocation();

  const noHeaderRoutes = ["/login", "/signup", "/reset-password", "/verification"];
  const showHeader = !noHeaderRoutes.includes(location.pathname);

  return (
    <>
      {showHeader && (
        <>
          <Header />
          <Cart />
        </>
      )}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Store" element={<Store />} />

        <Route
          path="/SignUp"
          element={
            <PublicRoute>
              <SignUp />
            </PublicRoute>
          }
        />

        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />

        <Route path="/Product/:id" element={<Product />} />

        <Route
          path="/cart"
          element={
            <PrivateRoute>
              <CartPage />
            </PrivateRoute>
          }
        />

        <Route path="/test" element={<CartTest />} />

        <Route
          path="/verification"
          element={
            <PublicRoute>
              <Verification />
            </PublicRoute>
          }
        />

        <Route path="/reset-password" element={<ResetPassword />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <Router>
      <CartProvider>
        <AppWrapper />
      </CartProvider>
    </Router>
  );
}

export default App;
