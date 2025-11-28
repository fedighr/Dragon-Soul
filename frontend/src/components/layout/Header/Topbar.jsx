import React, { useState, useEffect } from "react";
import "./Topbar.css";
import { Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { useLogout } from "../../../hooks/useLogout.js";
import { isLoggedIn } from  "../../../utils/auth.jsx";


const Topbar = () => {
  const logout = useLogout();
  const [user, setUser] = useState(null);

    useEffect(() => {
      const token = localStorage.getItem("access");
      if (token && isLoggedIn()) {
        try {
          setUser(jwtDecode(token));
        } catch (error) {
          console.error("Invalid token", error);
          setUser(null);
        }
      } else {
        setUser(null);

      }
    }, []);

  const handleLogout = () => {
    logout();
    setUser(null);
    window.location.reload();
  };


  return (
    <div className="topbar">
      <div className="connexion">
        {user ? (
          <>
            <span>Welcome, {user.username}</span>
            <Link to="#" onClick={(e) => { e.preventDefault(); handleLogout(); }}>
              Logout
            </Link>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <span> | </span>
            <Link to="/signup">Sign Up</Link>
          </>
        )}
      </div>

      <div className="contacts">
        <a href="#" className="bi bi-facebook" title="Facebook"></a>
        <a href="#" className="bi bi-instagram" title="Instagram"></a>
        <a href="#" className="bi bi-twitter" title="Twitter"></a>
        <a href="#" className="bi bi-linkedin" title="LinkedIn"></a>
      </div>

      <div className="notif-card">
        <i className="bi bi-bell fs-6">
          <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
          </span>
        </i>
        <span> | </span>
        <i className="bi bi-cart fs-6">
          <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"></span>
        </i>
      </div>
    </div>
  );
};

export default Topbar;
