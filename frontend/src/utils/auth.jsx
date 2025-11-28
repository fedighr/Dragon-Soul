import { jwtDecode } from "jwt-decode";

export const isLoggedIn = () => {
  const token = localStorage.getItem("access");
  if (!token) return false;

  try {
    const decoded = jwtDecode(token);
    return decoded.exp * 1000 > Date.now();
  } catch {
    return false;
  }
};