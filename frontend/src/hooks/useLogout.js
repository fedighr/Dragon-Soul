import { useNavigate } from "react-router-dom";

export const useLogout = () => {
  const navigate = useNavigate();

  const logout = () => {
    try {
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
        navigate("/");
    } catch (error) {
        console.error("Logout failed:", error);
    }
  };

  return logout;
};
