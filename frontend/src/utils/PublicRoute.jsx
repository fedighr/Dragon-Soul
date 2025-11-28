import { Navigate } from "react-router-dom";
import { isLoggedIn } from "./auth.jsx";

const PublicRoute = ({ children }) => {
    console.log(children);
  return isLoggedIn() ? <Navigate to="/" /> : children;
};

export default PublicRoute;